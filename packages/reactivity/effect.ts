import { createDep } from "./dep";
let activeEffect=void 0;
let shouldTrack=false;
const targetMap = new WeakMap()

export class ReactiveEffect {
    deps = [];
    active = true;
    public onStop?:()=>void
    constructor(public fn, public scheduler?) {
        console.log("创建 ReactiveEffect 对象");
    }
    run() {
        console.log('run')
        if(!this.active){
            return this.fn();
        }
        activeEffect = this as any
        // 执行收集依赖
        // shouldTrack对stop作出区分
        shouldTrack=true;
        const result=this.fn();
        // reset
        shouldTrack=false;
        activeEffect=undefined;

        return result;


    }
    stop() {
        if (this.active) {
            clearEffect(this);
            if(this.onStop){
                this.onStop();
            }
            this.active = false
        }
    }
}

 function clearEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect);
    });

    effect.deps.length = 0;
}

export function track(target,key) {
    if (!isTracking()) {
        return;
      }
    // 构建一个容器,利用合集 target->key->dep
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        // 初始化
        depsMap = new Map();
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)

    if (!dep) {
        dep = createDep();

        depsMap.set(key, dep);
    }
    trackEffects(dep);
}

export function trackEffects(dep){
    // 用dep来存放所有的effect
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        (activeEffect as any).deps.push(dep);
    }
}

export function trigger(target, key) {
    let deps: Array<any> = [];
    const depsMap = targetMap.get(target)
    if(!depsMap) return

    const dep = depsMap.get(key)

    deps.push(dep)

    const effects: Array<any> = [];
    deps.forEach(dep=>{
        effects.push(...dep)
    })
    triggerEffects(createDep(effects));
}

 export function triggerEffects(dep){
    for(const effect of dep){
        if(effect.scheduler){
            // scheduler可以让用户自己选择调用的时机
            // 这样就可以灵活的控制调用
            // 在runtime-core中 scheduler实现了next tick的调用逻辑
            effect.scheduler();
        }else{
            effect.run()
        }
    }
 }



export function effect(fn, options: any = {}) {
    // fn
    const scheduler = options.scheduler
    const _effect = new ReactiveEffect(fn, scheduler)
    // options or extend  would well
    _effect.onStop=options.onStop
    _effect.run();
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}


export function stop(runner) {
    runner.effect.stop()
}

// export function stoper(run:any) {
//     run.effect.stoper()
// }
export function isTracking() {
    return shouldTrack && activeEffect !== undefined;
  }