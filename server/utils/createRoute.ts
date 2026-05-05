import fs from 'fs';
import * as zod from 'zod';
import * as pathModule from 'path';
import { createDocument } from 'zod-openapi';
import { Router, Request, Response, NextFunction } from 'express';
import logger from './logger.js';

const openAPIJsonPath = pathModule.join(process.cwd(), 'openapi.json');

type ZodSchema<T = any> = zod.ZodType<T>;
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
  responses: Record<
    number,
    {
      description: string;
      content?: { 'application/json': { schema: TResponse } };
    }
  >;
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
    // security,
    deprecated,
    validations,
    responses,
    middlewares,
  }: RouteConfig<TParams, TQuery, TBody, TResponse>
) {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'test'
  ) {
    const openApiPath = path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');

    if (!fs.existsSync(openAPIJsonPath)) {
      logger.info('Creating openapi.json file for the first time');

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

    logger.info('Updating openapi.json file with new route information', {
      method,
      path,
    });

    const camelCaseTags = tags?.map(
      (t) => t.charAt(0).toUpperCase() + t.slice(1)
    );

    const existingDoc = JSON.parse(fs.readFileSync(openAPIJsonPath, 'utf-8'));

    const singleRouteRawDoc: any = {
      openapi: '3.1.0',
      info: {
        title: existingDoc.info.title,
        version: existingDoc.info.version,
      },
      paths: {
        [openApiPath]: {
          [method]: {
            summary,
            description,
            tags: camelCaseTags,
            deprecated,
            parameters: validations?.params,
            ...(validations?.body
              ? {
                  requestBody: {
                    content: {
                      'application/json': { schema: validations?.body },
                    },
                  },
                }
              : {}),
            query: validations?.query,
            header: validations?.headers,
            responses,
          },
        },
      },
    };

    const singleRouteDoc = createDocument(singleRouteRawDoc);

    existingDoc.paths = { ...existingDoc.paths, ...singleRouteDoc.paths };

    fs.writeFileSync(openAPIJsonPath, JSON.stringify(existingDoc, null, 2));
  }

  const validationMiddleware =
    typeof validations === 'function'
      ? validations
      : (_rq: Request, _rs: Response, next: NextFunction) => next();

  router[method](path, validationMiddleware, ...(middlewares || []));
}
