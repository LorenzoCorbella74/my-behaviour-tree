
/*  This simply creates a wrapper node for any specific action. */

export default class ActionNode {
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

    // no conditional
    isConditional () {
        return false;
    };
}
