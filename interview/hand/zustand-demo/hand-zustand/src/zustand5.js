import {
    useState,
    useEffect,
} from 'react';

const createStore = (createState) => {
    let state = null;
    let listeners = new Set();
    
    const getState = () => state;

    const setState = (partial, replace = false) => {
        let newState = typeof partial === 'function' ? partial(state) : partial;
        let oldState = state;
        if (!Object.is(newState, oldState)) {
            if (!replace) {  // 不是替换
                state = (typeof newState !== 'object' || newState === null) ?
                    newState : Object.assign({}, state, newState);
            } else {  // 直接替换
                state = newState;
            }
            // 通知更新
            listeners.forEach(listener => listener(state, oldState));
        }
    }

    const subscribe = (listener) => {
        listeners.add(listener);  // 添加订阅

        return () => {
            listeners.delete(listener);  // 取消订阅
        }
    }

    const destory = () => {
        listeners.clear()
    }

    const api = {
        getState,
        setState,
        subscribe,
        destory
    }

    state = createState(setState, getState, api);

    return api;
}


const useStore = (api, selector) => {
    const [_, forceRender] = useState(0);

    useEffect(() =>{
        const unsubscribe = api.subscribe((state, preState) => {
            let newState = selector(state);
            let oldState = selector(preState);

            if (!Object.is(newState, oldState)) {
                forceRender(Math.random());
            }
        })
        return () => unsubscribe();
    }, [])

    return selector(api.getState());
}

export const create = (cretaeState) => {
    const api = createStore(cretaeState);

    const useBoundStore = (selector) => {
        return useStore(api, selector);
    }
    Object.assign(useBoundStore, api);
    return useBoundStore;
}