import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:8081', 'exp://'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Macro Counter O' Doom and Dispair API")
    .setDescription('The dark tome of nutritional suffering — REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: "Macro Counter O' Doom — API Docs",
    customCss: `
      body { background: #0A0A0F; color: #E8D5C4; }
      .swagger-ui { background: #0A0A0F; }
    `,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🩸 The sanctum awakens on port ${port}`);
  logger.log(`📜 API Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
