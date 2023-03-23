import { reactive } from "../reactive";
import  {effect ,stop} from '../effect';
describe('effect',()=>{
  
    it("should observe basic properties", () => {
        let dummy;
        const counter = reactive({ num: 0 });
        effect(() => (dummy = counter.num));
    
        expect(dummy).toBe(0);
        counter.num = 7;
        expect(dummy).toBe(7);
    });

    it('should return runner when call effect', () => {
        // 1. effect(fn) ->function (runner) -> fn -> return
        let testNum=1;
        const runner=effect(()=>{
            testNum++;
            return 'testString'
        })

        expect(testNum).toBe(2);
        const testRun=runner();
        expect(testNum).toBe(3)
        expect(testRun).toBe('testString')
    });

    it('scheduler', () => {
        let dummy;
        let run:any;
        const scheduler=jest.fn(()=>{
            run=runner;
        });
        const obj=reactive({foo:1});
        const runner=effect(
            ()=>{
                dummy=obj.foo
            },
            {scheduler}
        )
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // should be called on first trigger
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1)
        //  should not run
        expect(dummy).toBe(1)
        run()
        // use run() then fn() 
        expect(dummy).toBe(2)
    });

    it('stop', () => {
        let dummy;
        const obj=reactive({prop:1});
        const runner=effect(()=>{
            dummy=obj.prop;
        });
        obj.prop=2;
        expect(dummy).toBe(2);
        stop(runner);
        // obj.prop=3;
        obj.prop++;
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
    });

    it('onStop', () => {
        const obj=reactive({
            foo:1
        });
        const onStop=jest.fn();
        let dummy;
        const runner=effect(
            ()=>{
                dummy=obj.foo;
            },
            {
                onStop,
            }
        );
        stop(runner);
        expect(onStop).toBeCalledTimes(1)
    });
})