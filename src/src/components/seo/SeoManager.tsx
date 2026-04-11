import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SeoMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  robots: 'index, follow' | 'noindex, nofollow';
  ogType?: 'website' | 'article';
  imagePath?: string;
  language?: string;
  indexable?: boolean;
};

const SITE_URL = 'https://matchapp.fr';
const SITE_NAME = 'Match';
const DEFAULT_IMAGE_PATH = '/apple-touch-icon.png?v=7';
const STRUCTURED_DATA_SCRIPT_ID = 'matchapp-seo-jsonld';

const PUBLIC_SEO_BY_PATH: Record<string, SeoMeta> = {
  '/': {
    title: 'Match | Valorisez vos diffusions sportives en établissement',
    description:
      'Match aide les bars et restaurants qui diffusent déjà du sport à gagner en visibilité, attirer plus de clients et augmenter leurs réservations.',
    canonicalPath: '/',
    robots: 'index, follow',
    ogType: 'website',
    indexable: true,
    language: 'fr',
  },
  '/presentation': {
    title: 'Présentation | Match',
    description:
      'Découvrez comment Match aide les établissements qui diffusent déjà du sport à mieux programmer leurs affiches, attirer du trafic et suivre leurs performances.',
    canonicalPath: '/presentation',
    robots: 'index, follow',
    ogType: 'website',
    indexable: true,
    language: 'fr',
  },
  '/public-referral': {
    title: 'Parrainage | Match',
    description:
      'Rejoignez Match via le programme de parrainage et bénéficiez d’avantages pour votre établissement.',
    canonicalPath: '/public-referral',
    robots: 'index, follow',
    ogType: 'website',
    indexable: true,
    language: 'fr',
  },
  '/terms': {
    title: 'Conditions Générales | Match',
    description:
      'Consultez les conditions générales d’utilisation de Match pour les établissements partenaires.',
    canonicalPath: '/terms',
    robots: 'index, follow',
    ogType: 'article',
    indexable: true,
    language: 'fr',
  },
  '/privacy': {
    title: 'Politique de Confidentialité | Match',
    description:
      'Consultez la politique de confidentialité de Match et la gestion de vos données personnelles.',
    canonicalPath: '/privacy',
    robots: 'index, follow',
    ogType: 'article',
    indexable: true,
    language: 'fr',
  },
  '/terms-of-sale': {
    title: 'Conditions Générales de Vente | Match',
    description:
      'Consultez les conditions générales de vente applicables aux services Match.',
    canonicalPath: '/terms-of-sale',
    robots: 'index, follow',
    ogType: 'article',
    indexable: true,
    language: 'fr',
  },
};

const NOINDEX_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/onboarding',
  '/dashboard',
  '/matches',
  '/my-matches',
  '/my-venues',
  '/boost',
  '/referral',
  '/my-reviews',
  '/account',
  '/reservations',
  '/notifications',
  '/qr-scanner',
];

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function isNoindexPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return NOINDEX_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function resolveSeo(pathname: string): SeoMeta {
  const path = normalizePath(pathname);

  const publicSeo = PUBLIC_SEO_BY_PATH[path];
  if (publicSeo) {
    return publicSeo;
  }

  if (isNoindexPath(path)) {
    return {
      title: 'Espace partenaire | Match',
      description: 'Accédez à votre espace partenaire Match.',
      canonicalPath: path,
      robots: 'noindex, nofollow',
      ogType: 'website',
      indexable: false,
      language: 'fr',
    };
  }

  return {
    title: 'Match',
    description:
      'Match aide les établissements qui diffusent déjà du sport à gagner en visibilité et en réservations.',
    canonicalPath: path,
    robots: 'noindex, nofollow',
    ogType: 'website',
    indexable: false,
    language: 'fr',
  };
}

function upsertMetaTag(
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string,
): void {
  const selector = `meta[${attributeName}="${attributeValue}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertCanonicalLink(href: string): void {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function upsertStructuredDataScript(payload: unknown): void {
  let element = document.getElementById(STRUCTURED_DATA_SCRIPT_ID) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement('script');
    element.id = STRUCTURED_DATA_SCRIPT_ID;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.text = JSON.stringify(payload);
}

function buildStructuredData(_pathname: string, canonicalUrl: string, seo: SeoMeta): object[] {
  const imageUrl = `${SITE_URL}${seo.imagePath ?? DEFAULT_IMAGE_PATH}`;
  const graph: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: imageUrl,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'fr-FR',
      publisher: {
        '@id': `${SITE_URL}#organization`,
      },
    },
  ];

  if (seo.indexable) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: seo.title,
      description: seo.description,
      url: canonicalUrl,
      inLanguage: 'fr-FR',
      isPartOf: {
        '@id': `${SITE_URL}#website`,
      },
      publisher: {
        '@id': `${SITE_URL}#organization`,
      },
    });
  }

  return graph;
}

export function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = resolveSeo(pathname);
    const canonicalPath = normalizePath(seo.canonicalPath);
    const canonicalUrl = canonicalPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${canonicalPath}`;
    const imageUrl = `${SITE_URL}${seo.imagePath ?? DEFAULT_IMAGE_PATH}`;

    document.documentElement.lang = seo.language ?? 'fr';
    document.title = seo.title;

    upsertMetaTag('name', 'description', seo.description);
    upsertMetaTag('name', 'robots', seo.robots);

    upsertMetaTag('property', 'og:title', seo.title);
    upsertMetaTag('property', 'og:description', seo.description);
    upsertMetaTag('property', 'og:type', seo.ogType ?? 'website');
    upsertMetaTag('property', 'og:url', canonicalUrl);
    upsertMetaTag('property', 'og:site_name', SITE_NAME);
    upsertMetaTag('property', 'og:locale', 'fr_FR');
    upsertMetaTag('property', 'og:image', imageUrl);

    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', seo.title);
    upsertMetaTag('name', 'twitter:description', seo.description);
    upsertMetaTag('name', 'twitter:image', imageUrl);

    upsertCanonicalLink(canonicalUrl);
    upsertStructuredDataScript(buildStructuredData(pathname, canonicalUrl, seo));
  }, [pathname]);

  return null;
}
