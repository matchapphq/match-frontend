/// <reference types="node" />

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";

type SeoStaticPage = {
  path: string;
  title: string;
  description: string;
  ogType: "website" | "article";
};

const SITE_URL = "https://matchapp.fr";
const SITE_NAME = "Match";
const IMAGE_URL = `${SITE_URL}/apple-touch-icon.png?v=7`;
const JSONLD_ID = "matchapp-seo-jsonld";

const PUBLIC_PAGES: SeoStaticPage[] = [
  {
    path: "/",
    title: "Match | Valorisez vos diffusions sportives en établissement",
    description:
      "Match aide les bars et restaurants qui diffusent déjà du sport à gagner en visibilité, attirer plus de clients et augmenter leurs réservations.",
    ogType: "website",
  },
  {
    path: "/presentation",
    title: "Présentation | Match",
    description:
      "Découvrez comment Match aide les établissements qui diffusent déjà du sport à mieux programmer leurs affiches, attirer du trafic et suivre leurs performances.",
    ogType: "website",
  },
  {
    path: "/public-referral",
    title: "Parrainage | Match",
    description:
      "Rejoignez Match via le programme de parrainage et bénéficiez d’avantages pour votre établissement.",
    ogType: "website",
  },
  {
    path: "/terms",
    title: "Conditions Générales | Match",
    description:
      "Consultez les conditions générales d’utilisation de Match pour les établissements partenaires.",
    ogType: "article",
  },
  {
    path: "/privacy",
    title: "Politique de Confidentialité | Match",
    description:
      "Consultez la politique de confidentialité de Match et la gestion de vos données personnelles.",
    ogType: "article",
  },
  {
    path: "/terms-of-sale",
    title: "Conditions Générales de Vente | Match",
    description:
      "Consultez les conditions générales de vente applicables aux services Match.",
    ogType: "article",
  },
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function ensureLangFr(html: string): string {
  if (/<html[^>]*lang=["'][^"']+["'][^>]*>/i.test(html)) {
    return html.replace(
      /<html([^>]*)lang=["'][^"']+["']([^>]*)>/i,
      "<html$1lang=\"fr\"$2>",
    );
  }
  return html.replace("<html", "<html lang=\"fr\"");
}

function upsertMetaTag(
  html: string,
  attributeName: "name" | "property",
  attributeValue: string,
  content: string,
): string {
  const safeContent = escapeHtmlAttribute(content);
  const tag = `<meta ${attributeName}="${attributeValue}" content="${safeContent}" />`;
  const regex = new RegExp(
    `<meta\\s+[^>]*${attributeName}=["']${escapeRegex(attributeValue)}["'][^>]*>`,
    "i",
  );

  if (regex.test(html)) {
    return html.replace(regex, tag);
  }

  return html.replace("</head>", `    ${tag}\n    </head>`);
}

function upsertCanonical(html: string, href: string): string {
  const tag = `<link rel="canonical" href="${escapeHtmlAttribute(href)}" />`;
  const regex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;

  if (regex.test(html)) {
    return html.replace(regex, tag);
  }

  return html.replace("</head>", `    ${tag}\n    </head>`);
}

function upsertTitle(html: string, title: string): string {
  const safeTitle = escapeHtmlAttribute(title);
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  }
  return html.replace("</head>", `    <title>${safeTitle}</title>\n    </head>`);
}

function buildStructuredData(page: SeoStaticPage, canonicalUrl: string): string {
  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: IMAGE_URL,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "fr-FR",
      publisher: {
        "@id": `${SITE_URL}#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      name: page.title,
      description: page.description,
      url: canonicalUrl,
      inLanguage: "fr-FR",
      isPartOf: {
        "@id": `${SITE_URL}#website`,
      },
      publisher: {
        "@id": `${SITE_URL}#organization`,
      },
    },
  ];

  return JSON.stringify(graph, null, 2);
}

function upsertJsonLd(html: string, payload: string): string {
  const tag = `<script id="${JSONLD_ID}" type="application/ld+json">\n${payload}\n</script>`;
  const regex = new RegExp(
    `<script[^>]*id=["']${escapeRegex(JSONLD_ID)}["'][^>]*>[\\s\\S]*?<\\/script>`,
    "i",
  );

  if (regex.test(html)) {
    return html.replace(regex, tag);
  }

  return html.replace("</head>", `    ${tag}\n    </head>`);
}

function canonicalUrlFor(pathname: string): string {
  return pathname === "/" ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
}

function destinationPath(buildDir: string, pathname: string): string {
  if (pathname === "/") {
    return join(buildDir, "index.html");
  }

  const pageDir = join(buildDir, pathname.replace(/^\//, ""));
  mkdirSync(pageDir, { recursive: true });
  return join(pageDir, "index.html");
}

function renderPage(templateHtml: string, page: SeoStaticPage): string {
  const canonicalUrl = canonicalUrlFor(page.path);
  let html = templateHtml;

  html = ensureLangFr(html);
  html = upsertTitle(html, page.title);
  html = upsertMetaTag(html, "name", "description", page.description);
  html = upsertMetaTag(html, "name", "robots", "index, follow");
  html = upsertCanonical(html, canonicalUrl);

  html = upsertMetaTag(html, "property", "og:title", page.title);
  html = upsertMetaTag(html, "property", "og:description", page.description);
  html = upsertMetaTag(html, "property", "og:type", page.ogType);
  html = upsertMetaTag(html, "property", "og:url", canonicalUrl);
  html = upsertMetaTag(html, "property", "og:site_name", SITE_NAME);
  html = upsertMetaTag(html, "property", "og:locale", "fr_FR");
  html = upsertMetaTag(html, "property", "og:image", IMAGE_URL);

  html = upsertMetaTag(html, "name", "twitter:card", "summary_large_image");
  html = upsertMetaTag(html, "name", "twitter:title", page.title);
  html = upsertMetaTag(html, "name", "twitter:description", page.description);
  html = upsertMetaTag(html, "name", "twitter:image", IMAGE_URL);

  html = upsertJsonLd(html, buildStructuredData(page, canonicalUrl));

  return html;
}

function main(): void {
  const buildDir = resolve("build");
  const templatePath = join(buildDir, "index.html");
  const templateHtml = readFileSync(templatePath, "utf8");

  for (const page of PUBLIC_PAGES) {
    const outputFile = destinationPath(buildDir, page.path);
    const rendered = renderPage(templateHtml, page);
    writeFileSync(outputFile, rendered, "utf8");
  }

  console.log(
    `[seo-build] Generated static SEO pages: ${PUBLIC_PAGES.map((page) => page.path).join(", ")}`,
  );
}

main();
