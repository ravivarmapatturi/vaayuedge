"""Wait for the already-started dependency/model downloads, then evaluate once."""
import subprocess,time,os,sys
from pathlib import Path
python='/tmp/inferedge-indic-env/bin/python'
probe="from transformers import AutoTokenizer; from IndicTransToolkit.processor import IndicProcessor; from huggingface_hub import hf_hub_download; hf_hub_download('ai4bharat/indictrans2-en-indic-dist-200M','model.safetensors',revision='2cfd0a20057756d756bf3e53528f492afc52f91a',local_files_only=True)"
for attempt in range(120):
 r=subprocess.run([python,'-c',probe],capture_output=True,text=True)
 if r.returncode==0:
  os.execv(python,[python,'-u',str(Path(__file__).with_name('benchmark-indictrans2.py'))])
 if attempt%6==0:print('Waiting for package/model availability:',r.stderr[-700:],flush=True)
 time.sleep(15)
raise SystemExit('Preparation not ready within 30 minutes; see download sessions')
