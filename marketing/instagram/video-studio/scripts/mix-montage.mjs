import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {root} from './prepare.mjs';
const out=join(root,'output/realistic-v5');
execFileSync(join(root,'../.render/video-tools/ltx-2-mlx/.venv/bin/python'),[join(root,'scripts/make-score.py')],{stdio:'inherit'});
const filter='[0:a]aformat=channel_layouts=stereo[v];[1:a]loudnorm=I=-30:TP=-9:LRA=5[m];[2:a]atrim=start=0.15:end=6.1,asetpts=PTS-STARTPTS,highpass=f=160,lowpass=f=7000,afade=t=in:d=0.08,afade=t=out:st=5.6:d=0.35,volume=0.17,adelay=5875|5875[s];[v][m][s]amix=inputs=3:duration=longest:normalize=0,alimiter=limit=0.891:level=0,apad,atrim=duration=18.5[out]';
execFileSync('/opt/homebrew/bin/ffmpeg',['-v','error','-y','-i',join(out,'voice-master.wav'),'-i',join(out,'music-original.wav'),'-i',join(root,'assets/audio/pouring-water-edschaefer-cc0.mp3'),'-filter_complex',filter,'-map','[out]','-ar','48000',join(out,'mix.wav')],{stdio:'inherit'});
