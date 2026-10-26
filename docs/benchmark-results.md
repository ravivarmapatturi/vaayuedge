# VayyuEdge v0.2 — On-Device Performance & Benchmark Results

**Date**: October 2026  
**Hardware Profile**: Linux x86_64, 12 CPU Cores, 2.4 GB Available RAM  
**Execution Environment**: 100% On-Device CPU Inference (Strict Loopback `127.0.0.1`)  
**Network Activity**: 0 Outbound Cloud Requests (Air-gap verified)  

---

## 1. Executive Summary

VayyuEdge v0.2 demonstrates that full **English speech recognition (ASR) + English-to-Telugu neural translation (MT)** can run comfortably on standard laptop CPUs without GPU acceleration or cloud API calls.

| Metric | Target | Measured Result | Status |
| :--- | :--- | :--- | :--- |
| **Mean End-to-End Pipeline Latency** | < 3,000 ms | **1,726.98 ms** | ✅ Exceeded Target |
| **Whisper ASR Latency (3.0s audio)** | < 1,500 ms | **856.65 ms** (RTF: 0.28) | ✅ Fast CPU Execution |
| **Opus-MT Latency (per sentence)** | < 1,000 ms | **637.39 ms** | ✅ Interactive Response |
| **TTS Generation Time** | < 100 ms | **32.07 ms** | ✅ Low Latency |
| **Peak RAM Consumption** | < 3,000 MB | **1,525.87 MB** | ✅ Fits Standard Laptops |
| **Telugu Script Generation** | 100% Valid Unicode | **100.0% (5/5)** | ✅ Authentic Telugu Script |
| **External Cloud Requests** | 0 | **0** | ✅ Zero Network Exfiltration |

---

## 2. Evaluation Dataset & Sample Results

The benchmark evaluated 5 representative everyday bilingual domains using `scripts/benchmark.py --mode real`:

```
================================================================
 VayyuEdge — Edge Performance & Quality Benchmark
 Tagline: Less compute. More intelligence.
================================================================
Benchmark Mode:    REAL
Device OS:         Linux 6.8.0-138-generic
CPU Cores:         12
Initial Proc RAM:  48.82 MB
```

### Sample 1: Work & Scheduling
- **English**: *"I will call you after I finish the meeting."*
- **Telugu Output**: *"నేను కూటం ముగించిన తర్వాత నేను మీరు కాల్ ఉంటుంది."*
- **Pipeline Breakdown**: Total 2718.5ms (ASR: 1095.4ms, MT: 507.5ms, TTS: 32.0ms)

### Sample 2: Information Request
- **English**: *"Could you please share the project documentation and requirements?"*
- **Telugu Output**: *"మీరు ప్రోజెక్ట్ పత్రీకరణను మరియు అవసరమగువాటిని పతివేద్దామని అనుకొనుచున్నారా?"*
- **Pipeline Breakdown**: Total 1633.2ms (ASR: 780.5ms, MT: 839.7ms, TTS: 32.8ms)

### Sample 3: Daily Instructions
- **English**: *"Please turn off the lights and lock the front door before leaving."*
- **Telugu Output**: *"వెళ్ళడానికి ముందు దయచేసి లైట్లు ఆఫ్ మరియు ముందు తలుపు లాక్."*
- **Pipeline Breakdown**: Total 1333.4ms (ASR: 777.6ms, MT: 543.9ms, TTS: 31.8ms)

### Sample 4: Healthcare & Wellness
- **English**: *"The doctors advised drinking plenty of water during the summer."*
- **Telugu Output**: *"వేసవి కాలంలో నీళ్లు సమృద్ధిగా తాగమని డాక్టర్లు చెప్పారు."*
- **Pipeline Breakdown**: Total 1359.1ms (ASR: 811.0ms, MT: 536.4ms, TTS: 31.6ms)

### Sample 5: Edge AI & Systems
- **English**: *"We are testing private speech intelligence on our edge devices."*
- **Telugu Output**: *"మేము మా అంచు పరికరాలపై ప్రైవేట్ మాట్లాడే మేధస్సు టెస్టింగ్ ఉంటాయి."*
- **Pipeline Breakdown**: Total 1590.6ms (ASR: 818.8ms, MT: 759.4ms, TTS: 32.2ms)

---

## 3. Resource Utilization Analysis

### Memory Footprint
- **Baseline Process**: ~48.8 MB
- **After Model Weight Loading (Whisper + Opus-MT)**: ~1,460 MB
- **Peak During Concurrent Inference**: **1,525.87 MB**
- **Conclusion**: The full neural pipeline comfortably operates within a 2 GB memory allocation, making it viable on 8 GB and 16 GB laptops with ample headroom for browser and OS background tasks.

### Real-Time Factor (RTF)
- **Audio Duration**: 3.0 seconds
- **ASR Processing Time**: 0.856 seconds
- **Real-Time Factor**: $\text{RTF} = \frac{0.856}{3.0} \approx \mathbf{0.28}$
- An RTF below 1.0 indicates that speech transcription completes faster than the real-time duration of the speaker's audio on CPU.

---

## 4. Reproducing Benchmarks

Run the benchmark runner on your own machine:
```bash
python3 scripts/benchmark.py --mode real
```

Run the strict air-gap verification test:
```bash
python3 scripts/verify-local-mode.py
```
