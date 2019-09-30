import c from './constants';
import chooseByProbability from './Utils';

/**
 * This node executes randomly one of the nodes on the base of the probability assigned to the node,
 * but to make it easier to write and modify the probability is assigned as an integer value.
 * The node will normalize the values in a [0,1] interval.
 * Example:
 * [
 * [100 Lazy around]
 * [22 Pretend to work]
 * [1 Actually work]
 * ]
 *
 */

export default class SelectorRandomProbabilityNode {

    constructor(probabilityActionMap) {
        this.weightsActionMap = probabilityActionMap;
    }

    execute (BTInstance) {
        var state = BTInstance.findStateForNode(this);
        if (state == c.RUNNING)
            return;
        var action = chooseByProbability(this.weightsActionMap);
        BTInstance.setState(c.WAITING, this);
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            if (this.weightsActionMap[j][1] == action)
                BTInstance.setState(c.TO_BE_STARTED, action);
            else
                BTInstance.setState(c.DISCARDED, this.weightsActionMap[j][1]);
        }
    }

    children () {
        var actionArray = [];
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            actionArray.push(this.weightsActionMap[j][1]);
        }
        return actionArray;
    }

    isConditional () {
        return false;
    }
}
