
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
export default class ActionNode {
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

    // non è condizionale
    isConditional () {
        return false;
    };
}
