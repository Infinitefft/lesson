# 快手面试题

项目采用 accessToken + refreshToken 双token鉴权
accessToken 有效期短(15分钟)，用于接口请求请求
RefreshToken 有效期长（如7天），仅用于刷新 AccessToken

Token 存在localStorage 及其容易 XSS 窃取，拿到就能伪造请求盗用身份，这就是AccessToken不安全的核心原因。

短时效AccessToken 保接口安全，长时效RefreshToken 无感刷新，减少频繁登录，降低盗号风险

问题：当AccessToken 已过期，页面同时发起多个异步请求（例如3-5个接口一起调用）

/api/xxx Authorization  AccessToken  401
...  /api/xx1 xx2
/api/refreshToken   RefreshToken

axios 请求响应拦截
开关 isRefresh = false

乖乖地等待？原来请求 等待新token 来了后，重新发送
队列去存

所有请求几乎同时收到401 未授权

进入个人中心页面

返回结果前，用户的请求队列，怎么处理？

请设计方案：
在Refresh Token 有效时，只发一次刷新请求
刷新期间，其他请求要挂起、排队
刷新成功后，所有排队请求用新Token 自动重发
属性失败，RefreshToken 也过期，统一跳转登录，清空队列


``` js
// 1. 全局状态变量
let isRefreshing = false;
// 请求队列
let requestQueue = [];

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

// 响应拦截器
axios.interceptors.response.use(
    res => res.data,  // 200
    async err => {
        const res = err.response;
        const config = err.config;
        
        if (res.status === 401) {
            if (isRefreshing) {
                return new Promise(resolve => {
                    requestQueue.push(config);
                })
            }
        }
        
        isRefreshing = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const { accessToken } = await axios.post('/refreshToken', { refreshToekn });

            localStorage.setItme('accessToken', accessToken);

            requestQueue.forEach(config => {
                config.headers.Authorization = `Bearer ${accessToken}`;
                axios(config);
            });

            // 队列清空
            requestQueue = [];

            config.headers.Authorization = `Bearer ${accessToken}`;
            return axios(config);
        } catch (e) {
            localStorage.clear();
            requestQueue = [];
            location.href = '/login';
            return Promise.reject(e);
        } finaly {
            isRefreshing = false
        }
        return Promise.reject(e);
    }
)
```



## Vite的打包原理

前端工程化  Webpack/Vite

Vite 是尤雨溪开发的现代前端构建工具，依托原生ESM与esbuild。工程化上实现秒级冷启动

webpack 不支持esm，依赖关系 链条
a.js -> b.js -> c.js
node fs readFile
打包
c.js
b.js
a.js
打包成了一个文件  bundle.js  文件越多，花的时间就越多
一次打包完成后才能运行项目

- webpack 需要打包，不打包没有模块化的能力
    启动时间长，之后就很快
- vite 原生支持ESM 秒级 懒加载  不打包
<script type="module" src="/src/main.js"></script>
开发阶段，直接抛弃旧浏览器  es11+ 

现代浏览器已经原生支持 ESModule 无需打包即可浏览器直接运行文件，按需加载模块，省略编译打包，实现急速启动热更新


webpack 会把零散的js，组件，依赖全部整合压缩，打包成少数几个浏览器能识别的文件。传统方案必须先整体打包才能运行，启动慢，更新也要重新编译。

Webpack 会分析模块依赖关系，梳理执行顺序，递归整合所有js 资源，统一封装打包为浏览器可直接运行的代码。

esbuild 是用go 写的极速js/css 打包压缩工具，比webpack(node) 快 10-100倍，Vite用它做依赖预构建、TS/JSX 转移，代码压缩

### Vue3 + TS + Stylus + 路由懒加载，说下vite 过程

1. 执行vite dev（npm run dev），先用esbuild预构建第三方依赖(Vue, Vue-Router)，解决浏览器ESM缓存依赖提升二次启动速度
2. 项目源码解析与转义
    - 浏览器入口main.ts，通过type="module" 识别ESM模块
    - 遇到TS，Vue，stylus 文件，交给esbuild实时转义，TS编译成JS，css，按需单独编译，及时返回
    - 全程无全量合并编译需求，做到秒级冷启动
3. 路由懒加载
路由中() => import('@/views/xxx.vue')天然利用ESM 动态import()能力，访问对应路由时，浏览器才异步请求该页面模块，实现按需加载，分割代码。
4. HMR 热更新流程
修改Vue组件，样式，TS代码后，vite精准监听文件变化，只重新编译当前修改的单个模块，通过HMR通信局部替换更新，不刷新页面，保留页面状态，毫秒级生效
5. 生产打包
切换生产环境，npm run build/vite build 完成代码的合并，Tree-sharking（代码精简，无关的代码移除，换行）压缩，静态资源优化、路由懒加载代码分割，输出高性能的上线代码包

utils.js
export const funA = () => '业务要用';
export const funB = () => '完全没用';

// mian.js
import { funA } from './utils';
funA();

Tree-Sharking 会自动剔除从未引入、从未执行的funB，打包时只保留有效代码，减小包体积

压缩图片、字体