import 'reflect-metadata';
import path from 'path';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import logger from 'koa-logger';
import { ApolloServer } from 'apollo-server-koa';
import { Sequelize } from 'sequelize-typescript';
import { buildSchema } from 'type-graphql';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { User, UserResolver } from '$components/user';
import { AuthResolver } from '$components/auth';

import { isAuth } from '$middleware/auth';
import { Context } from '$types/index';

const config = process.env.NODE_ENV === 'development' && require('dotenv').config({ path: path.join(`${__dirname}./../.env`) });

export const createApp = async () => {
  const app = new Koa();
  const router = new KoaRouter();
  const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,{
    dialect: "mysql",
    models: [
      User
    ],
    host: process.env.DB_URL || '',
  });

  sequelize.sync();

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      UserResolver,
    ],
    emitSchemaFile: true,
    validate: false,
  });

  //

  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    ctx.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-Requested-With, x-access-token',
    );
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    if (ctx.method === 'OPTIONS') {
      return (ctx.status = 200);
    }

    await next();
  });
  app.use(logger());
  app.use(isAuth);

  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => ctx,
    playground: true, // process.env.NODE_ENV === 'development',
    introspection: true,
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  server.applyMiddleware({ app, path: '/graphql' });

  return app;
};
