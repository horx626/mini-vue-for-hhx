import { trackEffects, triggerEffects, isTracking } from './effect'
import {reactive} from './reactive'
import { hasChanged, isObject } from '../shared/src/index';

class RefImpl {
    private _value: any;
    public dep;
    private _rawValue:any;
    private _v_isRef=true;
    constructor(value) {
        this._rawValue=value;
        this._value = convert(value);
        this.dep = new Set()
    }

    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newValue) {
        if (hasChanged(newValue,this._rawValue)) {
            this._rawValue=newValue;
            this._value =convert(newValue);
            triggerEffects(this.dep) 
        }

    }
}

export function ref(value) {
    return new RefImpl(value)
}
function  trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}

function convert(value) {
    return isObject(value)?reactive(value):value;
}

export function isRef(ref) {
    return !!ref. _v_isRef;
}
export function unRef(ref) {
    return isRef(ref)?ref.value:ref;
}
export function proxyRefs(objectWithRefs){
    return new Proxy(objectWithRefs,{
        get(target,key){
            return unRef(Reflect.get(target,key))
        },
        set(target ,key,value){
            if(!isRef(value)&&isRef(target[key])){
                return (target[key].value=value);
            }else{
                return Reflect.set(target,key,value);
            }
        }

    })
}