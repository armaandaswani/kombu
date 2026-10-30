# Geração de vídeo: direção para a Kombú

Pesquisa em 29/10/2026. O pedido atual é criar a cena inteira, sem reutilizar filmagens de Instagram. O logo e o rótulo oficial continuam sendo referências de marca.

## O que muda o resultado

1. Criar primeiro uma imagem de referência com cenário, embalagem correta e luz coerente. Separar em planos curtos: condensação, servir e copo cheio.
2. Gerar movimento a partir dessa imagem, com uma ação por plano. Conferir gargalo, jato, nível do líquido e continuidade da embalagem. Usar enquadramento macro para a condensação e um plano um pouco mais aberto para o servir.
3. Preservar o rótulo com composição e rastreamento quando o modelo alterar letras. Não pedir ao gerador para inventar a embalagem.
4. Finalizar no Remotion/HyperFrames: cortes, cor, logo discreta, áudio e legendas sem tarja. Não esperar que uma skill de edição resolva a física do líquido.

## Skills verificadas

- `remotion-dev/skills@remotion-best-practices`: fonte oficial, cerca de 706 mil instalações no diretório e 5,8 mil estrelas exibidas. Orienta animação por frame, composição, áudio e legendas. https://skills.sh/remotion-dev/skills/remotion-best-practices
  Instalação opcional: `npx skills add remotion-dev/skills --skill remotion-best-practices -g`
- `heygen-com/hyperframes@general-video`: fonte oficial, cerca de 661 mil instalações, repositório com mais de 75 mil estrelas na consulta da API. Orienta o fluxo de produção e resolução de mídias; serviços de geração podem ter autenticação e cobrança próprias. https://skills.sh/heygen-com/hyperframes/general-video
  Instalação opcional: `npx skills add heygen-com/hyperframes --skill general-video -g`

A consulta verificou instalação, origem e reputação; não instalou pacotes extras nem acionou serviços pagos. As skills locais motionmaxxing e ai-video-generation já existem; outra skill não fornece automaticamente acesso a um modelo de vídeo.

## Caminho sem API paga neste Mac

- A prévia v3 usa cenário novo gerado por IA e garrafa, copo, condensação e servir construídos em Three.js. É CGI ilustrativo, não filmagem fotorrealista. Nenhum vídeo antigo entra nesta cena.
- O LTX Desktop oficial suporta geração local, mas documenta que Macs abaixo de 24 GB ficam limitados à API no Gen Space. Este Mac tem 16 GB, portanto não é um caminho local adequado pela aplicação oficial. https://github.com/Lightricks/LTX-Desktop#system-requirements
- O port comunitário `dgrauet/ltx-2-mlx` documenta quantização int4 de aproximadamente 12 GB, mínimo de 16 GB de RAM e suporte a imagem para vídeo. É uma possibilidade para ensaio técnico em resolução baixa, não uma promessa de desempenho ou qualidade neste Mac. Foi instalado para o ensaio descrito abaixo; o desempenho deve ser avaliado pela saída real. https://github.com/dgrauet/ltx-2-mlx#requirements

Para obter líquido e mãos com aparência de filmagem, o passo seguinte é testar imagem para vídeo com esse motor local ou um provedor aprovado. Manter a restrição de custo zero: não ativar fallback em nuvem nem cobrança automática.

## Repositório indicado pelo titular

`Tejashmakwana/motionmaxxing` já está instalado neste Mac e aplicado ao filme. O conteúdo das instruções foi comparado ao SKILL.md remoto em 29/10, preservando a nota local de ferramentas. Ele dirige ideia, composição, movimento, som e inspeção do MP4; não é um motor de síntese de vídeo. https://github.com/Tejashmakwana/motionmaxxing

## Refinamento fotográfico solicitado pelo titular

O titular rejeitou a aparência CGI da v3 e pediu aparência de vídeo realmente gravado. A v4 parte de imagens novas geradas com aparência fotográfica, não do modelo Three.js. O primeiro frame de servir foi corrigido em `assets/generated/realistic-v4/pour-corrected.png`: o topo do rótulo acompanha o gargalo, conforme a embalagem oficial. `pour-start.png` preserva o ensaio rejeitado pelo titular. O close fotográfico está em `close-start.png`.

