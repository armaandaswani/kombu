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
- O port comunitário `dgrauet/ltx-2-mlx` documenta quantização int4 de aproximadamente 12 GB, mínimo de 16 GB de RAM e suporte a imagem para vídeo. É uma possibilidade para ensaio técnico em resolução baixa, não uma promessa de desempenho ou qualidade neste Mac. Não foi instalado nem testado. https://github.com/dgrauet/ltx-2-mlx#requirements

Para obter líquido e mãos com aparência de filmagem, o passo seguinte é testar imagem para vídeo com esse motor local ou um provedor aprovado. Manter a restrição de custo zero: não ativar fallback em nuvem nem cobrança automática.

## Repositório indicado pelo titular

`Tejashmakwana/motionmaxxing` já está instalado neste Mac e aplicado ao filme. O conteúdo das instruções foi comparado ao SKILL.md remoto em 29/10, preservando a nota local de ferramentas. Ele dirige ideia, composição, movimento, som e inspeção do MP4; não é um motor de síntese de vídeo. https://github.com/Tejashmakwana/motionmaxxing
