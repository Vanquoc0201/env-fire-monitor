import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './common/constant/app.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
  });
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('ESP32 Fire & Environment Monitoring API')
    .setDescription('Tài liệu REST API & WebSockets phục vụ Dashboard Giám sát PCCC')
    .setVersion('1.0')
    .addTag('Telemetry', 'Các API tương tác với dữ liệu cảm biến PCCC')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT!);
  console.log(`🚀 Application is running on: http://localhost:${PORT}`);
  console.log(`📚 Swagger UI available at: http://localhost:${PORT}/api/docs`);
}
bootstrap();
