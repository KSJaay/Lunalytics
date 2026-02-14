import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { MemberPermissionBits } from '../../shared/permissions/bitFlags.js';

const routesDir = path.join(process.cwd(), 'server', 'routes');

const getUserInput = async () => {
  const { routeType } = await inquirer.prompt([
    {
      type: 'select',
      name: 'routeType',
      message: 'Select the type of route to create:',
      choices: [
        { name: '/api/auth', value: 'auth' },
        { name: '/api/incident', value: 'incident' },
        { name: '/api/invites', value: 'invites' },
        { name: '/api/monitor', value: 'monitor' },
        { name: '/api/notification', value: 'notification' },
        { name: '/api/provider', value: 'provider' },
        { name: '/api/status', value: 'status' },
        { name: '/api/status-pages', value: 'status-pages' },
        { name: '/api/tokens', value: 'tokens' },
        { name: '/api/user', value: 'user' },
        { name: '/api/workspace', value: 'workspace' },
      ],
    },
  ]);
  const { routeName, method, routeDescription, isSecured, permissions } =
    await inquirer.prompt([
      {
        type: 'input',
        name: 'routeName',
        message:
          'Enter the path for the new route name (e.g. update, delete, create):',
        validate: (input) => {
          if (!input) {
            return 'Route name cannot be empty.';
          }

          const pathRegex = /^[a-zA-Z0-9\/:-@\-]+$/;
          if (!pathRegex.test(input)) {
            return 'Please enter a valid route name (e.g. update, delete, create).';
          }

          const fileName = input.toLowerCase().split('/').join('-');

          const routeFilePath = path.join(
            routesDir,
            routeType,
            `${fileName}.ts`
          );

          if (fs.existsSync(routeFilePath)) {
            return `Route folder "${routeFilePath}" already exists. Please choose a different name.`;
          }

          return true;
        },
      },
      {
        type: 'select',
        name: 'method',
        message: 'Select the HTTP method for the route:',
        choices: [
          { name: 'GET', value: 'get' },
          { name: 'POST', value: 'post' },
          { name: 'PUT', value: 'put' },
          { name: 'DELETE', value: 'delete' },
          { name: 'PATCH', value: 'patch' },
        ],
      },
      {
        type: 'input',
        name: 'routeDescription',
        message: 'Enter a brief description for the route:',
        validate: (input) => {
          if (!input) {
            return 'Route description cannot be empty.';
          }
          return true;
        },
      },
      {
        type: 'confirm',
        name: 'isSecured',
        message: 'Is this a secured route?',
        default: true,
      },
      {
        type: 'checkbox',
        name: 'permissions',
        message: 'Select the required permissions for this route:',
        when: (answers) => answers.isSecured,
        validate: (input) => {
          if (!input) {
            return 'Permissions cannot be empty for a secured route.';
          }
          return true;
        },
        choices: Object.keys(MemberPermissionBits).map((key) => ({
          name: key,
          value: MemberPermissionBits[key as keyof typeof MemberPermissionBits],
        })),
      },
    ]);

  return {
    routeType,
    routeName,
    method,
    routeDescription,
    isSecured,
    permissions:
      permissions?.reduce(
        (acc: number, permission: number) => (acc |= permission),
        0
      ) || 0,
  };
};

const createRoute = async () => {
  const {
    routeType,
    routeName,
    method,
    routeDescription,
    isSecured,
    permissions,
  } = await getUserInput();

  const fileName =
    routeName === '/'
      ? 'base'
      : routeName.startsWith('/')
        ? routeName
            .slice(1)
            .toLowerCase()
            .split('/')
            .join('-')
            .replaceAll(':', '')
        : routeName.toLowerCase().split('/').join('-').replaceAll(':', '');
  const fullRoutePath = `/api/${routeType}/${routeName.startsWith('/') ? routeName.slice(1).toLowerCase() : routeName.toLowerCase()}`;

  const routeDir = path.join(routesDir, routeType);
  fs.mkdirSync(routeDir, { recursive: true });

  const routeFilePath = path.join(routeDir, `${fileName}.ts`);

  fs.cpSync(
    path.join(process.cwd(), 'scripts', 'createRoute', 'routeExample.ts'),
    routeFilePath
  );

  let routeFileContent = fs.readFileSync(routeFilePath, 'utf-8');

  routeFileContent = routeFileContent
    .replace(/{{method}}/g, method)
    .replace(/{{path}}/g, fullRoutePath)
    .replace(/{{summary}}/g, routeDescription)
    .replace(/{{description}}/g, routeDescription)
    .replace(/{{tag}}/g, routeType)
    .replace(/{{security}}/g, isSecured ? permissions : false)
    .replace('../../server/utils/createRoute.js', '../../utils/createRoute.js');

  fs.writeFileSync(routeFilePath, routeFileContent);

  console.log(`Route created successfully at ${routeFilePath}`);

  const indexFilePath = path.join(routesDir, routeType, 'index.ts');
  let indexFileContent = '';
  if (fs.existsSync(indexFilePath)) {
    indexFileContent = fs.readFileSync(indexFilePath, 'utf-8');
  }

  const camelCaseRouteName = fileName
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const importStatement = `import initialise${camelCaseRouteName}Route from './${fileName}.js';\n`;
  const initialiseStatement = `initialise${camelCaseRouteName}Route(${routeType}Router);\n`;

  if (!indexFileContent.includes(importStatement)) {
    indexFileContent = importStatement + indexFileContent;
  }

  if (!indexFileContent.includes(initialiseStatement)) {
    const routerDeclarationIndex = indexFileContent.indexOf(
      `const ${routeType}Router = Router();`
    );
    if (routerDeclarationIndex !== -1) {
      const insertPosition =
        indexFileContent.indexOf('\n', routerDeclarationIndex) + 1;
      indexFileContent =
        indexFileContent.slice(0, insertPosition) +
        initialiseStatement +
        indexFileContent.slice(insertPosition);
    } else {
      indexFileContent += `\n${initialiseStatement}`;
    }
  }

  fs.writeFileSync(indexFilePath, indexFileContent);
  console.log(`Initialised ${camelCaseRouteName} router in ${indexFilePath}`);
};

createRoute();
