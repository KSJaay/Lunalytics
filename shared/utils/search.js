const getNestedValue = (obj, path) => {
  if (!path) return undefined;

  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');

  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    if (current == null) return undefined;
    current = current[parts[i]];
  }
  return current;
};

export const filterData = (data, searchValue, keys) => {
  if (!searchValue || !Array.isArray(data)) return data;

  const lowerSearch = searchValue.toLowerCase();

  return data.filter((item) => {
    return keys.some((key) => {
      const val = getNestedValue(item, key);
      return typeof val === 'string' && val.toLowerCase().includes(lowerSearch);
    });
  });
};
