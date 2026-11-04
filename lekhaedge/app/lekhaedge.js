/**
 * LekhaEdge — In-Browser Document OCR & Field Extraction Beta
 * Runs Tesseract.js Fast LSTM (WASM) and PDF.js locally.
 * Zero document bytes or extracted data egressed to external servers.
 */

// ==========================================
// 1. Real-Time Network Activity Auditor
// ==========================================
(function initNetworkAuditor() {
  window.__uploadedBytes = 0;

  function updateEgressDisplay() {
    const el = document.getElementById('bytesUploadedMetric');
    if (el) {
      el.textContent = `${window.__uploadedBytes} B`;
      if (window.__uploadedBytes > 0) {
        el.style.color = '#f87171';
      }
    }
  }

  // Intercept fetch
  const origFetch = window.fetch;
  window.fetch = function (resource, options = {}) {
    let payloadSize = 0;
    if (options && options.body) {
      if (typeof options.body === 'string') payloadSize = options.body.length;
      else if (options.body instanceof Blob) payloadSize = options.body.size;
      else if (options.body instanceof ArrayBuffer) payloadSize = options.body.byteLength;
    }
    window.__uploadedBytes += payloadSize;
    updateEgressDisplay();
    return origFetch.apply(this, arguments);
  };

  // Intercept XMLHttpRequest
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (body) {
    let payloadSize = 0;
    if (body) {
      if (typeof body === 'string') payloadSize = body.length;
      else if (body instanceof Blob) payloadSize = body.size;
      else if (body instanceof ArrayBuffer) payloadSize = body.byteLength;
    }
    window.__uploadedBytes += payloadSize;
    updateEgressDisplay();
    return origSend.apply(this, arguments);
  };

  // Intercept sendBeacon
  if (navigator.sendBeacon) {
    const origBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function (url, data) {
      let payloadSize = 0;
      if (data) {
        if (typeof data === 'string') payloadSize = data.length;
        else if (data instanceof Blob) payloadSize = data.size;
        else if (data instanceof ArrayBuffer) payloadSize = data.byteLength;
      }
      window.__uploadedBytes += payloadSize;
      updateEgressDisplay();
      return origBeacon.apply(this, arguments);
    };
  }

  // Intercept WebSocket
  if (window.WebSocket) {
    const origWsSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
      let payloadSize = 0;
      if (data) {
        if (typeof data === 'string') payloadSize = data.length;
        else if (data instanceof Blob) payloadSize = data.size;
        else if (data instanceof ArrayBuffer) payloadSize = data.byteLength;
      }
      window.__uploadedBytes += payloadSize;
      updateEgressDisplay();
      return origWsSend.apply(this, arguments);
    };
  }
})();

// ==========================================
// 2. State & DOM References
// ==========================================
let tesseractWorker = null;
let currentDocumentCanvas = null;
let currentRawText = "";
let isProcessing = false;

const docPreview = document.getElementById('docPreview');
const previewCanvas = document.getElementById('previewCanvas');
const emptyState = document.getElementById('emptyState');
const errorBanner = document.getElementById('errorBanner');
const errorText = document.getElementById('errorText');

const inputMerchant = document.getElementById('inputMerchant');
const inputDate = document.getElementById('inputDate');
const inputTotal = document.getElementById('inputTotal');
const inputAddress = document.getElementById('inputAddress');
const rawTextOutput = document.getElementById('rawTextOutput');

const latencyMetric = document.getElementById('latencyMetric');
const memoryMetric = document.getElementById('memoryMetric');
const engineStatus = document.getElementById('engineStatus');

const btnSample = document.getElementById('btnSample');
const btnSamplePdf = document.getElementById('btnSamplePdf');
const btnUpload = document.getElementById('btnUpload');
const btnCamera = document.getElementById('btnCamera');
const btnExtract = document.getElementById('btnExtract');
const btnCopyText = document.getElementById('btnCopyText');
const btnExportJson = document.getElementById('btnExportJson');
const btnExportCsv = document.getElementById('btnExportCsv');

const fileInput = document.getElementById('fileInput');
const cameraInput = document.getElementById('cameraInput');

// ==========================================
// 3. Error Handling
// ==========================================
function showError(title, msg) {
  if (errorBanner && errorText) {
    errorText.innerHTML = `<strong>${title}</strong>${msg}`;
    errorBanner.style.display = 'block';
  }
}

function clearError() {
  if (errorBanner) {
    errorBanner.style.display = 'none';
  }
}

// ==========================================
// 4. Worker Initialization
// ==========================================
async function getWorker() {
  if (tesseractWorker) return tesseractWorker;
  if (!window.Tesseract) {
    showError("OCR Engine Missing", "Tesseract.js runtime was not loaded.");
    return null;
  }

  if (engineStatus) engineStatus.textContent = "Loading WASM core...";

  try {
    tesseractWorker = await Tesseract.createWorker('eng', 1, {
      workerPath: './vendor/worker.min.js',
      corePath: './vendor/tesseract-core.wasm.js',
      langPath: './vendor',
      cacheMethod: 'none',
      gzip: true,
      logger: m => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number') {
          if (engineStatus) engineStatus.textContent = `OCR recognizing (${Math.round(m.progress * 100)}%)...`;
        }
      }
    });

    if (engineStatus) engineStatus.textContent = "Ready (Fast LSTM)";
    return tesseractWorker;
  } catch (err) {
    console.error("Failed to initialize Tesseract Worker:", err);
    showError("OCR Initialization Failed", `Could not initialize Tesseract WebAssembly engine: ${err.message || err}`);
    if (engineStatus) engineStatus.textContent = "Init Error";
    return null;
  }
}

