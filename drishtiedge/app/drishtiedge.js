/**
 * DrishtiEdge — In-Browser Edge Computer Vision
 * Runs YOLOX-Nano single-threaded WASM via ONNX Runtime Web.
 * Zero frames stored, zero bytes egressed to external servers.
 */

// ==========================================
// 1. Real-Time Network Activity Auditor
// ==========================================
(function initNetworkAuditor() {
  window.__uploadedBytes = 0;
  window.__networkAuditLog = [];

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
// 2. Constants & Model Configuration
// ==========================================
const COCO_CLASSES = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light",
  "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
  "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
  "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove", "skateboard", "surfboard",
  "tennis racket", "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
  "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch",
  "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", "keyboard", "cell phone",
  "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors", "teddy bear",
  "hair drier", "toothbrush"
];

// Configure ONNX Runtime Web WASM single-thread
if (window.ort) {
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.simd = true;
}

// App State
let session = null;
let currentSourceImage = null; // HTMLImageElement or Video frame
let currentRawDetections = [];
let confidenceThreshold = 0.30;
let isCameraRunning = false;
let cameraStream = null;
let cameraAnimFrameId = null;
let isProcessingFrame = false;

// DOM Elements
const canvas = document.getElementById('detectionCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const cameraVideo = document.getElementById('cameraVideo');
const emptyState = document.getElementById('emptyState');
const errorBanner = document.getElementById('errorBanner');
const errorText = document.getElementById('errorText');
const confSlider = document.getElementById('confSlider');
const confValueDisplay = document.getElementById('confValueDisplay');
const detCountDisplay = document.getElementById('detCount');
const detectionsList = document.getElementById('detectionsList');
const latencyMetric = document.getElementById('latencyMetric');
const memoryMetric = document.getElementById('memoryMetric');
const initTimeMetric = document.getElementById('initTimeMetric');
const btnSample = document.getElementById('btnSample');
const btnCamera = document.getElementById('btnCamera');
const btnDetect = document.getElementById('btnDetect');
const fileInput = document.getElementById('fileInput');

// ==========================================
// 3. Error Handling Helpers
// ==========================================
function showError(title, message) {
  if (errorBanner && errorText) {
    errorText.innerHTML = `<strong>${title}</strong>${message}`;
    errorBanner.style.display = 'block';
  }
}

function clearError() {
  if (errorBanner) {
    errorBanner.style.display = 'none';
  }
}

// ==========================================
// 4. Model Loading & Initialization
// ==========================================
async function getModelSession() {
  if (session) return session;
  if (!window.ort) {
    showError("Runtime Not Loaded", "ONNX Runtime Web script failed to load. Ensure files in vendor/ are present.");
    return null;
  }

  const t0 = performance.now();
  if (initTimeMetric) initTimeMetric.textContent = "Loading...";

  try {
    session = await ort.InferenceSession.create('./models/yolox_nano.onnx', {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    });
    const duration = (performance.now() - t0).toFixed(1);
    if (initTimeMetric) initTimeMetric.textContent = `${duration} ms`;
    return session;
  } catch (err) {
    console.error("Failed to load YOLOX-Nano ONNX model:", err);
    showError("Model Loading Failed", `Could not initialize YOLOX-Nano model: ${err.message || err}. Check that WebAssembly is supported in your browser.`);
    if (initTimeMetric) initTimeMetric.textContent = "Error";
    return null;
  }
}

// ==========================================
// 5. Image Preprocessing for YOLOX
// ==========================================
function preprocessImage(imageSource, targetSize = 416) {
  const srcW = imageSource.videoWidth || imageSource.naturalWidth || imageSource.width;
  const srcH = imageSource.videoHeight || imageSource.naturalHeight || imageSource.height;

  const offCanvas = document.createElement('canvas');
  offCanvas.width = targetSize;
  offCanvas.height = targetSize;
  const offCtx = offCanvas.getContext('2d');

  const scale = Math.min(targetSize / srcW, targetSize / srcH);
  const nw = Math.round(srcW * scale);
  const nh = Math.round(srcH * scale);
  const padLeft = Math.floor((targetSize - nw) / 2);
  const padTop = Math.floor((targetSize - nh) / 2);

  // Fill with YOLOX background color (114)
  offCtx.fillStyle = '#727272';
  offCtx.fillRect(0, 0, targetSize, targetSize);
  offCtx.drawImage(imageSource, 0, 0, srcW, srcH, padLeft, padTop, nw, nh);

  const imgData = offCtx.getImageData(0, 0, targetSize, targetSize);
  const channelSize = targetSize * targetSize;
  const float32 = new Float32Array(3 * channelSize);

  // Convert to BGR format
  for (let i = 0; i < channelSize; i++) {
    const r = imgData.data[i * 4];
    const g = imgData.data[i * 4 + 1];
    const b = imgData.data[i * 4 + 2];
    float32[i] = b;                   // Channel 0: B
    float32[channelSize + i] = g;     // Channel 1: G
    float32[2 * channelSize + i] = r; // Channel 2: R
  }

  return {
    tensor: new ort.Tensor('float32', float32, [1, 3, targetSize, targetSize]),
    scale,
    padLeft,
    padTop,
    srcW,
    srcH
  };
}

// ==========================================
// 6. YOLOX Post-Processing & NMS
// ==========================================
function decodeYoloxOutput(outData, scale, padLeft, padTop, origW, origH) {
  const strides = [8, 16, 32];
  const targetSize = 416;
  let ptr = 0;
  const candidates = [];

  for (const s of strides) {
    const gw = Math.floor(targetSize / s);
    const gh = Math.floor(targetSize / s);
    for (let y = 0; y < gh; y++) {
      for (let x = 0; x < gw; x++) {
        const rowOffset = ptr * 85;
        const objConf = outData[rowOffset + 4];
        if (objConf > 0.05) {
          let maxCls = 0;
          let maxScore = 0;
          for (let c = 0; c < 80; c++) {
            const sc = outData[rowOffset + 5 + c];
            if (sc > maxScore) {
              maxScore = sc;
              maxCls = c;
            }
          }
          const finalScore = objConf * maxScore;
          if (finalScore > 0.08) {
            const cx = (outData[rowOffset + 0] + x) * s;
            const cy = (outData[rowOffset + 1] + y) * s;
            const w = Math.exp(outData[rowOffset + 2]) * s;
            const h = Math.exp(outData[rowOffset + 3]) * s;

            const x1 = Math.max(0, (cx - w / 2 - padLeft) / scale);
            const y1 = Math.max(0, (cy - h / 2 - padTop) / scale);
            const x2 = Math.min(origW, (cx + w / 2 - padLeft) / scale);
            const y2 = Math.min(origH, (cy + h / 2 - padTop) / scale);

            candidates.push({
              x: x1,
              y: y1,
              w: Math.max(0, x2 - x1),
              h: Math.max(0, y2 - y1),
              score: finalScore,
              clsId: maxCls
            });
          }
        }
        ptr++;
      }
    }
  }

  // Non-Maximum Suppression (IoU 0.45)
  candidates.sort((a, b) => b.score - a.score);
  const nmsThreshold = 0.45;
  const keep = [];

  while (candidates.length > 0) {
    const curr = candidates.shift();
    keep.push(curr);
    for (let i = candidates.length - 1; i >= 0; i--) {
      const b = candidates[i];
      const interW = Math.max(0, Math.min(curr.x + curr.w, b.x + b.w) - Math.max(curr.x, b.x));
      const interH = Math.max(0, Math.min(curr.y + curr.h, b.y + b.h) - Math.max(curr.y, b.y));
      const inter = interW * interH;
      const union = curr.w * curr.h + b.w * b.h - inter;
      if (union > 0 && inter / union > nmsThreshold) {
        candidates.splice(i, 1);
      }
    }
  }

  return keep;
}

// ==========================================
// 7. Render & Visualization
// ==========================================
function renderDetections() {
  if (!currentSourceImage || !ctx) return;

  const srcW = currentSourceImage.videoWidth || currentSourceImage.naturalWidth || currentSourceImage.width;
  const srcH = currentSourceImage.videoHeight || currentSourceImage.naturalHeight || currentSourceImage.height;

  canvas.width = srcW;
  canvas.height = srcH;
  ctx.drawImage(currentSourceImage, 0, 0, srcW, srcH);

  const activeDetections = currentRawDetections.filter(d => d.score >= confidenceThreshold);

  // Update object count and list
  if (detCountDisplay) detCountDisplay.textContent = activeDetections.length;

  if (detectionsList) {
    if (activeDetections.length === 0) {
      detectionsList.innerHTML = `<div style="color: var(--muted); padding: 8px 0; font-size: 0.82rem;">No objects above ${Math.round(confidenceThreshold * 100)}% confidence</div>`;
    } else {
      detectionsList.innerHTML = activeDetections.map(d => `
        <div class="detection-pill">
          <span class="detection-name">${COCO_CLASSES[d.clsId]}</span>
          <span class="detection-conf">${(d.score * 100).toFixed(1)}%</span>
        </div>
      `).join('');
    }
  }

  // Draw boxes and labels
  activeDetections.forEach(d => {
    ctx.strokeStyle = '#5eead4';
    ctx.lineWidth = Math.max(2, Math.round(srcW / 300));
    ctx.strokeRect(d.x, d.y, d.w, d.h);

    // Box tint
    ctx.fillStyle = 'rgba(94, 234, 212, 0.15)';
    ctx.fillRect(d.x, d.y, d.w, d.h);

    // Label pill
    const label = `${COCO_CLASSES[d.clsId]} ${(d.score * 100).toFixed(0)}%`;
    const fontSize = Math.max(12, Math.round(srcW / 45));
    ctx.font = `600 ${fontSize}px "DM Sans", sans-serif`;
    const textWidth = ctx.measureText(label).width;
    const padding = 6;
    const pillHeight = fontSize + padding * 2;
    const pillY = Math.max(0, d.y - pillHeight);

    ctx.fillStyle = '#07110f';
    ctx.fillRect(d.x, pillY, textWidth + padding * 2, pillHeight);
    ctx.strokeStyle = '#22322d';
    ctx.lineWidth = 1;
    ctx.strokeRect(d.x, pillY, textWidth + padding * 2, pillHeight);

    ctx.fillStyle = '#5eead4';
    ctx.fillText(label, d.x + padding, pillY + fontSize + 2);
  });
}

// ==========================================
// 8. Inference Pipeline
// ==========================================
async function runInferenceOnCurrentSource() {
  if (!currentSourceImage) return;

  const sess = await getModelSession();
  if (!sess) return;

  clearError();
  if (emptyState) emptyState.style.display = 'none';

  const pre = preprocessImage(currentSourceImage);
  const t0 = performance.now();

  try {
    const results = await sess.run({ images: pre.tensor });
    const latency = (performance.now() - t0).toFixed(1);
    if (latencyMetric) latencyMetric.textContent = `${latency} ms`;

    if (performance.memory && memoryMetric) {
      const heapMb = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
      memoryMetric.textContent = `${heapMb} MB`;
    }

    const outData = results.output.data;
    currentRawDetections = decodeYoloxOutput(outData, pre.scale, pre.padLeft, pre.padTop, pre.srcW, pre.srcH);
    renderDetections();
  } catch (err) {
    console.error("Inference execution failed:", err);
    showError("Inference Error", `Inference execution failed: ${err.message || err}`);
  }
}

// ==========================================
// 9. Input Source Handlers
// ==========================================

// Sample Image
function loadSampleImage() {
  stopCamera();
  clearError();
  const img = new Image();
  img.onload = () => {
    currentSourceImage = img;
    runInferenceOnCurrentSource();
  };
  img.onerror = () => {
    showError("Sample Load Error", "Failed to load sample image file.");
  };
  img.src = './sample/street.jpg';
}

// File Upload
function handleFileInput(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showError("Unsupported File", `The selected file "${file.name}" is not a supported image format. Please select a JPEG, PNG, or WebP image.`);
    e.target.value = '';
    return;
  }

  stopCamera();
  clearError();

  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      currentSourceImage = img;
      runInferenceOnCurrentSource();
    };
    img.onerror = () => {
      showError("Image Read Error", "Failed to decode the uploaded image file.");
    };
    img.src = evt.target.result;
  };
  reader.onerror = () => {
    showError("File Error", "Could not read the uploaded file.");
  };
  reader.readAsDataURL(file);
}

