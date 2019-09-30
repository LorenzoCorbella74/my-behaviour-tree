import c from './constants';

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

    /**
     * This makes a given SelectorNode instance execute.
     * This function is used by the engine executeBehaviourTree
     * when a node of type SelectorNode is met
     */
    execute (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == c.STATE_EXECUTING)
            return;
        // In both cases Sync and Async
        var result;
        if (this.conditionFunction instanceof IfNode) {
            result = this.conditionFunction.execute(behaviourTreeInstanceState);
        }
        else {
            result = this.conditionFunction(behaviourTreeInstanceState);
        }
        //		console.debug("SelectorNode result", result);
        if (state == c.STATE_EXECUTING)
            return;
        if (result) {
            behaviourTreeInstanceState.setState(c.STATE_TO_BE_STARTED, this.actionIfTrue);
            behaviourTreeInstanceState.setState(c.STATE_DISCARDED, this.actionIfFalse);
        }
        else {
            behaviourTreeInstanceState.setState(c.STATE_TO_BE_STARTED, this.actionIfFalse);
            behaviourTreeInstanceState.setState(c.STATE_DISCARDED, this.actionIfTrue);
        }
    }

    children () {
        return [this.actionIfTrue, this.actionIfFalse];
    }

    isConditional () {
        return true;
    };
}
