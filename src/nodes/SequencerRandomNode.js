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
        BTInstance.setState(c.WAITING);                            // il nodo padre si mette in waiting
        BTInstance.setState(c.TO_BE_STARTED, this.actionArray[0]); // il primo figlio si mette in start
    }

    children() {
        return this.actionArray;
    }

    isConditional() {
        return false;
    };
}
;