"""Original instrumental and synthesized quiet ice/water accents, no third-party samples."""
import argparse,re,wave
from pathlib import Path
import numpy as np
p=argparse.ArgumentParser();p.add_argument('--project',required=True);p.add_argument('--duration',type=float,required=True);p.add_argument('--cuts',default='');p.add_argument('--pour-start',type=float);p.add_argument('--pour-end',type=float);a=p.parse_args()
if not re.fullmatch('[a-z0-9-]+',a.project) or not 3<a.duration<60:raise ValueError('Invalid project')
sr=48000;n=int(a.duration*sr);mix=np.zeros((n,2));rng=np.random.default_rng(311026)
def add(t,x,pan=.5):
 i=int(t*sr);x=x[:n-i];mix[i:i+len(x),0]+=x*np.sqrt(1-pan);mix[i:i+len(x),1]+=x*np.sqrt(pan)
# Am9 into Fmaj7. Gentle real-time change instead of reusing the preceding film's melody.
notes=[220,329.628,493.883,261.626,349.228,440,523.251,329.628]
for k,start in enumerate(np.arange(.05,a.duration,.375)):
 t=np.arange(min(int(sr*1.5),n-int(start*sr)))/sr;f=notes[k%len(notes)]
 x=(np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*2.01*t)+.09*np.sin(2*np.pi*f*3*t))*(1-np.exp(-t/.005))*np.exp(-t/.38)*.045
 add(start,x,.25+.5*(k%3)/2)
accents=[float(t) for t in a.cuts.split(',') if t] if a.cuts else [0,2,5.625,9.041667]
for start in accents:
 if not 0<=start<a.duration:raise ValueError('Accent outside film')
 t=np.arange(min(int(sr*.38),n-int(start*sr)))/sr
 # Restrained glassy ice ticks and filtered noise, not a stock effect or somebody else's recording.
 tick=(np.sin(2*np.pi*1900*t)+.35*np.sin(2*np.pi*2780*t))*np.exp(-t/0.033)*.013
 hiss=np.convolve(rng.normal(0,1,len(t)),np.ones(25)/25,mode='same')*np.exp(-t/.12)*.016
 add(start,tick+hiss,.3 if int(start*10)%2 else .7)
# Original restrained fluid texture synchronized only to serving, not a copied sample.
if a.pour_start is not None and a.pour_end is not None:
 start,end=a.pour_start,a.pour_end
 if not 0<=start<end<=a.duration:raise ValueError('Invalid pour cue')
 t=np.arange(int((end-start)*sr))/sr
 noise=rng.normal(0,1,len(t));body=np.convolve(noise,np.ones(120)/120,mode='same')
 texture=body*(.6+.4*np.sin(2*np.pi*4.2*t)**2)
 envelope=np.minimum(t/.1,1)*np.minimum((t[-1]-t)/.12,1)
 add(start,texture*envelope*.035,.6)
# Quiet bass gives the original score a pulse, with a short room reflection.
for k,start in enumerate(np.arange(0,a.duration,1.5)):
 t=np.arange(min(int(sr*.9),n-int(start*sr)))/sr;f=110 if k%4<2 else 87.307
 x=(np.sin(2*np.pi*f*t)+.18*np.sin(2*np.pi*f*2*t))*(1-np.exp(-t/.015))*np.exp(-t/.32)*.018
 add(start,x,.5)
for delay,gain in [(.083,.13),(.139,.08)]:
 shift=int(sr*delay);mix[shift:]+=mix[:-shift,::-1]*gain
fade=np.minimum(np.arange(n)/(sr*.06),1)*np.minimum((n-1-np.arange(n))/(sr*.32),1);mix*=fade[:,None]
out=Path(__file__).resolve().parents[1]/'output'/a.project/'score-original.wav';out.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(out),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
print('Original cold-water score:',a.duration,'seconds')