// Live Camera Loop
async function startCamera() {
  clearError();
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showError("Camera Unavailable", "Camera API (getUserMedia) is not supported in this browser environment.");
    return;
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    });

    cameraVideo.srcObject = cameraStream;
    await cameraVideo.play();

    isCameraRunning = true;
    currentSourceImage = cameraVideo;
    if (emptyState) emptyState.style.display = 'none';

    if (btnCamera) {
      btnCamera.textContent = "Stop Camera";
      btnCamera.classList.remove('btn-secondary');
      btnCamera.classList.add('btn-danger');
    }

    // Camera inference loop
    async function processCameraLoop() {
      if (!isCameraRunning) return;
      if (!isProcessingFrame && cameraVideo.readyState >= 2) {
        isProcessingFrame = true;
        await runInferenceOnCurrentSource();
        isProcessingFrame = false;
      }
      cameraAnimFrameId = requestAnimationFrame(processCameraLoop);
    }
    cameraAnimFrameId = requestAnimationFrame(processCameraLoop);
  } catch (err) {
    console.error("Camera access failed:", err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      showError("Camera Access Denied", "Camera permission was denied. Please allow camera access in your browser settings or use image upload.");
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      showError("No Camera Found", "No camera device was detected on your hardware.");
    } else {
      showError("Camera Error", `Could not start video stream: ${err.message || err.name}`);
    }
    stopCamera();
  }
}

