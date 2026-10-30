"""Analyze label motion in video; writes only geometry, never edits source images."""
import json,sys,re
from pathlib import Path
import cv2
import numpy as np
root=Path(__file__).resolve().parents[1]
name=sys.argv[1]
project_id=sys.argv[2] if len(sys.argv)>2 else 'realistic-v4'
if not re.fullmatch(r'[a-z0-9-]+',name) or not re.fullmatch(r'[a-z0-9-]+',project_id):raise ValueError('Invalid identifier')
p=json.loads((root/'projects'/f'{project_id}.json').read_text())
if name not in p['shots']:raise ValueError('Invalid shot')
cap=cv2.VideoCapture(str(root/'output'/project_id/f'{name}.mp4'))
w,h=int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
if not w or not h: raise ValueError('Missing video')
source=cv2.imread(str(root/p['shots'][name]['image']))
# Scale for feature analysis only; the compositor uses the unchanged original PNG.
source=cv2.resize(source,(w,h))
if p['shots'][name].get('labelPolygon'):
    polygon=np.array(p['shots'][name]['labelPolygon'],np.float32)
elif name=='pour':
    polygon=np.array([[268,465],[497,510],[438,765],[133,679],[166,494],[183,509],[208,525],[248,519],[263,488]],np.float32)/[940,1672]
elif name=='close':
    polygon=np.array([[.29,.37],[.415,.37],[.44,.335],[.50,.325],[.56,.34],[.585,.37],[.71,.37],[.71,.75],[.29,.75]],np.float32)
else:raise ValueError('Missing label polygon')
points=(polygon*[w,h]).astype(np.int32)
mask=np.zeros((h,w),np.uint8);cv2.fillPoly(mask,[points],255)
search=cv2.dilate(mask,np.ones((51,51),np.uint8))
sift=cv2.SIFT_create(nfeatures=2500)
k0,d0=sift.detectAndCompute(cv2.cvtColor(source,cv2.COLOR_BGR2GRAY),mask)
matcher=cv2.BFMatcher()
rows=[];previous=np.eye(3);accepted=0;previous_gray=None;hidden=0
max_step=p['shots'][name].get('maxLabelStep',10)
may_exit=p['shots'][name].get('labelMayExit',False)
while True:
    ok,frame=cap.read()
    if not ok:break
    gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    if may_exit:
        hsv=cv2.cvtColor(frame,cv2.COLOR_BGR2HSV)
        pink=cv2.inRange(hsv,np.array([140,50,50]),np.array([179,255,255]))
        if int((pink>0).sum())<1000:
            rows.append({'matrix':previous.tolist(),'inliers':0,'matched':False,'visible':False})
            hidden+=1;previous_gray=gray;continue
    keys,desc=sift.detectAndCompute(gray,search)
    pairs=matcher.knnMatch(d0,desc,k=2) if desc is not None and d0 is not None else []
    good=[a for pair in pairs if len(pair)==2 for a,b in [pair] if a.distance<.75*b.distance]
    H=None;inliers=0
    if len(good)>=12:
        src=np.float32([k0[m.queryIdx].pt for m in good]);dst=np.float32([keys[m.trainIdx].pt for m in good])
        H,keep=cv2.findHomography(src,dst,cv2.RANSAC,3)
        inliers=int(keep.sum()) if keep is not None else 0
        if H is not None:
            H=H/H[2,2]
            mapped=cv2.perspectiveTransform(points.astype(np.float32)[None],H)[0]
            prev=cv2.perspectiveTransform(points.astype(np.float32)[None],previous)[0]
            area=abs(cv2.contourArea(mapped))/max(1,abs(cv2.contourArea(points)))
            if inliers<12 or not .75<area<1.4 or np.max(np.linalg.norm(mapped-prev,axis=1))>max_step:H=None
    if H is None and previous_gray is not None:
        previous_mask=np.zeros((h,w),np.uint8)
        projected=cv2.perspectiveTransform(points.astype(np.float32)[None],previous)[0]
        cv2.fillPoly(previous_mask,[projected.astype(np.int32)],255)
        corners=cv2.goodFeaturesToTrack(previous_gray,150,.01,5,mask=previous_mask)
        if corners is not None:
            flowed,status,_=cv2.calcOpticalFlowPyrLK(previous_gray,gray,corners,None)
            valid=status.ravel()==1
            if valid.sum()>=15:
                affine,keep=cv2.estimateAffinePartial2D(corners[valid],flowed[valid],method=cv2.RANSAC,ransacReprojThreshold=2)
                if affine is not None and int(keep.sum())>=15:
                    delta=np.vstack([affine,[0,0,1]])
                    displacement=np.max(np.linalg.norm(cv2.perspectiveTransform(projected[None],delta)[0]-projected,axis=1))
                    if displacement<max(15,max_step) and .9<np.linalg.det(affine[:,:2])<1.1:
                        H=delta@previous;inliers=int(keep.sum())
    if H is not None:previous=H;accepted+=1
    rows.append({'matrix':previous.tolist(),'inliers':inliers,'matched':H is not None,'visible':True})
    previous_gray=gray
cap.release()
visible_count=len(rows)-hidden
if not visible_count or accepted<.8*visible_count:raise RuntimeError(f'Insufficient tracking coverage: {accepted}/{visible_count} visible frames')
# Offline zero-phase filtering suppresses isolated feature-match jitter without
# changing the underlying video or introducing a tracking delay.
quad=np.array([[points[:,0].min(),points[:,1].min()],[points[:,0].max(),points[:,1].min()],[points[:,0].max(),points[:,1].max()],[points[:,0].min(),points[:,1].max()]],np.float32)
trajectory=np.array([cv2.perspectiveTransform(quad[None],np.array(row['matrix']))[0] for row in rows])
padded=np.pad(trajectory,((2,2),(0,0),(0,0)),mode='edge')
median=np.array([np.median(padded[i:i+5],axis=0) for i in range(len(rows))])
padded=np.pad(median,((2,2),(0,0),(0,0)),mode='edge')
weights=np.array([1,2,3,2,1])/9
for i,row in enumerate(rows):
    destination=np.sum(padded[i:i+5]*weights[:,None,None],axis=0).astype(np.float32)
    row['matrix']=cv2.getPerspectiveTransform(quad,destination).tolist()
result={'shot':name,'width':w,'height':h,'polygon':polygon.tolist(),'frames':rows,'coverage':accepted/visible_count,'visible_frames':visible_count,'hidden_frames':hidden,'geometry_smoothed':True}
(root/'output'/project_id/f'{name}-tracking.json').write_text(json.dumps(result))
print(f'{name}: label geometry tracked in {accepted}/{visible_count} visible frames; absent in {hidden}')
