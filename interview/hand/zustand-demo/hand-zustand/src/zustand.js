import {
  useEffect,
  useState,
} from 'react';


// createState 创建状态的函数
// set 第一个参数
// get 第二个参数
// 模块私有的方法
const createStore = (createState) => {
  let state;  // 需要根据createState 初始化状态
  // 初始化
  const listeners = new Set();
  const getState = () => state;
  // 修改状态
  // partial 部分更新
  // 函数
  // replace 是否替换状态
  const setState = (partial, replace = false) => {
    const nextState = typeof partial === 'function' ? partial(state): partial;
    // Object.is(val1, val2) 比较两个值是否相等
    // 指向同一个内存地址（或者是相同的原始值），它返回 true
    if (!Object.is(nextState, state)) {
      const previousState = state;
      if (!replace) {
        state = (typeof nextState !== 'object' || nextState === null)
          ? nextState
          : Object.assign({}, state, nextState);
      } else {
        state = nextState;
      }
      listeners.forEach(listener => listener(state, previousState));
    }
  }
  
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    }
  }

  const destory = () => {
    listeners.clear();
  }

  const api = {
    setState,
    getState,
    subscribe,
    destory,
  }

  state = createState(setState, getState, api);
  return api;
}

// hooks 方便任何组件使用这个仓库
const useStore = (api, selector) => {
  // api 仓库里的状态
  // selector 局部
  // 局部状态，只需要修改状态的方法
  const [, forceRender] = useState(0);
  useEffect(() => {
    // 自动订阅 不需要手动subscribe
    // 只关心的状态 改变了
    const unsubscribe = api.subscribe((state, previousState) => {
      const newObj = selector(state);  // 关心的才会改变
      const oldObj = selector(previousState);
      if ((newObj !== oldObj)) {
        forceRender(Math.random());  // 强制组件刷新
      }
    })
    return () => unsubscribe();
  }, []);

  return selector(api.getState());
}

// 高阶函数
// 返回一个函数 useXXXStore
// useXXXStore 可以接收一个函数，返回某一些状态或方法。
export const create = (createState) => {
  // 返回 subscribe 方法
  const api = createStore(createState);
  // selector 选择哪个属性，哪个方法
  // hooks 函数
  // 函数式编程
  // 方便使用 组件想用就用
  const useBoundStore = (selector) => {
    return useStore(api, selector);
  }
  Object.assign(useBoundStore, api);
  return useBoundStore;
}