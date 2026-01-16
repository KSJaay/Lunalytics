const getNestedValue = (obj: Record<string, any>, path: string): any => {
  if (!path) return undefined;
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');

  let current: any = obj;

  for (let i = 0; i < parts.length; i++) {
    if (current == null) return undefined;
    current = current[parts[i]];
  }

  return current;
};

export const filterData = (
  data: Array<Record<string, any>>,
  searchValue: string,
  keys: string[]
): Array<Record<string, any>> => {
  if (!searchValue || !Array.isArray(data)) return data;

  const lowerSearch = searchValue.toLowerCase();

  return data.filter((item) => {
    return keys.some((key) => {
      const val = getNestedValue(item, key);
      return typeof val === 'string' && val.toLowerCase().includes(lowerSearch);
    });
  });
};