Foi instalado um ambiente separado de LTX-2-MLX 0.18.0 em `.render/video-tools/ltx-2-mlx` (commit 895201df379b079c2154738bcf92005b7a371923); um cálculo simples em Metal confirmou que a GPU está disponível no macOS 15.8.1 deste Mac. Isso confirma execução básica, não a capacidade de concluir a geração completa em 16 GB.

A inspeção dos arquivos reais corrigiu o orçamento de armazenamento indicado pelo resumo do repositório: os componentes selecionados para o teste somam 20,48 GB de LTX e 8,07 GB de Gemma. Não se baixa o repositório inteiro nem todos os transformadores/LoRAs. `scripts/setup-realistic-video.py` usa revisões fixadas durante a consulta, reserva espaço de trabalho e permite retomada do download. O transporte HTTP foi escolhido após o downloader Xet não progredir.

`scripts/generate-realistic.mjs pour` executa apenas com modelos já locais, rede Hugging Face desativada e sem fallback pago. O ambiente do HumanVoice não foi alterado. O teste inicial é silencioso, sem a limitação comercial da voz Rayssa.

Também foi consultada a demonstração pública oficial `Lightricks/LTX-2-3`, em hardware ZeroGPU, para um ensaio anônimo sem chave nem cobrança. `scripts/generate-realistic-demo.py` registra o pedido e o identificador da sessão/evento; reconexões da leitura não criam uma nova geração. As primeiras tentativas apresentaram falhas de conexão. Somente um MP4 retornado e revisado pode ser tratado como resultado; arquivos de pedido, status STARTING e instalação de dependências não são vídeo pronto.

Não há liberação automática para publicação, nem alteração do feed ou dos Stories.

### Verificação da instalação e ensaio atual

O download por snapshot retornou uma pasta parcial quando a rede falhou. A rotina foi corrigida para baixar componentes individualmente e conferir o tamanho de **cada** arquivo antes de declarar conclusão. Os dois pacotes selecionados foram concluídos e verificados. O gerador também recusa arquivos incompletos no início.

O executável usa explicitamente os diretórios `src` dos dois pacotes MLX via `PYTHONPATH`, pois o carregamento dos caminhos editáveis não funcionou neste ambiente. Manter `huggingface-hub==1.7.1`, compatível com o Transformers instalado; a instalação separada do cliente Gradio havia atualizado o Hub para uma versão incompatível. O ambiente HumanVoice permanece separado.

Em 29/10, o teste local do close iniciou a codificação de texto e a geração por difusão em GPU (81 frames, 384×640, 24 fps, sem áudio). Isso ainda não confirma um MP4 utilizável: revisar a saída completa antes de montar ou publicar. `scripts/compose-realistic.mjs` exige dois vídeos reais (`close.mp4` e `pour.mp4`) e monta uma prévia no Remotion sem fundo CGI, sem imagens paradas substituindo planos e sem cartela lavada.

O titular entrou na conta gratuita do Hugging Face. A interface oficial foi aberta e o prompt de servir preenchido. O seletor de arquivo do navegador não respondeu à automação; solicitou-se somente o envio manual da imagem corrigida, copiada para Downloads/Kombu-Servir-Rotulo-Corrigido.png. Nenhuma chave, cookie ou token foi extraído.

### Critério de rejeição do primeiro vídeo

O primeiro close concluiu 81 frames em 253,4 s, com pico Metal de 9,37 GB na decodificação. O arquivo foi inspecionado e rejeitado: o zoom recortava a tampa e o modelo deformava as letras. A saída técnica passou existência, duração e ausência de frames vazios, mas isso não resolve fidelidade de marca. O ensaio seguinte usa 576×1024; no close, câmera fixa, 49 frames e referência também no último frame. O servir mantém 81 frames. As saídas continuam rascunhos até revisão.
