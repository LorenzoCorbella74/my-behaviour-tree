import c from './constants';
import IfNode from './IfNode';

/**
 *  selector that takes a condition function returning the index of the action to be executed.
 * This allows to compact a set of nested conditions in a more readable one.
 */
export default class SelectorArrayNode {

    constructor(conditionFunction, actionArray) {
        this.conditionFunction = conditionFunction;
        this.actionArray = actionArray;
    }

    execute (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == c.STATE_EXECUTING)
            return;
        //			In both cases Sync and Async
        var resultInt;
        if (this.conditionFunction instanceof IfNode) {
            resultInt = this.conditionFunction.execute(behaviourTreeInstanceState);
        }
        else {
            resultInt = this.conditionFunction(behaviourTreeInstanceState);
        }
        if (state == c.STATE_EXECUTING)
            return;
        for (var j = 0; j < this.actionArray.length; j++) {
            if (j == resultInt)
                behaviourTreeInstanceState.setState(c.STATE_TO_BE_STARTED, this.actionArray[j]);
            else
                behaviourTreeInstanceState.setState(c.STATE_DISCARDED, this.actionArray[j]);
        }
    }

    children () {
        return this.actionArray;
    }

    isConditional () {
        return true;
    };
}
