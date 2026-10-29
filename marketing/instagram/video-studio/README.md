# Kombú Vídeo Studio

Estúdio local para Reels verticais 1080 × 1920, 30 fps, com embalagens oficiais, voz em português e legendas sincronizadas. Não modifica o site, calendário, Stories ou publicador do Instagram.

## Abrir

Dê dois cliques em `Abrir Kombu Video Studio.command`, nesta pasta. Mantenha a janela do Terminal aberta durante o uso. Ou rode:

```sh
npm run studio
```

Abra http://127.0.0.1:4317. Edite o roteiro, selecione três sabores diferentes e clique **Gerar vídeo**. A geração pode levar alguns minutos neste Mac. O botão mostra o andamento; o vídeo e os downloads aparecem ao concluir. Cada geração pela interface cria um projeto novo, sem substituir o anterior. Um bloqueio compartilhado entre CLI e interface impede duas produções pesadas ao mesmo tempo. O estúdio fica restrito a este computador.

Para abrir a composição no editor Remotion: `npm run preview`. O botão do estúdio produz o vídeo completo, enquanto o Remotion Studio é uma etapa técnica de montagem.

## Ferramentas e responsabilidades

| Projeto                                                     | Uso implementado                                                                                                                                                                                                                                      |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [HyperFrames](https://github.com/heygen-com/hyperframes)    | HTML editável, linha de tempo GSAP, captura determinística e vídeo base                                                                                                                                                                               |
| [Remotion](https://github.com/remotion-dev/remotion)        | Montagem do vídeo base, áudio, fontes e legendas; exportação H.264/AAC                                                                                                                                                                                |
| [OpenCut](https://github.com/opencut-app/opencut)           | O repositório principal está em reescrita. Usamos o parser SRT real do [OpenCut Classic](https://github.com/opencut-app/opencut-classic), com licença MIT, para validar as legendas, e exportamos um pacote de mídias separado para edição no Classic |
| [Three.js](https://github.com/mrdoob/three.js)              | Cenário, câmera, luz e sombras; fotos oficiais das garrafas em planos 2.5D                                                                                                                                                                            |
| [Anime.js](https://github.com/juliangarnier/anime)          | Movimento de câmera calculado pelo tempo do filme                                                                                                                                                                                                     |
| [Chatterbox](https://github.com/resemble-ai/chatterbox)     | Motor multilíngue local, voz sintética padrão em português; síntese real testada                                                                                                                                                                      |
| [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | Transcrição local com modelo small e tempos das palavras, JSON e SRT                                                                                                                                                                                  |

O pacote OpenCut contém vídeo sem legendas, WAV e SRT. Não é um projeto nativo do OpenCut, nem promete importar uma linha de tempo automaticamente. O editor gráfico não está incorporado no estúdio. Abra o Classic, crie um projeto 1080 × 1920/30 fps, importe vídeo e WAV em faixas separadas e use **Legendas → Importar** para o SRT. O MP4 final já contém narração e legendas; não some novamente o WAV a ele.

## Rayssa Original / HumanVoice

A pedido do titular, a primeira prévia usa a chave **rayssa**, nunca `rayssa2`, no HumanVoice já instalado neste Mac. O cliente consulta o catálogo autorizado e usa a fila compartilhada. Nenhuma voz é cadastrada ou substituída, nenhum arquivo de autorização vira referência de síntese e o ritmo salvo é preservado, sem mudanças de velocidade.

O backend usa o cliente e o arquivo de integração privados da instalação existente em `~/Desktop/Xtras/rea-main/humanvoice`. Credenciais são carregadas por Node no processo de backend e não são impressas, copiadas para este projeto ou enviadas à interface. O ID da geração é salvo antes da espera; uma retomada consulta a mesma geração.

**A instalação atual do HumanVoice informa avaliação privada não comercial.** Os pesos OmniVoice têm licença CC-BY-NC. As prévias com Rayssa recebem `releaseScope: private-noncommercial-preview` e não entram no calendário/publicador. Isso não é uma liberação de uso comercial. Fonte: https://huggingface.co/k2-fsa/OmniVoice#license. A opção Chatterbox usa outro motor e sua voz padrão; não substitui Rayssa silenciosamente.

Remotion: o titular confirmou até três pessoas na Kombú, dentro da condição gratuita comercial do projeto na data da instalação. Chatterbox, faster-whisper, Three.js, Anime.js e OpenCut têm seus próprios termos; HyperFrames usa Apache 2.0. As dependências npm estão fixadas no lockfile. Nenhum serviço pago ou API de geração externa foi usado neste trabalho.

## Instalação em outro ambiente

Este projeto foi preparado para macOS Apple Silicon com Node 24, Chrome, FFmpeg, FFprobe e uv já instalados. `scripts/setup.sh` instala dependências npm e cria um ambiente Python 3.11 em `../.render/video-tools/python`. Modelos gratuitos são baixados na primeira utilização, exigindo rede e espaço em disco. HumanVoice precisa estar disponível separadamente; não é reinstalado pelo setup. Um Mac de 16 GB deve executar uma geração pesada por vez.

```sh
npm run doctor
npm test
npm run render -- projects/primeiro-reel.json
```

Arquivos gerados: `output/<id>/Kombu-Reel.mp4`, `captions.srt`, `captions.json`, `legenda.txt`, `Kombu-OpenCut.zip`, `film/index.html`, `project.json` e `status.json`. Os vídeos, modelos, ambientes, logs e credenciais não entram no Git. `NOTE.md` registra a inspeção da primeira prévia.

## Marca e direção

Rótulos e proporção da Penta 500 ml são preservados. Texto humano e conectado; sabores alternados; sem divulgar tipo de chá, detalhes da receita, referências à família ou alegações de saúde. Imunidade é nome de sabor. O cenário do primeiro filme é ilustrativo, não uma instalação real ou um parceiro. A arte ilustrada de criadora em Manaus foi aprovada como referência para uso ocasional; não é depoimento real nem padrão obrigatório para todos os vídeos.

Os roteiros passam por uma validação de termos rejeitados antes de gerar voz. Essa checagem ajuda a prevenir erros, mas a revisão humana continua necessária para nomes, pronúncia, ritmo e veracidade. Nenhum vídeo é publicado automaticamente por este estúdio.

## Revisão sensorial v2

`projects/sensorial-v2.json` usa Rosas & Cardamomo, gotas discretas no close e uma filmagem real do mesmo sabor sendo servido. A filmagem do titular é recortada para o copo e o líquido, sem mostrar a embalagem antiga. O seletor “Cena do vídeo” permite escolher esse servir. Essa opção exige Rosas & Cardamomo como sabor principal. Para outros sabores, use a composição de produto até haver filmagem correspondente.

As fotografias das embalagens agora ficam fora do efeito de névoa da cena, preservando suas cores. As legendas usam trechos naturais da fala, menores e sem caixa de fundo. As 20 referências enviadas pelo titular estão documentadas em `references/2026-10-28/LEITURA-VISUAL.md`; arquivos dos terceiros não são usados nos filmes da Kombú.
