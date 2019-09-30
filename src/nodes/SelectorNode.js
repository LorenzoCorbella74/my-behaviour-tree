import c from './constants';
import IfNode from './IfNode';

/**
 * This models the "selector" behaviour on two alternative conditions
 * You use this function in configuring your actor behaviour.
 */
export default class SelectorNode {

    constructor(conditionFunction, actionIfTrue, actionIfFalse) {
        this.conditionFunction = conditionFunction;
        this.actionIfTrue = actionIfTrue;
        this.actionIfFalse = actionIfFalse;
    }

    execute (BTInstance) {
        var state = BTInstance.findStateForNode(this);
        if (state == c.RUNNING)
            return;
        // In both cases Sync and Async
        var result;
        if (this.conditionFunction instanceof IfNode) {
            result = this.conditionFunction.execute(BTInstance);
        } else {
            result = this.conditionFunction(BTInstance);
        }
        //	console.debug("SelectorNode result", result);
        if (state == c.RUNNING) return;
        if (result) {
            BTInstance.setState(c.TO_BE_STARTED, this.actionIfTrue);
            BTInstance.setState(c.DISCARDED, this.actionIfFalse);
        } else {
            BTInstance.setState(c.TO_BE_STARTED, this.actionIfFalse);
            BTInstance.setState(c.DISCARDED, this.actionIfTrue);
        }
    }

    children () {
        return [this.actionIfTrue, this.actionIfFalse];
    }

    isConditional () {
        return true;
    };
}
