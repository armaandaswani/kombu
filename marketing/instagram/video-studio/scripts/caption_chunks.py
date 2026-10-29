"""Readable clause-based caption cues, preserving every transcribed word and timestamp."""
import re
BAD_END={'a','o','as','os','de','da','do','das','dos','com','em','para','por','e','desde','dois','mil','um','uma'}
def chunks(words):
    sentences=[];current=[]
    for w in words:
        current.append(w)
        if re.search(r'[.,;!?]$',w['text']):sentences.append(current);current=[]
    if current:sentences.append(current)
    output=[]
    for sentence in sentences:
        n=len(sentence);cost=[float('inf')]*(n+1);path=[None]*(n+1);cost[0]=0
        for end in range(1,n+1):
            for count in range(2,7):
                start=end-count
                if start<0:continue
                last=re.sub(r'[^\w]','',sentence[end-1]['text'].lower())
                value=cost[start]+(count-4.5)**2+1+(30 if last in BAD_END else 0)
                if value<cost[end]:cost[end]=value;path[end]=start
        if path[n] is None:groups=[sentence]
        else:
            groups=[];end=n
            while end:
                start=path[end];groups.append(sentence[start:end]);end=start
            groups.reverse()
        for group in groups:output.append({'text':' '.join(w['text'] for w in group),'start':group[0]['start'],'end':group[-1]['end']})
    return output
