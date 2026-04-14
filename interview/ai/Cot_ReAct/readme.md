## Cot & ReAct

### Cot Chain of Thought
Prompt 技巧 让模型一步一步思考。

### ReAct 在思考的基础上，让模型可以调用工具去行动

### Cot
一个商品100块，打8折再减10块，多少钱？

普通Prompt
直接回答结果
模型说70

Cot Prompt
请一步步思考，并给出最终答案
模型会输出

原价100
打八折：100*0.8=80
再减十块：80-10=70
最终答案：70

更准确
可解释
Cot 本质是Prompt Engineering，不需要额外训练

使用场景：
    数学推理
    逻辑推理
    多步骤问题

### ReAct
ReAct = Reson(推理) + Action(行动)

他不仅会想，还可以调用工具，比如查数据库、调 API

东京今天天气怎么样？适不适合跑步？

ReAct

Thought: 我需要获取京东天气
Action：调用天气API
Observation: 返回天气数据
Thought: 根据天气判断是否适合跑步
Final Answer: 

JS + OpenAI 函数调用 ReAct llm with tools

ReAct 其实就是让LLM 具备Agent 能力，通过工具调用 把思考和执行结合起来

