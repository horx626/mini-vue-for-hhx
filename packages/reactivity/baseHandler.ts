
import { track, trigger } from './effect';
import { readonly, ReactiveFlags, reactive, shallowReadonly } from './reactive';
import { isObject, extend } from '../shared/src/index';

// 初始化，利用缓存
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        console.log(key)
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        }
        const res = Reflect.get(target, key)



        // TODO 依赖收集
        if (!isReadonly) {
            track(target, key)
        }

        if (shallow) {
            return res;
        }

        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
        return res
    }
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        // TODO 触发依赖
        trigger(target, key)
        return res;
    }
}

export const mutableHandlers = {
    get,
    set,
}
export const readonlyHandles = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key:${key} set is failed,because target is readonly`, target)
        return true;
    }
}
export const shallowHandlers = extend({}, readonlyHandles, {
    get: shallowReadonlyGet,
    set(target, key) {
        // readonly 的响应式对象不可以修改值
        console.warn(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
        return true;
      },
})
