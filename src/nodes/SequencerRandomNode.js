import c from './constants';
import shuffle from './Utils';

/**
 *  Extension of selector that executes all actions in random sequence.
 */
export default class SequencerRandomNode {

    constructor(actionArray) {
        this.actionArray = actionArray;
    }

    execute(BTInstance) {
        shuffle(this.actionArray);
        BTInstance.setState(c.WAITING);
        BTInstance.setState(c.TO_BE_STARTED, this.actionArray[0]);
    }

    children() {
        return this.actionArray;
    }

    isConditional() {
        return false;
    };
}
;