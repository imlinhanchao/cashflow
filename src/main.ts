import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { SwaggerModule, DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { CfgAppModule } from './cfg.module';
import { hasConfigFile } from './config/config.module';
import { AllExceptionFilter } from './core/filters/all-exception.filter';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(hasConfigFile() ? (await import('./app.module')).AppModule : CfgAppModule);

  const config = new DocumentBuilder()
    .setTitle('API Hub')
    .setDescription('The API Hub Document')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const options: SwaggerCustomOptions = {
    explorer: true,
    customSiteTitle: 'API Hub Docs',
    jsonDocumentUrl: 'docs/json',
  };
  SwaggerModule.setup('docs', app, document, options);

  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors();
  
  await app.listen(7894);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
