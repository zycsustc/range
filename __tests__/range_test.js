const RangeList = require('../index')

let rl;

beforeEach(() => rl = new RangeList())

test('given invalid input', () => {
    console.log = jest.fn();
    rl.add(10);
    expect(console.log).toHaveBeenCalledWith("Input value is not a legal range!");
})

describe("Add range", () => {
    test("given empty range list", () => {
        rl.add([1,3]);
        expect(rl.print()).toBe("[1, 3)");
    })

    test("given not empty range list", () => {
        rl.add([1, 5]);
        rl.add([10, 20]);
        expect(rl.print()).toBe("[1, 5) [10, 20)");

        rl.add([20, 20]);
        expect(rl.print()).toBe("[1, 5) [10, 20)");

        rl.add([20, 21]);
        expect(rl.print()).toBe("[1, 5) [10, 21)");

        rl.add([2, 4]);
        expect(rl.print()).toBe("[1, 5) [10, 21)");

        rl.add([3, 8]);
        expect(rl.print()).toBe("[1, 8) [10, 21)");

        rl.add([9, 9]);
        expect(rl.print()).toBe("[1, 8) [10, 21)");

        rl.add([1, 30]);
        expect(rl.print()).toBe("[1, 30)");
    })
})