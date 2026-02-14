import fs from 'fs';
import path from 'path';
import { ZodType } from 'zod';
import { Router, Request, Response, NextFunction } from 'express';

const openAPIJsonPath = path.join(process.cwd(), 'openapi.json');

type ZodSchema<T = any> = ZodType<T>;

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RouteConfig<
  TParams extends ZodSchema | undefined = undefined,
  TQuery extends ZodSchema | undefined = undefined,
  TBody extends ZodSchema | undefined = undefined,
  TResponse extends ZodSchema = ZodSchema,
> {
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  tags?: string[];
  security?: string;
  deprecated?: boolean;

  validations?: {
    params?: TParams;
    query?: TQuery;
    body?: TBody;
    headers?: ZodSchema;
  };

  responses: Array<{
    status: number;
    description: string;
    content: {
      'application/json': {
        schema: TResponse;
      };
    };
  }>;

  middlewares?: Array<
    (
      req: Request<
        TParams extends ZodSchema ? any : {},
        any,
        TBody extends ZodSchema ? any : {},
        TQuery extends ZodSchema ? any : {}
      >,
      res: Response,
      next: NextFunction
    ) => Promise<Response | void> | void | Response
  >;
}

export function createRoute<
  TParams extends ZodSchema | undefined = undefined,
  TQuery extends ZodSchema | undefined = undefined,
  TBody extends ZodSchema | undefined = undefined,
  TResponse extends ZodSchema = ZodSchema,
>(
  router: Router,
  {
    method,
    path,
    summary,
    description,
    tags,
    security,
    deprecated,
    validations,
    responses,
    middlewares,
  }: RouteConfig<TParams, TQuery, TBody, TResponse>
) {
  if (process.env.NODE_ENV !== 'production') {
    const openApiPath = path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');

    if (!fs.existsSync(openAPIJsonPath)) {
      fs.writeFileSync(
        openAPIJsonPath,
        JSON.stringify(
          {
            openapi: '3.1.0',
            info: {
              title: 'Lunalytics API',
              version: '1.0.0',
            },
            paths: {},
          },
          null,
          2
        )
      );
    }

    const openApiDoc = JSON.parse(fs.readFileSync(openAPIJsonPath, 'utf-8'));

    openApiDoc.paths[openApiPath] = openApiDoc.paths[openApiPath] || {};
    openApiDoc.paths[openApiPath][method] = {
      method,
      path: openApiPath,
      summary,
      description,
      tags,
      deprecated,
      security: security ? [{ permission: security }] : undefined,
      validations,
      responses,
    };

    fs.writeFileSync(openAPIJsonPath, JSON.stringify(openApiDoc, null, 2));
  }

  const validationMiddleware =
    typeof validations === 'function'
      ? validations
      : (_rq: Request, _rs: Response, next: NextFunction) => next();

  router[method](path, validationMiddleware, ...(middlewares || []));
}
