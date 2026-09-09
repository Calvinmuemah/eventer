import { useEffect } from 'react';

export const MetaTags = ({ title, description }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | EVENTA` : 'EVENTA | Luxury Event Staging & Production';
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default MetaTags;
