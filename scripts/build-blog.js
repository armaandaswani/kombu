// Builds the blog as static pages: blog.html (index) and blog/<slug>.html (one per article).
// There is no build step on Vercel, so the output is committed; run this after editing the content.
//   node scripts/build-blog.js
//
// Content rules are the brand's (owner, 24/10): plain Portuguese with one reading per sentence, and no
// health claims. The reading list links to other sites about kombucha in general; its titles are
// neutral and name the source, so the Kombú page never repeats a third-party health claim as its own.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const site = "https://www.kombukombucha.com.br";
const version = (fs.readFileSync(path.join(root, "index.html"), "utf8").match(/site\.css\?v=([\w]+)/) || [])[1] || "1";
const published = "2026-10-24";

const articles = [
  {
    slug: "o-que-e-kombucha",
    title: "O que é kombucha?",
    description: "Kombucha é um chá fermentado, levemente ácido e com gás natural. Veja como é feita, qual é o sabor, se tem açúcar e onde comprar kombucha em Manaus.",
    intro: "Kombucha é uma bebida feita com chá adoçado e fermentado por uma cultura de bactérias e leveduras. O resultado é uma bebida levemente ácida, refrescante e com gás natural, servida sempre gelada.",
    sections: [
      ["Como a kombucha é feita", [
        "Tudo começa com chá e açúcar. Na Kombú, usamos chá verde. A esse chá é adicionada a cultura de kombucha, um conjunto de bactérias e leveduras que faz a fermentação.",
        "Durante a fermentação, a cultura consome a maior parte do açúcar. Nesse processo, a bebida fica levemente ácida e ganha gás de forma natural.",
        "Depois vem a segunda fermentação, em que entram os ingredientes de cada sabor. Na Kombú, são frutas, flores, ervas e especiarias.",
      ]],
      ["Qual é o sabor da kombucha", [
        "A kombucha é levemente ácida e refrescante. O sabor final depende dos ingredientes da segunda fermentação: pode ser frutado, floral, herbal ou cítrico.",
        "A Kombú tem 12 sabores, de Maracujá e Goiaba a Hibisco & Anis Estrelado e Lavanda & Limão.",
      ]],
      ["Kombucha tem açúcar?", [
        "Sim. O açúcar é necessário para a fermentação, e a maior parte dele é consumida no processo. Na Kombú, não adicionamos açúcar depois da segunda fermentação.",
      ]],
      ["Por que a kombucha precisa ficar gelada", [
        "A Kombú não usa conservantes. Por isso ela é armazenada e transportada sempre refrigerada, e deve continuar na geladeira até a hora de servir.",
      ]],
      ["Onde comprar kombucha em Manaus", [
        "Você encontra a Kombú gelada, por unidade, nos nossos parceiros em Manaus. Para quantidades maiores, fazemos pedido direto a partir de 20 garrafas, com os sabores que você escolher.",
      ]],
    ],
    links: [["Ver onde comprar", "/#onde"], ["Fazer pedido", "/#comprar"]],
  },
  {
    slug: "como-a-kombu-e-feita",
    title: "Como a Kombú é feita",
    description: "Do chá verde à garrafa: as duas fermentações da Kombú, kombucha artesanal produzida em pequenos lotes em Manaus desde 2017.",
    intro: "A Kombú é produzida em Manaus, em pequenos lotes, por uma empresa familiar que começou em 2017. Estas são as etapas de cada garrafa.",
    sections: [
      ["1. O chá verde", [
        "A base de todos os sabores é chá verde adoçado. É esse chá que vai alimentar a fermentação.",
      ]],
      ["2. A primeira fermentação", [
        "A cultura de kombucha é adicionada ao chá. Ao longo da fermentação, ela consome a maior parte do açúcar, a bebida fica levemente ácida e o gás se forma naturalmente.",
      ]],
      ["3. A segunda fermentação", [
        "Nesta etapa entram os ingredientes de cada sabor: frutas, flores, ervas e especiarias. Eles dão o sabor, o aroma e, em vários casos, a cor da bebida. A Flor Fada Azul & Blueberry, por exemplo, ganha a cor da flor e da fruta, sem corante.",
      ]],
      ["4. Garrafa e geladeira", [
        "A Kombú é engarrafada e mantida refrigerada desde a produção até o ponto de venda. Não usamos conservantes, corantes artificiais, aromatizantes artificiais nem gás adicionado.",
      ]],
      ["Quanto tempo leva", [
        "Cada lote fica pronto em cerca de duas semanas. É também o prazo dos pedidos diretos, a partir de 20 garrafas.",
      ]],
    ],
    links: [["Fazer pedido", "/#comprar"], ["Ver os sabores", "/#sabores"]],
  },
  {
    slug: "como-servir-kombucha",
    title: "Como servir e conservar kombucha",
    description: "Kombucha deve ficar sempre na geladeira e ser servida gelada. Veja como conservar e com quais comidas a Kombú combina.",
    intro: "A kombucha é uma bebida para tomar gelada. Estas são as orientações para conservar a Kombú e algumas ideias de combinação.",
    sections: [
      ["Mantenha sempre na geladeira", [
        "A Kombú não tem conservantes. Guarde as garrafas na geladeira desde a compra até a hora de servir.",
      ]],
      ["Sirva gelada", [
        "Sirva direto da geladeira, na garrafa ou em um copo. Depois de aberta, mantenha a garrafa fechada e refrigerada.",
      ]],
      ["Com o que combina", [
        "A Kombú acompanha bem brunch, doces, gelato e refeições. Os sabores frutados, como Manga & Jasmim e Maracujá, combinam com gelatos de fruta e sobremesas. Os cítricos e herbais, como Lavanda & Limão e Pêra & Alecrim, combinam com saladas e pratos leves.",
      ]],
    ],
    links: [["Ver os sabores", "/#sabores"], ["Fazer pedido", "/#comprar"]],
  },
];

