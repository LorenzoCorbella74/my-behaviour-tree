import c from './constants';

/**
 * This is a selector that executes all actions in sequence.
 */
export default class SequencerNode {

    constructor(actionArray) {
        this.actionArray = actionArray;
    }

    execute (BTInstance) {
        BTInstance.setState(c.WAITING);                                 // il nodo padre si mette in waiting
        BTInstance.setState(c.TO_BE_STARTED, this.actionArray[0]);      // il primo figlio si mette in start
    }   

    children () {
        return this.actionArray;
    }

    isConditional () {
        return false;
    };
}
;