import c from './constants';
import shuffle from './Utils';

/**
 * This is a cool extension of selector that executes all actions in random sequence.
 */
export default class SequencerRandomNode {

    constructor(actionArray) {
        this.actionArray = actionArray;
    }

    execute(behaviourTreeInstanceState) {
        shuffle(actionArray);
        behaviourTreeInstanceState.setState(c.STATE_WAITING);
        behaviourTreeInstanceState.setState(c.STATE_TO_BE_STARTED, actionArray[0]);
    }

    children() {
        return actionArray;
    }

    isConditional() {
        return false;
    };
}
;