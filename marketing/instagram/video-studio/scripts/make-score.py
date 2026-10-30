"""An original quiet plucked instrumental bed, with no third-party samples."""
from pathlib import Path
import wave
import numpy as np
root=Path(__file__).resolve().parents[1]
sr=48000;duration=18.5;audio=np.zeros((int(sr*duration),2),np.float64)
rng=np.random.default_rng(301026);beat=60/92
# Dmaj9 / Gmaj7, a restrained original arpeggio under the spoken voice.
chords=[[146.832,184.997,220.,277.183,329.628],[146.832,195.998,246.942,293.665,369.994]]
pattern=[0,2,4,1,3,2,4,1]
for index,start in enumerate(np.arange(.08,duration,beat/2)):
    freq=chords[(index//16)%2][pattern[index%8]]
    length=min(2.5,duration-start);t=np.arange(int(sr*length))/sr
    envelope=(1-np.exp(-t/.008))*np.exp(-t/0.65)
    tone=sum((np.sin(2*np.pi*freq*(partial+1)*t+rng.uniform(-.1,.1))/(partial+1)**2.2) for partial in range(5))
    tone*=envelope*.022
    pan=.35+.3*(index%3)/2
    offset=int(start*sr);audio[offset:offset+len(t),0]+=tone*np.sqrt(1-pan);audio[offset:offset+len(t),1]+=tone*np.sqrt(pan)
# A soft low root on the longer pulse, kept well below narration.
for start in np.arange(0,duration,beat*4):
    t=np.arange(int(sr*min(2.2,duration-start)))/sr
    tone=np.sin(2*np.pi*73.416*t)*(1-np.exp(-t/.025))*np.exp(-t/.8)*.012
    offset=int(start*sr);audio[offset:offset+len(t)]+=tone[:,None]
fade=np.minimum(np.arange(len(audio))/(sr*.3),1)*np.minimum((len(audio)-1-np.arange(len(audio)))/(sr*.9),1)
audio*=fade[:,None]
out=root/'output/realistic-v5/music-original.wav'
with wave.open(str(out),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(audio,-1,1)*32767).astype('<i2').tobytes())
print('Original instrumental written:',duration,'seconds')