function stopCamera() {
  isCameraRunning = false;
  if (cameraAnimFrameId) {
    cancelAnimationFrame(cameraAnimFrameId);
    cameraAnimFrameId = null;
  }
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  if (cameraVideo) {
    cameraVideo.srcObject = null;
  }
  if (btnCamera) {
    btnCamera.textContent = "Live Camera";
    btnCamera.classList.remove('btn-danger');
    btnCamera.classList.add('btn-secondary');
  }
}

function toggleCamera() {
  if (isCameraRunning) {
    stopCamera();
  } else {
    startCamera();
  }
}

// ==========================================
// 10. Event Listeners & Setup
// ==========================================
if (confSlider) {
  confSlider.addEventListener('input', (e) => {
    confidenceThreshold = parseFloat(e.target.value) / 100;
    if (confValueDisplay) confValueDisplay.textContent = `${Math.round(confidenceThreshold * 100)}%`;
    renderDetections();
  });
}

if (btnSample) {
  btnSample.addEventListener('click', loadSampleImage);
}

if (btnCamera) {
  btnCamera.addEventListener('click', toggleCamera);
}

if (btnDetect) {
  btnDetect.addEventListener('click', () => {
    if (currentSourceImage) runInferenceOnCurrentSource();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', handleFileInput);
}

// Drag and Drop
const viewportContainer = document.querySelector('.viewport-container');
if (viewportContainer) {
  ['dragenter', 'dragover'].forEach(name => {
    viewportContainer.addEventListener(name, (e) => {
      e.preventDefault();
      viewportContainer.style.borderColor = 'var(--accent)';
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    viewportContainer.addEventListener(name, (e) => {
      e.preventDefault();
      viewportContainer.style.borderColor = 'var(--line)';
    });
  });

  viewportContainer.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt && dt.files && dt.files[0];
    if (file) {
      handleFileInput({ target: { files: [file] } });
    }
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
