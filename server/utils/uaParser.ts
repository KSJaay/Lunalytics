import { UAParser } from 'ua-parser-js';

export const parseUserAgent = (userAgent?: string) => {
  const { browser, device, os } = UAParser(userAgent);

  if (device.type === 'mobile') {
    return {
      data: { browser, device, os },
      device: {
        os: os.name || 'Unknown',
        browser: browser.name || 'Unknown',
        type: 'mobile',
      },
    };
  } else if (device.type === 'tablet') {
    return {
      data: { browser, device, os },
      device: {
        os: os.name || 'Unknown',
        browser: browser.name || 'Unknown',
        type: 'tablet',
      },
    };
  }

  return {
    data: { browser, device, os },
    device: {
      os: os.name || 'Unknown',
      browser: browser.name || 'Unknown',
      type: 'desktop',
    },
  };
};
