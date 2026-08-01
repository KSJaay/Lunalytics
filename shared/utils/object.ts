export const isEmpty = (object: Record<string, unknown>): boolean => {
  for (let prop in object) {
    if (Object.prototype.hasOwnProperty.call(object, prop)) return false;
  }

  return true;
};
