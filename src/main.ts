import { Request, Response } from '@google-cloud/functions-framework';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

// Fastify POST request is hanged
// curl -X POST http://localhost:8080 -d "name=john"
let nestApp: NestFastifyApplication;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  return app.init();
}

export async function api(req: Request, res: Response) {
  nestApp = nestApp ?? (await bootstrap());
  const instance = nestApp.getHttpAdapter().getInstance();
  await instance.ready();
  instance.server.emit('request', req, res);
}

// Express works ok
// let nestApp: NestExpressApplication;

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(
//     AppModule,
//     new ExpressAdapter(),
//   );
//   return app.init();
// }

// export async function api(req: Request, res: Response) {
//   nestApp = nestApp ?? (await bootstrap());
//   const instance = nestApp.getHttpAdapter().getInstance();
//   instance(req, res);
// }
