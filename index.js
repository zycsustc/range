const RangeNode = require('./model/range_node')

const invalidRangeInputMsg = "Input value is not a legal range!";

class RangeList {
    ranges = [];

    add(range) {
        // Input type judgement.
        if (!this.isRange(range)) {
            console.log(invalidRangeInputMsg)
            return;
        }

        const [a, b] = range;

        // First, deal with some special cases where new range can enlarge the boundary of the whole range area.
        if (a === b) return;
        if (this.ranges.length === 0) {
            this.ranges = [this.createStartNode(a), this.createEndNode(b)]
            return;
        }
        if (a >= this.rangeMaxVal()) {
            if (a === this.rangeMaxVal()) {
                this.ranges.pop();
                this.ranges.push(this.createEndNode(b));
            } else {
                this.ranges.push(this.createStartNode(a));
                this.ranges.push(this.createEndNode(b));
            }
            return;
        }
        if (b <= this.rangeMinVal()) {
            if (b === this.rangeMinVal()) {
                this.ranges[0] = this.createStartNode(a);
            } else {
                this.ranges.unshift(this.createStartNode(a));
                this.ranges.unshift(this.createEndNode(b));
            }
            return;
        }
        if (a <= this.rangeMinVal() && b >= this.rangeMaxVal()) {
            this.ranges = [this.createStartNode(a), this.createEndNode(b)]
            return;
        }
        if (a <= this.rangeMinVal()) {
            let [beforeB, afterB] = this.getBoundary(b);
            let index = this.ranges.indexOf(beforeB);
            if (beforeB.isEnd()) {
                this.ranges = [this.createStartNode(a), this.createEndNode(b), ...this.ranges.slice(index + 1)];
            }
            if (afterB.isEnd()) {
                this.ranges = [this.createStartNode(a), ...this.ranges.slice(index + 1)];
            }
            return;
        }
        if (b >= this.rangeMaxVal()) {
            let [beforeA, afterA] = this.getBoundary(a);
            let index = this.ranges.indexOf(afterA);
            if (afterA.isStart()) {
                this.ranges = [...this.ranges.slice(0, index), this.createStartNode(a), this.createEndNode(b)];
            }
            if (beforeA.isStart()) {
                this.ranges = [...this.ranges.slice(0, index), this.createEndNode(b)];
            }
            return;
        }

        // Second, deal with normal cases where new range lays in the existed range area.
        const [beforeA, afterA] = this.getBoundary(a);
        const [beforeB, afterB] = this.getBoundary(b);
        if (beforeA.isEnd() && beforeB.isEnd()) {
            let indexA = this.ranges.indexOf(afterA);
            let indexB = this.ranges.indexOf(afterB);
            this.ranges = [...this.ranges.slice(0, indexA), this.createStartNode(a), this.createEndNode(b), ...this.ranges.slice(indexB)];
            return;
        }
        if (beforeA.isEnd() && beforeB.isStart()) {
            let indexA = this.ranges.indexOf(afterA);
            this.ranges[indexA] = this.createStartNode(a);
            return;
        }
        if (beforeA.isStart() && beforeB.isStart()) {
            let indexA = this.ranges.indexOf(beforeA);
            let indexB = this.ranges.indexOf(afterB);
            this.ranges = [...this.ranges.slice(0, indexA), beforeA, afterB, ...this.ranges.slice(indexB + 1)];
            return;
        }
        if (beforeA.isStart() && beforeB.isEnd()) {
            let indexB = this.ranges.indexOf(beforeB);
            this.ranges[indexB] = this.createEndNode(b);
        }
    }

