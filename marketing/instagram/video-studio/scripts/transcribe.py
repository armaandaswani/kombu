"""Transcribe the generated narration locally with actual word timestamps."""
import sys,json,re,unicodedata
from difflib import SequenceMatcher
from pathlib import Path
from faster_whisper import WhisperModel
model=WhisperModel('small',device='cpu',compute_type='int8')
segments,info=model.transcribe(sys.argv[1],language='pt',word_timestamps=True,beam_size=5,initial_prompt=Path(sys.argv[4]).read_text() if len(sys.argv)>4 else 'A Kombú combina suavidade com sabor intenso. Kombucha artesanal premium de Manaus.')
words=[{'text':w.word.strip(),'start':round(w.start+.35,3),'end':round(w.end+.35,3)} for s in segments for w in (s.words or [])]
if len(sys.argv)>4:
    def norm(text):
        text=text.lower().replace('2017','dois mil e dezessete')
        text=''.join(c for c in unicodedata.normalize('NFD',text) if unicodedata.category(c)!='Mn')
        return re.sub(r'[^a-z0-9 ]','',text)
    score=SequenceMatcher(None,norm(' '.join(w['text'] for w in words)),norm(Path(sys.argv[4]).read_text())).ratio()
    if score<.75:
        raise RuntimeError(f'A narração não corresponde suficientemente ao roteiro ({score:.0%}). Revise a voz antes de exportar.')
from caption_chunks import chunks
cues=chunks(words)
Path(sys.argv[2]).write_text(json.dumps({'words':words,'cues':cues,'language':info.language},ensure_ascii=False,indent=2))
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
Path(sys.argv[3]).write_text('\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}' for i,c in enumerate(cues))+'\n')
print(json.dumps({'words':len(words),'seconds':words[-1]['end'] if words else 0}),flush=True)
