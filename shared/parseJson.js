import fs from 'fs';
import path from 'path';

export const loadJSON = (file) => {
  const fullPath = path.join(process.cwd(), file);

  if (!fs.existsSync(fullPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
};
