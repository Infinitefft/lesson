import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import {
  ServeStaticModule,
} from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AiModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    // 邮件服务 异步  dotenv 读取之后
    MailerModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            transport: {
                host: configService.get('MAILER_HOST'),
                port: Number(configService.get('MAIL_PORT')),
                secure: configService.get<string>('MAIL_SECURE') === 'true',
                auth: {
                    user: configService.get<string>('MAIL_USER'),
                    pass: configService.get<string>('MAIL_PASSWORD'),
                }
            },
            defaults: {
                from: configService.get<string>('MAIL_FROM'),
            }
        }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
