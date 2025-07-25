import { useLayoutEffect, useState } from 'react';

const useCurrentUrl = () => {
  const [currentUrl, setCurrentUrl] = useState(window.location.pathname);

  useLayoutEffect(() => {
    let url = `${window.location.protocol}//${window.location.hostname}`;

    if (window.location.port) {
      url += `:${window.location.port}`;
    }

    setCurrentUrl(url);
  }, []);

  return currentUrl;
};

export default useCurrentUrl;
