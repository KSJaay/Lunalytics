import { useEffect, useState } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<
    null | 'mobile' | 'laptop' | 'desktop'
  >(null);

  useEffect(() => {
    const handleResize = () => {
      const { innerWidth: width } = window;

      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1200) {
        setScreenSize('laptop');
      } else {
        setScreenSize('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
