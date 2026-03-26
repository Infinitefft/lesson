import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';


@Module({
  controllers: [AiController],
  providers: [
    AiService,
    // provide 动态创建
    // 将model 从逻辑中剥离出来
    // llm 作为provide 提供
    {
      provide: 'CHAT_MODEL',
      // 工厂模式，车，摩托车，坦克...
      useFactory: (ConfigService: ConfigService) => {
        return new ChatOpenAI({
          model: ConfigService.get('MODEL_NAME'),
          apiKey: ConfigService.get('OPENAI_API_KEY'),
          configuration: {
            baseURL: ConfigService.get('OPENAI_API_BASE_URL'),
          }
        })
      },
      inject: [ConfigService],
    }
  ],
})
export class AiModule {}
