import c from './constants';
import IfNode from './IfNode';

/**
 *  Selector that takes a condition function returning the index of the action to be executed.
 *  This allows to compact a set of nested conditions in a more readable one.
 */
export default class SelectorArrayNode {

    constructor(conditionFunction, actionArray) {
        this.conditionFunction = conditionFunction;
        this.actionArray = actionArray;
    }

    execute (BTInstance) {
        let state = BTInstance.findStateForNode(this);
        if (state == c.RUNNING) {
            return;
        }
        // In both cases Sync and Async
        let resultInt;
        if (this.conditionFunction instanceof IfNode) {
            resultInt = this.conditionFunction.execute(BTInstance);
        } else {
            resultInt = this.conditionFunction(BTInstance);
        }
        if (state == c.RUNNING) {
            return;
        }
        for (let j = 0; j < this.actionArray.length; j++) {
            if (j == resultInt)
                BTInstance.setState(c.TO_BE_STARTED, this.actionArray[j]);
            else
                BTInstance.setState(c.DISCARDED, this.actionArray[j]);
        }
    }

    children () {
        return this.actionArray;
    }

    isConditional () {
        return true;
    }
}