// Third-party reading, as the owner listed it on linktr.ee/kombuestudos.
const readings = [
  { title: "O que é kombucha", source: "Blog Nutrify", url: "https://blog.nutrify.com.br/kombucha-beneficios" },
  { title: "Artigo sobre kombucha", source: "Tua Saúde", url: "https://www.tuasaude.com/beneficios-do-kombucha/" },
  { title: "Trabalho de conclusão de curso sobre kombucha", source: "Universidade Federal de São Carlos (UFSCar)", url: "https://repositorio.ufscar.br/items/f2947b2f-bd58-4247-a1f6-84b695b9f031" },
  { title: "Reportagem sobre um estudo com kombucha (2024)", source: "O Globo", url: "https://oglobo.globo.com/saude/noticia/2024/04/07/kombucha-bebida-acelera-metabolismo-da-gordura-e-traz-beneficios-semelhantes-ao-jejum.ghtml" },
  { title: "Mitos e verdades sobre a kombucha", source: "Revista ABM", url: "https://www.revistaabm.com.br/artigos/mitos-e-verdade-sobre-o-kombucha-cha-probiotico-que-ajuda-a-saude" },
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function head({ title, description, url, type = "website", jsonld }) {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:site_name" content="Kombú" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${site}/assets/og-kombu.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#1B2F18" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/assets/kombu-k-logo.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="/assets/site.css?v=${version}" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
  </head>
  <body data-page="blog">
    <a class="skip" href="#main">Pular para o conteúdo</a>
    <header class="site-header is-solid">
      <div class="wrap bar">
        <a class="logo" href="/" aria-label="Kombú, página inicial"><b translate="no">KOMBÚ</b><span>A Arte do Natural</span></a>
        <nav class="nav" aria-label="Principal">
          <a href="/#comprar">Fazer pedido</a>
          <a href="/#sabores">Sabores</a>
          <a href="/blog">Blog</a>
          <div class="audience" aria-label="Escolha para quem">
            <a href="/"><span>Para consumo próprio</span></a>
            <a href="/revenda"><span>Para revenda</span></a>
          </div>
        </nav>
        <button class="menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false"><i></i><i></i><i></i></button>
      </div>
    </header>
`;
}

const foot = `    <footer class="site-footer">
      <div class="wrap">
        <div><a class="logo" href="/"><b translate="no">KOMBÚ</b><span>A Arte do Natural</span></a><p>Kombucha artesanal, feita em Manaus.</p></div>
        <div><h4>Kombú</h4><ul><li><a href="/#comprar">Fazer pedido</a></li><li><a href="/#onde">Onde comprar</a></li><li><a href="/blog">Blog</a></li><li><a href="/revenda">Para revenda</a></li></ul></div>
        <div><h4>Contato</h4><ul><li><a href="/#comprar" data-whatsapp="Olá! Vim pelo site da Kombú.">WhatsApp</a></li><li><a href="https://www.instagram.com/kombu.amazonia/" target="_blank" rel="noreferrer">Instagram</a></li><li><a href="/legal#privacidade">Privacidade</a></li><li><a href="/legal#termos">Termos</a></li></ul></div>
        <div class="fine"><span>© <span data-year>2026</span> Kombú, Manaus</span><span>A Arte do Natural</span></div>
      </div>
    </footer>
    <script src="/assets/site.js?v=${version}" defer></script>
  </body>
</html>
`;

const publisher = { "@type": "Organization", name: "Kombú", url: site, logo: `${site}/assets/kombu-k-logo.png` };

function articlePage(a) {
  const url = `${site}/blog/${a.slug}`;
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BlogPosting", headline: a.title, description: a.description, inLanguage: "pt-BR", datePublished: published, dateModified: published, mainEntityOfPage: url, image: `${site}/assets/og-kombu.jpg`, author: publisher, publisher },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kombú", item: `${site}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog` },
        { "@type": "ListItem", position: 3, name: a.title, item: url },
      ] },
    ],
  };
  const others = articles.filter((x) => x !== a);
  return head({ title: `${a.title} | Blog Kombú`, description: a.description, url, type: "article", jsonld }) + `
    <main id="main" class="post">
      <article class="wrap">
        <nav class="crumbs" aria-label="Você está em"><a href="/blog">Blog</a></nav>
        <h1>${esc(a.title)}</h1>
        <p class="lead">${esc(a.intro)}</p>
        <div class="post-body">
${a.sections.map(([h, ps]) => `          <h2>${esc(h)}</h2>\n${ps.map((p) => `          <p>${esc(p)}</p>`).join("\n")}`).join("\n")}
        </div>
        <div class="actions">${a.links.map(([label, href], i) => `<a class="btn${i ? " btn-ghost" : ""}" href="${href}">${esc(label)}</a>`).join("")}</div>
      </article>
      <section class="wrap post-more" aria-labelledby="more-title">
        <h2 id="more-title">Leia também</h2>
        <ul class="post-list">
${others.map((o) => `          <li><a href="/blog/${o.slug}"><h3>${esc(o.title)}</h3><p>${esc(o.description)}</p></a></li>`).join("\n")}
        </ul>
      </section>
    </main>
` + foot;
}

function indexPage() {
  const url = `${site}/blog`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Kombú",
    url,
    inLanguage: "pt-BR",
    publisher,
    blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${site}/blog/${a.slug}`, datePublished: published })),
  };
  return head({ title: "Blog Kombú | Tudo sobre kombucha", description: "O que é kombucha, como a Kombú é feita, como servir e conservar, e uma lista de leituras e estudos sobre kombucha.", url, jsonld }) + `
    <main id="main" class="post blog-index">
      <div class="wrap">
        <div class="section-head">
          <h1>Tudo sobre kombucha.</h1>
          <p class="lead">Muita gente ainda não conhece a kombucha. Aqui explicamos o que ela é, como a Kombú é feita e como servir.</p>
        </div>
        <ul class="post-list">
${articles.map((a) => `          <li><a href="/blog/${a.slug}"><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p><span>Ler artigo</span></a></li>`).join("\n")}
        </ul>
      </div>
      <section class="wrap readings" aria-labelledby="readings-title">
        <div class="section-head">
          <h2 id="readings-title">Estudos e leituras.</h2>
          <p class="lead">Conteúdos de outros sites sobre kombucha em geral. Eles não foram produzidos pela Kombú e não tratam dos nossos produtos.</p>
        </div>
        <ul class="reading-list">
${readings.map((r) => `          <li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><b>${esc(r.title)}</b><span>${esc(r.source)}</span></a></li>`).join("\n")}
        </ul>
      </section>
    </main>
` + foot;
}

fs.mkdirSync(path.join(root, "blog"), { recursive: true });
fs.writeFileSync(path.join(root, "blog.html"), indexPage());
for (const a of articles) fs.writeFileSync(path.join(root, "blog", `${a.slug}.html`), articlePage(a));

// The sitemap lists every page, so a new article is indexed without editing it by hand.
const pages = [["/", "weekly", "1.0"], ["/revenda", "monthly", "0.8"], ["/blog", "weekly", "0.7"], ...articles.map((a) => [`/blog/${a.slug}`, "monthly", "0.6"]), ["/legal", "yearly", "0.2"]];
fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, f, pr]) => `  <url>\n    <loc>${site}${p === "/" ? "/" : p}</loc>\n    <lastmod>${published}</lastmod>\n    <changefreq>${f}</changefreq>\n    <priority>${pr}</priority>\n  </url>`).join("\n")}
</urlset>
`);
console.log(`blog: ${articles.length} artigos, ${readings.length} leituras; sitemap com ${pages.length} páginas`);
