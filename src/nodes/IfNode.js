
/**
 * This node is required on Selector nodes that are ruled by a logic.
 * You may also omit it and pass directly the method, will work anyway.
 */
export default class IfNode {
    constructor(action) {
        this.action = action;
    }

    execute (behaviourTreeInstanceState) {
        return this.action(behaviourTreeInstanceState);
    }

    // non ha figli
    children () {
        return null;
    }

    // è condizionale
    isConditional () {
        return true;
    };
}
