import { readonly } from "../reactive";
describe("readonly",()=>{
    it('should only read no use set', () => {
        // not use set
        const original={foo:1,bar:{bar:2}};
        const wrapped=readonly(original)
        expect(wrapped).not.toBe(original)
        expect(wrapped.foo).toBe(1) 
    });

    it('warning when call set', () => {
        // console.warn()
        // mock
        console.warn=jest.fn()
        const user=readonly({
            age:10,
        });

        user.age=11
        expect(console.warn).toBeCalled()
    });
})
