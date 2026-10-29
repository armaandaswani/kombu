"""Local Portuguese narration. Uses built-in synthetic voice, never a person's sample."""
import os
os.environ.setdefault('PYTORCH_ENABLE_MPS_FALLBACK', '1')
import sys, json, random
from pathlib import Path
import numpy as np
import soundfile as sf
import torch
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
p = json.loads(Path(sys.argv[1]).read_text())
random.seed(17); np.random.seed(17); torch.manual_seed(17)
device = 'mps' if torch.backends.mps.is_available() else 'cpu'
print(f'Chatterbox multilingual / {device}', flush=True)
model = ChatterboxMultilingualTTS.from_pretrained(device=device)
wav = model.generate(p['narration'], language_id='pt', exaggeration=0.35, cfg_weight=0.5)
sf.write(sys.argv[2], wav.detach().cpu().squeeze().numpy(), model.sr)
print('Narração concluída', flush=True)