// ==========================================
// 5. Rule-Based Field Extraction
// ==========================================
function extractFieldsFromText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const result = {
    merchant: '',
    date: '',
    total: '',
    address: ''
  };

  if (lines.length === 0) return result;

  // 1. Merchant: First candidate line that isn't a date, time, or telephone number
  for (let i = 0; i < Math.min(lines.length, 4); i++) {
    const line = lines[i];
    if (!line.match(/date|time|tel:|tax|receipt|welcome/i) && line.length >= 3) {
      result.merchant = line;
      break;
    }
  }

  // 2. Date: Match common date formats
  const datePatterns = [
    /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/,
    /\b(\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/,
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}\b/i
  ];
  for (const line of lines) {
    for (const pat of datePatterns) {
      const match = line.match(pat);
      if (match) {
        result.date = match[1] || match[0];
        break;
      }
    }
    if (result.date) break;
  }

  // 3. Total Amount: Look for TOTAL / TOTAL AMOUNT / BALANCE DUE / AMOUNT DUE
  const totalKeywords = /(?:TOTAL\s*AMOUNT|TOTAL|AMOUNT\s*DUE|BALANCE\s*DUE|NET\s*TOTAL|SUBTOTAL)/i;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (totalKeywords.test(line)) {
      // Look for currency / number pattern
      const amountMatch = line.match(/[$€£₹]?\s*([0-9]+\.[0-9]{2})/);
      if (amountMatch) {
        result.total = `$${amountMatch[1]}`;
        break;
      }
      // Check adjacent next line if amount is separated
      if (i + 1 < lines.length) {
        const nextMatch = lines[i + 1].match(/[$€£₹]?\s*([0-9]+\.[0-9]{2})/);
        if (nextMatch) {
          result.total = `$${nextMatch[1]}`;
          break;
        }
      }
    }
  }

  // Fallback for total if keyword line missed exact decimal
  if (!result.total) {
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (/total/i.test(line)) {
        const digits = line.match(/([0-9]+[.,][0-9]{2})/);
        if (digits) {
          result.total = `$${digits[1].replace(',', '.')}`;
          break;
        }
      }
    }
  }

  // 4. Address: Match street suffixes or address indicators
  const addressKeywords = /(?:boulevard|blvd|street|st|avenue|ave|road|rd|lane|drive|dr|way|highway|hwy|suite|floor|valley)/i;
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (addressKeywords.test(line) && line !== result.merchant) {
      result.address = line;
      break;
    }
  }

  return result;
}

// ==========================================
// 6. OCR Pipeline Execution
// ==========================================
async function runOcrOnCanvas(canvas) {
  if (isProcessing) return;
  isProcessing = true;
  clearError();

  if (btnExtract) {
    btnExtract.disabled = true;
    btnExtract.textContent = "Extracting...";
  }

  const worker = await getWorker();
  if (!worker) {
    isProcessing = false;
    if (btnExtract) {
      btnExtract.disabled = false;
      btnExtract.textContent = "Extract Fields";
    }
    return;
  }

  const t0 = performance.now();
  try {
    const ret = await worker.recognize(canvas);
    const duration = (performance.now() - t0).toFixed(0);
    if (latencyMetric) latencyMetric.textContent = `${duration} ms`;

    if (performance.memory && memoryMetric) {
      const heapMb = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
      memoryMetric.textContent = `${heapMb} MB`;
    }

    currentRawText = ret.data.text || "";
    if (rawTextOutput) rawTextOutput.value = currentRawText;

    // Extract fields
    const fields = extractFieldsFromText(currentRawText);
    if (inputMerchant) inputMerchant.value = fields.merchant;
    if (inputDate) inputDate.value = fields.date;
    if (inputTotal) inputTotal.value = fields.total;
    if (inputAddress) inputAddress.value = fields.address;

    if (engineStatus) engineStatus.textContent = "Extraction complete";
  } catch (err) {
    console.error("OCR recognition error:", err);
    showError("OCR Failed", `Document recognition failed: ${err.message || err}`);
  } finally {
    isProcessing = false;
    if (btnExtract) {
      btnExtract.disabled = false;
      btnExtract.textContent = "Extract Fields";
    }
  }
}

// ==========================================
// 7. Input Document Loading
// ==========================================
function displayCanvas(canvas) {
  currentDocumentCanvas = canvas;
  if (emptyState) emptyState.style.display = 'none';
  if (docPreview) docPreview.style.display = 'none';

  if (previewCanvas) {
    previewCanvas.style.display = 'block';
    previewCanvas.width = canvas.width;
    previewCanvas.height = canvas.height;
    const ctx = previewCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);
  }
}

