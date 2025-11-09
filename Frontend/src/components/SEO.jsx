import { useEffect } from 'react';

const SEO = ({
  title = 'BravoCar - Premium Luxury Car Auctions',
  description = 'The world\'s most prestigious marketplace for luxury and exotic vehicles. Join thousands of collectors, enthusiasts, and dealers in the ultimate car auction experience.',
  image = '/bravo.png',
  url = window.location.href,
  type = 'website',
}) => {
  const fullTitle = title.includes('BravoCar') ? title : `${title} | BravoCar`;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Set or update meta tags
    const setMetaTag = (property, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Primary Meta Tags
    setMetaTag('title', fullTitle);
    setMetaTag('description', description);

    // Open Graph / Facebook
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:url', url, true);
    setMetaTag('twitter:title', fullTitle, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:image', image, true);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [fullTitle, description, image, url, type]);

  return null;
};

export default SEO;
