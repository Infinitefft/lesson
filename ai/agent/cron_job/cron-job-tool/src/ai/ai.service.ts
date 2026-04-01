import { Injectable } from '@nestjs/common';
import { Runnable } from '@langchain/core/runnables';
import {
  BaseMessage,
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
  AIMessageChunk,
} from '@langchain/core/messages';
import { Inject } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';




@Injectable()
export class AiService {
  // Runnable 是langchain中的一个接口，表示一个可运行的对象
  // BaseMessage[] 是langchain 中的一个基类，表示一个消息数组
  // AIMessage HumanMessage ToolMessage 是langchain 中的一个子类，表示一个消息
  // 输入的类型约束BaseMessage[] 输出的类型约束是AIMessage
  private readonly modelWithTools: Runnable<BaseMessage[], AIMessage>;

  // 将 llm 和业务逻辑分离  llm 变化太快
  // 注入了 provide 的model
  constructor(
    @Inject('CHAT_MODEL') model: ChatOpenAI,
    @Inject('QUERY_USER_TOOL') private readonly queryUserTool: any
  ) {
    this.modelWithTools = model.bindTools([
      this.queryUserTool,
    ]);
  }

  // 同步调用 llm 完成生成后再返回
  // async runChain(query: string): Promise<string> {

  // }

  // 流式调用 llm 边生成边返回
  // generator 生成器函数
  async *runChainStream(query: string): AsyncIterable<string> {
    const messages: BaseMessage[] = [
      new SystemMessage(`你是一个智能助手，可以在需要时调用工具（如 query_user）
        来查询用户信息，再用结果回答用户的问题。
      `),
      new HumanMessage(query),
    ];
    // agent loop
    while (true) {
      const stream = await this.modelWithTools.stream(messages);
      let fullAIMessage: AIMessageChunk | null = null;
      // as 类型断言
      for await (const chunk of stream as AsyncIterable<AIMessageChunk>) {
        fullAIMessage = fullAIMessage ? fullAIMessage.concat(chunk) : chunk;
        // 判断是否存在工具调用
        const hasToolCallChunk = !!fullAIMessage.tool_call_chunks &&
          fullAIMessage.tool_call_chunks.length > 0;
        
        if (!hasToolCallChunk && chunk.content) {
          yield chunk.content as string;
        }
      }
      
      if (!fullAIMessage) {
        return;
      }
      // stream, 有chunk且不是tool 可以yield 直接返回
      // stream 结束，是一条完整的AIMessage
      messages.push(fullAIMessage);
      // ?? 空值合并运算符
      const toolCalls = fullAIMessage.tool_calls ?? [];
      if (!toolCalls.length) {
        return; 
      }
      for (const toolCall of toolCalls) {
        const toolCallId = toolCall.id || '';
        const toolName = toolCall.name;
        if (toolName === 'query_user') {
          const result = await this.queryUserTool.invoke(toolCall.args);
          messages.push(
            new ToolMessage({
              content: result,
              name: toolName,
              tool_call_id: toolCallId,
            })
          )
        }
      }
    }
  }
}
