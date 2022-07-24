class RangeNode {
    static type = {
        START: 'start',
        END: 'end'
    }

    constructor(val, type) {
        this.val = val;
        this.type = type;
    }

    isStart = () => this.type === RangeNode.type.START;
    isEnd = () => this.type === RangeNode.type.END;
}

module.exports = RangeNode