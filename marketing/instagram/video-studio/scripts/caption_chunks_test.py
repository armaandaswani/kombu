import unittest
from caption_chunks import chunks
class CaptionChunksTests(unittest.TestCase):
 def test_words_and_timestamps_survive(self):
  text='A Kombú combina suavidade com sabor intenso. Produzida em Manaus desde dois mil e dezessete,'
  words=[dict(text=t,start=i*.3,end=(i+1)*.3) for i,t in enumerate(text.split())]
  cues=chunks(words)
  self.assertEqual(' '.join(c['text'] for c in cues),text)
  self.assertEqual(cues[0]['start'],0)
  self.assertEqual(cues[-1]['end'],words[-1]['end'])
  self.assertTrue(all(a['end']<=b['start'] for a,b in zip(cues,cues[1:])))
 def test_clause_ends_are_readable(self):
  words=[dict(text=t,start=i,end=i+1) for i,t in enumerate('Produzida em Manaus desde dois mil e dezessete,'.split())]
  self.assertEqual([c['text'] for c in chunks(words)],['Produzida em Manaus','desde dois mil e dezessete,'])
if __name__=='__main__':unittest.main()
