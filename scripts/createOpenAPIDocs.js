import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
const openApiPath = path.join(process.cwd(), 'openapi.json');
const openApiJson = fs.readFileSync(openApiPath, 'utf-8');

const createDocs = () => {
  const openApi = JSON.parse(openApiJson);

  const tagGroups = {};
  for (const [path, methods] of Object.entries(openApi.paths)) {
    const method = Object.values(methods)[0];
    const tag = method.tags && method.tags[0] ? method.tags[0] : 'other';
    if (!tagGroups[tag]) tagGroups[tag] = {};
    tagGroups[tag][path] = methods;
  }

  const sortedPaths = {};
  Object.keys(tagGroups)
    .sort()
    .forEach((tag) => {
      Object.keys(tagGroups[tag])
        .sort()
        .forEach((path) => {
          sortedPaths[path] = tagGroups[tag][path];
        });
    });

  openApi.paths = sortedPaths;

  const docsPath = path.join(process.cwd(), 'openapi.yaml');
  fs.writeFileSync(docsPath, yaml.dump(openApi, { skipInvalid: true }));
};

createDocs();
