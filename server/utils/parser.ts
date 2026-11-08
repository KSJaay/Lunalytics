type EmptyObjectOrArray = Record<string, never> | any[];

export const parseJsonOrArray = (
  str: string,
  failedResponse: EmptyObjectOrArray = {}
) => {
  try {
    if (!str) return failedResponse;

    if (typeof str === 'string') {
      return JSON.parse(str);
    }

    if (typeof str === 'object') {
      if (Array.isArray(str)) return failedResponse;
      return str;
    }

    return failedResponse;
  } catch {
    return failedResponse;
  }
};
