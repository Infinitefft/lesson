// 不涉及 DOM 
import React from 'react';
// DOM 不可以
// react-dom 提供了server 模块，可以渲染React组件为HTML字符串
// api json 数据格式
// text/html 
import { renderToString } from 'react-dom/server';
import App from './App.jsx'

export function render() {
  console.log('???????');
  return renderToString(<App />)
}