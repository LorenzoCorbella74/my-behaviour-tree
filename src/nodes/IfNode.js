
/**
 * This node is required on Selector nodes that are ruled by a logic.
 * You may also omit it and pass directly the method, will work anyway.
 */
export default class IfNode {

    constructor(action) {
        this.action = action;
    }

    execute (BTInstance) {
        return this.action(BTInstance);
    }

    // no children
    children () {
        return null;
    }

    // TRUE!
    isConditional () {
        return true;
    }
}
