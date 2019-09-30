import c from './constants';

/**
 * This is a selector that executes all actions in sequence.
 */
export default class SequencerNode {

    constructor(actionArray) {
        this.actionArray = actionArray;
    }

    execute (BTInstance) {
        BTInstance.setState(c.WAITING);
        BTInstance.setState(c.TO_BE_STARTED, this.actionArray[0]);
    }

    children () {
        return this.actionArray;
    }

    isConditional () {
        return false;
    };
}
;