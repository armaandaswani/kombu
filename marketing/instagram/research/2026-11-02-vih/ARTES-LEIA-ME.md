# Quatro campanhas para revisão

02/11/2026. Oito artes de feed 1080×1350, organizadas em quatro carrosséis de duas páginas, e quatro Stories 1080×1920. Nenhuma publicação, implantação, inclusão no calendário ou ação de Instagram foi executada.

Abra `index.html` para comparar as artes e baixar as imagens e as legendas. `previa-artes.jpg` reúne as doze artes apenas para revisão. Os JPGs individuais estão em `artes/feed/` e `artes/stories/`. Os nomes dos arquivos distinguem páginas; não há contador nas imagens publicáveis.

Os textos estão em `campanhas-editaveis.json`, e as legendas em quatro arquivos TXT de `artes/`. As páginas HTML individuais em `originais/` são fontes locais para o renderizador; acompanham fontes tipográficas e imagens. O script `render-artes.mjs` reproduz a exportação com Chrome e dependências locais existentes. Não contém tokens, não faz chamadas de publicação e não modifica o calendário.

## Fotografias e marca

- `sources/dolce.jpg`: derivada com orientação/resolução normalizadas da fotografia original do titular, existente em `assets/partners/dolce-vita-original.jpg`. Foi feita na Gelateria Dolce Vita. Não atribui disponibilidade atual a nenhum sabor.
- `sources/dolceWide.jpg`: derivada da foto original IMG_7015.JPG do titular. O original em Downloads não foi alterado.
- `sources/yoga.jpg`, `tenis.jpg`, `corrida.jpg`: cenas de pessoas fictícias geradas e aprovadas pelo titular em 27/10, copiadas de `assets/lifestyle/`. As legendas identificam que não são depoimentos nem profissionais parceiros. Uso como cenas editoriais, sem desempenho físico ou benefício clínico.
- `sources/lavanda-original.png`: nova cena editorial criada com a ferramenta nativa de imagem, usando a fotografia oficial de `assets/bottles/lavanda-limao.webp` como referência. Foi feita uma revisão específica para corrigir a forma PET Penta e sua base, preservando rótulo e sabor. Não representa um consultório, clínica ou parceiro real; não contém pessoas.
- `sources/marca-mono-*.png`: cópias fiéis das assinaturas atuais de `assets/brand/`. Não foi redesenhada a marca. Não usar o K circular.

As fotografias aprovadas de yoga/tênis/corrida foram reutilizadas nesta nova composição, conforme autorizado para as artes; isso não muda a regra de takes inéditos nos próximos Reels. O conjunto é um rascunho: aprovação do estilo de uma fotografia não equivale à aprovação destas novas chamadas.

## Imagem nova: prompt e rastreabilidade

Modo usado: ferramenta integrada image_gen, sem API nem cobrança externa contratada. Fonte escolhida:
`/Users/armaandaswani/.codex/generated_images/01a19cb1-9a4a-7c73-b517-36a717600b69/exec-8a681c42-b2ae-4722-9315-bb69413ca224.png`.

Primeira direção: fotografia editorial vertical de Lavanda & Limão sobre pedra clara, luz natural quente, sombras botânicas, copo transparente, lavanda e limão cortado, condensação discreta e espaço para texto. Embalagem e texto do rótulo referenciados pela imagem oficial; sem humanos, clínica, texto ou logo fora da garrafa.

Revisão aplicada: substituir a forma cilíndrica semelhante a vidro da primeira tentativa pela embalagem curta e mais larga PET Penta de 500 ml, com ombros suaves, tampa branca e base de cinco apoios visível. Manter cena, luz, ingredientes e cor, usando a referência oficial. A primeira tentativa não foi incluída no pacote como arte elegível.

## Conteúdo e revisão

Públicos: cafés/restaurantes; empórios/estúdios; nutricionistas/nutrólogos; personal trainers/influenciadores. Revenda leva a `/revenda`; propostas de indicação e conteúdo, a `/parcerias`. Conferir rotas ativas antes de agendar. Condições comerciais são conversadas depois da avaliação; nenhuma aprovação automática foi prometida.

A composição para nutricionistas/nutrólogos usa produto e ingredientes, sem profissional gerado ou endosso clínico. A legenda não oferece pagamento por recomendação; o formato deve respeitar as regras de cada profissão. O programa de afiliados é apresentado especificamente a influenciadores e requer aprovação antes do cupom.

Revisão executada: textos e rótulos, assinatura atual, recortes de pessoas, legibilidade e áreas seguras, dimensões exatas e ausência de numeração. `revisao-layout.json` registra a posição de cada bloco de texto. Renderização com fontes locais, sem chamadas de terceiros.
