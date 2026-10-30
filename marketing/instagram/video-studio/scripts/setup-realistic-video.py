"""Download only the components used by the local, silent I2V trial.
Run using the isolated ltx-2-mlx .venv, not the HumanVoice environment.
"""
import json
import os
import shutil
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
os.environ.setdefault("HF_HUB_DISABLE_IMPLICIT_TOKEN", "1")
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
os.environ.setdefault("HF_HUB_DOWNLOAD_TIMEOUT", "60")
from huggingface_hub import HfApi, hf_hub_download

root=Path(__file__).resolve().parents[1]
models=root.parent/'.render/video-tools/realistic-models'
models.mkdir(parents=True,exist_ok=True)
api=HfApi(token=False)
plans=[('dgrauet/ltx-2.3-mlx-q4','ltx-q4',{
    'LICENSE','README.md','config.json','embedded_config.json','quantize_config.json','split_model.json',
    'connector.safetensors','transformer-distilled.safetensors','vae_decoder.safetensors',
    'vae_encoder.safetensors','audio_vae.safetensors','vocoder.safetensors',
    'spatial_upscaler_x2_v1_1.safetensors','spatial_upscaler_x2_v1_1_config.json',
}),('mlx-community/gemma-3-12b-it-4bit','gemma-q4',None)]
resolved=[]
for repo,name,allow in plans:
    print("Reading metadata: "+repo,flush=True)
    info=api.model_info(repo,files_metadata=True,timeout=30)
    files=[f for f in info.siblings if allow is None or f.rfilename in allow]
    if allow is not None and allow-{f.rfilename for f in files}:
        raise RuntimeError('Missing required model component')
    size=sum(f.size or 0 for f in files)
    resolved.append(dict(repo=repo,name=name,revision=info.sha,files=[f.rfilename for f in files],sizes={f.rfilename:f.size for f in files},bytes=size))
print(json.dumps([dict(repo=p['repo'],revision=p['revision'],GB=round(p['bytes']/1e9,2)) for p in resolved]),flush=True)
# Budget for the complete selected packages plus free working space; no full repository downloads.
cached=sum(f.stat().st_size for f in models.rglob("*") if f.is_file())
if shutil.disk_usage(models).free < max(0,sum(p['bytes'] for p in resolved)-cached)+8*1024**3:
    raise RuntimeError('Insufficient free disk for selected models and working reserve')
(root/'output/realistic-v4/models.json').write_text(json.dumps(resolved,indent=2))
def download(p):
    print('Downloading '+p['repo'],flush=True)
    def fetch(filename):
        target=models/p['name']/filename
        expected=p['sizes'][filename]
        if target.is_file() and target.stat().st_size==expected:
            return
        print('Fetching '+p['name']+'/'+filename,flush=True)
        hf_hub_download(repo_id=p['repo'],revision=p['revision'],filename=filename,
            local_dir=models/p['name'],token=False)
        if not target.is_file() or target.stat().st_size!=expected:
            raise RuntimeError('Incomplete model component: '+filename)
        print('Verified '+p['name']+'/'+filename,flush=True)
    with ThreadPoolExecutor(max_workers=3) as workers:
        list(workers.map(fetch,p['files']))
with ThreadPoolExecutor(max_workers=2) as pool:
    list(pool.map(download,resolved))
(root/'output/realistic-v4/models.json').write_text(json.dumps(resolved,indent=2))
print('Selected local models ready',flush=True)
