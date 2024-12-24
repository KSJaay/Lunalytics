export const isEmpty = (object) => {
  for (let prop in object) {
    if (Object.prototype.hasOwnProperty.call(object, prop)) return false;
  }

  return true;
};
