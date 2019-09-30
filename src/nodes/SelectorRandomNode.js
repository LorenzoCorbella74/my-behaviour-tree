import c from './constants';

/*  Selector that executes randomly one of the actions in the array.    */

export default class SelectorRandomNode {

    constructor(actionArray) {
        this.actionArray = actionArray;
    }

    execute (BTInstance) {
        var state = BTInstance.findStateForNode(this);
        if (state == c.RUNNING)
            return;
        var randomIndex = Math.floor(Math.random() * this.actionArray.length);
        BTInstance.setState(c.WAITING, this);
        for (var j = 0; j < this.actionArray.length; j++) {
            if (j == randomIndex) {
                BTInstance.setState(c.TO_BE_STARTED, this.actionArray[j]);
            } else {
                BTInstance.setState(c.DISCARDED, this.actionArray[j]);
            }
        }
    }

    children () {
        return this.actionArray;
    }

    isConditional () {
        return false;
    };
}
