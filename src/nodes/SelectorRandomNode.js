import c from './constants';

/**
 *  Selector that executes randomly one of the actions in the array.
 */

export default class SelectorRandomNode {

    constructor(actionArray) {
        this.actionArray = actionArray;
    }

    execute (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == c.STATE_EXECUTING)
            return;
        var randomIndex = Math.floor(Math.random() * actionArray.length);
        behaviourTreeInstanceState.setState(c.STATE_WAITING, this);
        for (var j = 0; j < actionArray.length; j++) {
            if (j == randomIndex)
                behaviourTreeInstanceState.setState(c.STATE_TO_BE_STARTED, actionArray[j]);
            else
                behaviourTreeInstanceState.setState(c.STATE_DISCARDED, actionArray[j]);
        }
    }

    children () {
        return actionArray;
    }

    isConditional () {
        return false;
    };
}
