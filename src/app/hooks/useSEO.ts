import { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
}

const SITE_URL = "https://boardopp.mentormyboard.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function useSEO(config: SEOConfig) {
  useEffect(() => {
    const {
      title,
      description,
      keywords,
      canonical,
      ogTitle,
      ogDescription,
      ogImage = DEFAULT_OG_IMAGE,
      ogType = "website",
      schema,
    } = config;

    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr === "content" ? "name" : attr, selector.match(/\[(\w+)="([^"]+)"\]/)?.[2] || "");
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    // Standard meta
    const setNameMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setPropMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setNameMeta("description", description);
    if (keywords) setNameMeta("keywords", keywords);
    setNameMeta("robots", "index, follow");

    // Open Graph
    setPropMeta("og:title", ogTitle || title);
    setPropMeta("og:description", ogDescription || description);
    setPropMeta("og:image", ogImage);
    setPropMeta("og:type", ogType);
    setPropMeta("og:site_name", "BoardOpp by MentorMyBoard");
    setPropMeta("og:url", canonical || SITE_URL);

    // Twitter Card
    setNameMeta("twitter:card", "summary_large_image");
    setNameMeta("twitter:title", ogTitle || title);
    setNameMeta("twitter:description", ogDescription || description);
    setNameMeta("twitter:image", ogImage);
    setNameMeta("twitter:site", "@MentorMyBoard");

    // Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonical || SITE_URL);

    // JSON-LD schema
    const existingSchemas = document.querySelectorAll('script[data-seo="true"]');
    existingSchemas.forEach((el) => el.remove());

    const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];
    schemas.forEach((s) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(s);
      document.head.appendChild(script);
    });

    return () => {
      // Clean up schemas when navigating away
      document.querySelectorAll('script[data-seo="true"]').forEach((el) => el.remove());
    };
  }, [config.title, config.description, config.canonical, config.keywords, config.schema]);
}