    remove(range) {
        // Input type judgement.
        if (!this.isRange(range)) {
            console.log(invalidRangeInputMsg)
            return;
        }
        if (this.ranges.length === 0) return;

        const [a, b] = range;
        if (a === b) return;

        // Deal with special cases where a or b exceeds existed range boundary.
        if (a >= this.rangeMaxVal()) {
            if (a === this.rangeMaxVal()) {
                this.ranges[this.ranges.length - 1].val -= 1;
            }
            return;
        }
        if (b <= this.rangeMinVal()) return;
        if (a <= this.rangeMinVal() && b >= this.rangeMaxVal()) {
            this.ranges = [];
            return;
        }
        if (a <= this.rangeMinVal()) {
            const [beforeB, afterB] = this.getBoundary(b);
            const indexB = this.ranges.indexOf(afterB);
            if (beforeB.isStart()) {
                this.ranges = [this.createStartNode(b), ...this.ranges.slice(indexB)];
                return;
            }
            if (beforeB.isEnd()) {
                this.ranges = this.ranges.slice(indexB);
                return;
            }
        }
        if (b >= this.rangeMaxVal()) {
            const [beforeA, afterA] = this.getBoundary(a);
            const indexA = this.ranges.indexOf(afterA);
            if (beforeA.isStart()) {
                this.ranges = [...this.ranges.slice(0, indexA), this.createEndNode(a)];
                return;
            }
            if (beforeA.isEnd()) {
                this.ranges = this.ranges.slice(indexA);
                return;
            }
        }

        // Deal with normal cases where the range lays in existed range area.
        const [beforeA, afterA] = this.getBoundary(a);
        const [beforeB, afterB] = this.getBoundary(b);
        const indexA = this.ranges.indexOf(afterA);
        const indexB = this.ranges.indexOf(afterB);

        if (beforeA.isEnd() && beforeB.isEnd()) {
            this.ranges = [...this.ranges.slice(0, indexA), ...this.ranges.slice(indexB)];
            return;
        }
        if (beforeA.isEnd() && beforeB.isStart()) {
            this.ranges = [...this.ranges.slice(0, indexA), this.createStartNode(b), ...this.ranges.slice(indexB)];
            return;
        }
        if (beforeA.isStart() && beforeB.isEnd()) {
            if (a === beforeA.val) {
                this.ranges = [...this.ranges.slice(0, indexA - 1), ...this.ranges.slice(indexB)]
            } else {
                this.ranges = [...this.ranges.slice(0, indexA), this.createEndNode(a), ...this.ranges.slice(indexB)];
            }
            return;
        }
        if (beforeA.isStart() && beforeB.isStart()) {
            if (a === beforeA.val) {
                this.ranges = [...this.ranges.slice(0, indexA - 1), this.createStartNode(b), ...this.ranges.slice(indexB)]
            } else {
                this.ranges = [...this.ranges.slice(0, indexA), this.createEndNode(a), this.createStartNode(b), ...this.ranges.slice(indexB)];
            }
        }
    }

    print() {
        let printedRangeList = '';
        if (this.ranges.length === 0) {
            console.log("[]");
            return "[]";
        }
        // By design, the odd element is start node, the even element is end node.
        for (let i = 0; i < this.ranges.length; i += 2) {
            printedRangeList += `[${this.ranges[i].val}, ${this.ranges[i + 1].val}) `
        }
        console.log(printedRangeList.trimEnd());
        return printedRangeList.trimEnd();
    }

    // The input value must be an array having two integer elements, beginning and end of the range.
    isRange(input) {
        return input instanceof Array && input.length === 2 && Number.isInteger(input[0]) && Number.isInteger(input[1]);
    }

    rangeMaxVal = () => this.ranges[this.ranges.length - 1].val;
    rangeMinVal = () => this.ranges[0].val;

    createStartNode = (val) => new RangeNode(val, RangeNode.type.START);
    createEndNode = (val) => new RangeNode(val, RangeNode.type.END);

    getBoundary(val) {
        let beforeNode;
        let afterNode;
        for (let i = 0; i < this.ranges.length; i++) {
            if (this.ranges[i].val > val) {
                afterNode = this.ranges[i];
                beforeNode = this.ranges[i - 1];
                break;
            }
        }
        return [beforeNode, afterNode];
    }
}

module.exports = RangeList