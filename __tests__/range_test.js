const RangeList = require('../index')

let rl;

beforeEach(() => rl = new RangeList())

test('given invalid input', () => {
    console.log = jest.fn();

    rl.add(10);
    expect(console.log).toHaveBeenCalledWith("Input value is not a legal range!");

    rl.add([1, 2, 3]);
    expect(console.log).toHaveBeenCalledWith("Input value is not a legal range!");

    rl.add("test");
    expect(console.log).toHaveBeenCalledWith("Input value is not a legal range!");

    rl.remove({a: 1});
    expect(console.log).toHaveBeenCalledWith("Input value is not a legal range!");
})

test('given empty range list and print', () => {
    expect(rl.print()).toBe("[]");
})

describe("Add range", () => {
    test("given empty range list", () => {
        rl.add([1, 3]);
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

describe("Remove range", () => {
    test("given empty range list", () => {
        rl.remove([1, 3]);
        expect(rl.print()).toBe("[]");
    })

    test("given not empty range list", () => {
        rl.add([1, 8]);
        rl.add([10, 21]);

        rl.remove([10, 10]);
        expect(rl.print()).toBe("[1, 8) [10, 21)");

        rl.remove([10, 11]);
        expect(rl.print()).toBe("[1, 8) [11, 21)");

        rl.remove([15, 17]);
        expect(rl.print()).toBe("[1, 8) [11, 15) [17, 21)");

        rl.remove([3, 19]);
        expect(rl.print()).toBe("[1, 3) [19, 21)");

        rl.remove([20, 23]);
        expect(rl.print()).toBe("[1, 3) [19, 20)");

        rl.remove([1, 30]);
        expect(rl.print()).toBe("[]");
    })
})