"""Explicit anonymous trial on the public official Lightricks demo.
No account token, paid provider, credit purchase or automatic provider switching.
"""
import json, shutil, time
import httpx
from pathlib import Path
from gradio_client import Client, handle_file

root=Path(__file__).resolve().parents[1]
out=root/'output/realistic-v4'
p=json.loads((root/'projects/realistic-v4.json').read_text())
s=p['shots']['pour']
source=root/s['image']
endpoint='https://lightricks-ltx-2-3.hf.space'
print('Connecting to the official public LTX-2.3 demo anonymously',flush=True)
c=Client(endpoint,token=False,verbose=False,httpx_kwargs={'timeout':20},download_files=out/'space-files',analytics_enabled=False)
# A stream reconnect resumes this same job/session; it never submits a new generation.
original_stream=c.stream_messages
def resilient_stream(*args,**kwargs):
    for attempt in range(3):
        try:return original_stream(*args,**kwargs)
        except (httpx.ConnectTimeout,httpx.ReadTimeout,httpx.ReadError):
            if attempt==2:raise
            print('Reconnecting result stream for the same request',flush=True)
            time.sleep(2)
c.stream_messages=resilient_stream
(out/'demo-session.json').write_text(json.dumps(dict(provider=endpoint,session_hash=c.session_hash,event_id=None)))
args=dict(input_image=handle_file(str(source)),prompt=s['prompt'],duration=3.0,enhance_prompt=False,seed=p['seed'],randomize_seed=False,height=1024,width=576)
(out/'demo-request.json').write_text(json.dumps(dict(provider=endpoint,api_name='/generate_video',**{k:v for k,v in args.items() if k!='input_image'},image=str(source)),indent=2))
print('Submitting one 3-second I2V trial to the free demo',flush=True)
job=c.submit(**args,api_name='/generate_video')
previous=None
while not job.done():
    status=job.status()
    event_id=getattr(job.communicator,'event_id',None)
    if event_id:(out/'demo-session.json').write_text(json.dumps(dict(provider=endpoint,session_hash=c.session_hash,event_id=event_id)))
    line=str(status.code)
    if line!=previous:
        print(line,flush=True);previous=line
        (out/'demo-status.json').write_text(json.dumps(dict(state=line,at=time.time())))
    time.sleep(5)
result=job.result()
(out/'demo-result.json').write_text(json.dumps(result,default=str,indent=2))
print('Demo returned a result',flush=True)
video=result[0] if isinstance(result,(tuple,list)) else result
if isinstance(video,dict):video=video.get('video',video)
if isinstance(video,dict):video=video.get('path')
if not video or not Path(video).is_file():raise RuntimeError('The demo did not return a usable video. No finished video was created.')
shutil.copy2(video,out/'pour-demo.mp4')
print('Video downloaded for review: '+str(out/'pour-demo.mp4'),flush=True)
