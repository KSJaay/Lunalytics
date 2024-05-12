import fs from 'fs';

export const loadJSON = (path) => {
  const fullPath = new URL(path, import.meta.url);

  if (!fs.existsSync(fullPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
};
