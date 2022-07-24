class RangeList {
    ranges = [];

    add(range) {
        if(!this.isRange(range)) return;
    }

    remove(range) {
        if(!this.isRange(range)) return;
    }

    print() {
        console.log(this.ranges);
    }

    // The input value must be an array includes two integer elements, beginning and end of the range.
    isRange(input) {
        return input instanceof Array && input.length === 2 && Number.isInteger(input[0]) && Number.isInteger(input[1]);
    }
}

