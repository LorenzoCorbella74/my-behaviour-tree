import c from './constants';

/**
 * This is a selector that executes all actions in sequence.
 */
export default class SequencerNode {

    constructor(actionArray) {
        this.actionArray = actionArray;
    }

    execute (behaviourTreeInstanceState) {
        behaviourTreeInstanceState.setState(c.STATE_WAITING);
        behaviourTreeInstanceState.setState(c.STATE_TO_BE_STARTED, actionArray[0]);
    }

    children () {
        return actionArray;
    }

    isConditional () {
        return false;
    };
}
;