function loadSampleImage() {
  clearError();
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    displayCanvas(canvas);
    runOcrOnCanvas(canvas);
  };
  img.onerror = () => {
    showError("Sample Error", "Could not load sample receipt image.");
  };
  img.src = './sample/receipt.jpg';
}

async function renderPdfPageToCanvas(pdfData) {
  if (!window.pdfjsLib) {
    showError("PDF Library Error", "PDF.js was not loaded.");
    return null;
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = './vendor/pdf.worker.min.js';

  try {
    const loadingTask = pdfjsLib.getDocument(pdfData);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    return canvas;
  } catch (err) {
    console.error("Failed to render PDF page:", err);
    showError("PDF Rendering Failed", `Could not parse PDF document: ${err.message || err}`);
    return null;
  }
}

async function loadSamplePdf() {
  clearError();
  const canvas = await renderPdfPageToCanvas('./sample/receipt.pdf');
  if (canvas) {
    displayCanvas(canvas);
    runOcrOnCanvas(canvas);
  }
}

async function handleFile(file) {
  if (!file) return;
  clearError();

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    const canvas = await renderPdfPageToCanvas({ data: arrayBuffer });
    if (canvas) {
      displayCanvas(canvas);
      runOcrOnCanvas(canvas);
    }
  } else if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        displayCanvas(canvas);
        runOcrOnCanvas(canvas);
      };
      img.onerror = () => {
        showError("Image Error", "Failed to decode uploaded image.");
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      showError("File Error", "Could not read the uploaded image.");
    };
    reader.readAsDataURL(file);
  } else {
    showError("Unsupported File", `File "${file.name}" is not supported. Please upload an image (JPEG, PNG, WebP) or PDF.`);
  }
}

// ==========================================
// 8. Export Helpers
// ==========================================
function exportToJson() {
  const data = {
    product: "LekhaEdge Beta",
    merchant: (inputMerchant ? inputMerchant.value : ''),
    date: (inputDate ? inputDate.value : ''),
    total: (inputTotal ? inputTotal.value : ''),
    address: (inputAddress ? inputAddress.value : ''),
    full_text: (rawTextOutput ? rawTextOutput.value : ''),
    timestamp: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lekhaedge_extraction_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToCsv() {
  function escapeCsv(val) {
    if (!val) return '""';
    const clean = val.replace(/"/g, '""');
    return `"${clean}"`;
  }

  const headers = ["Merchant", "Date", "Total", "Address"];
  const row = [
    escapeCsv(inputMerchant ? inputMerchant.value : ''),
    escapeCsv(inputDate ? inputDate.value : ''),
    escapeCsv(inputTotal ? inputTotal.value : ''),
    escapeCsv(inputAddress ? inputAddress.value : '')
  ];

  const csvContent = headers.join(',') + '\n' + row.join(',') + '\n';
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lekhaedge_extraction_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyFullText() {
  if (!rawTextOutput) return;
  const text = rawTextOutput.value;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    if (btnCopyText) {
      const orig = btnCopyText.textContent;
      btnCopyText.textContent = "Copied!";
      setTimeout(() => { btnCopyText.textContent = orig; }, 1800);
    }
  }).catch(err => {
    console.error("Clipboard copy failed:", err);
  });
}

// ==========================================
// 9. Event Listeners & Drag and Drop
// ==========================================
if (btnSample) {
  btnSample.addEventListener('click', loadSampleImage);
}

if (btnSamplePdf) {
  btnSamplePdf.addEventListener('click', loadSamplePdf);
}

if (btnUpload) {
  btnUpload.addEventListener('click', () => fileInput && fileInput.click());
}

if (btnCamera) {
  btnCamera.addEventListener('click', () => cameraInput && cameraInput.click());
}

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
  });
}

if (cameraInput) {
  cameraInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFile(file);
  });
}

if (btnExtract) {
  btnExtract.addEventListener('click', () => {
    if (currentDocumentCanvas) runOcrOnCanvas(currentDocumentCanvas);
  });
}

if (btnCopyText) {
  btnCopyText.addEventListener('click', copyFullText);
}

if (btnExportJson) {
  btnExportJson.addEventListener('click', exportToJson);
}

if (btnExportCsv) {
  btnExportCsv.addEventListener('click', exportToCsv);
}

// Drag & Drop
const previewContainer = document.querySelector('.preview-container');
if (previewContainer) {
  ['dragenter', 'dragover'].forEach(name => {
    previewContainer.addEventListener(name, (e) => {
      e.preventDefault();
      previewContainer.style.borderColor = 'var(--accent)';
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    previewContainer.addEventListener(name, (e) => {
      e.preventDefault();
      previewContainer.style.borderColor = 'var(--line)';
    });
  });

  previewContainer.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt && dt.files && dt.files[0];
    if (file) handleFile(file);
  });
}

// Register Service Worker for offline capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn("ServiceWorker registration failed:", err);
    });
  });
}
