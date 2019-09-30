import c from './nodes/constants';

import example from './examples';

/**
 *
 * @param behaviourTree
 * @param actor
 * @param numberOfLoops 0 forever
 * @constructor
 */
export default class BehaviourTreeInstance {

	constructor(behaviourTree, actor, numberOfLoops = 1) {

		this.behaviourTree = behaviourTree; // è la gerarchia di azioni che vengono passate
		this.actor = actor; 				// è l'oggetto su cui vengono fatte girare le azioni (l'actor)
		this.nodeAndState = [];
		this.currentNode = null;
		this.numberOfLoops = numberOfLoops;
		this.numberOfRuns = 0;
		this.finished = false; // è la variabile che ferma il behavioural three
	}

	findStateForNode (node) {
		for (var i = 0; i < this.nodeAndState.length; i++) {
			if (this.nodeAndState[i][0] == node)
				return this.nodeAndState[i][1]; // ritorna ad es "STATE_TO_BE_COMPLETED"
		}
	}

	setState (state, node) {
		if (typeof node == "undefined")
			node = this.currentNode;
		for (var i = 0; i < this.nodeAndState.length; i++) {
			if (this.nodeAndState[i][0] == node) {
				this.nodeAndState.splice(i, 1);
				break;
			}
		}
		this.nodeAndState.push([node, state]); // doppio array con [ "Node", "STATE_TO_BE_STARTED"]
		return state;
	};

	/* ----------------------------- helpers methods ----------------------------- */
	hasToStart () {
		var state = this.findStateForNode(this.currentNode);
		return state != c.STATE_EXECUTING && state != c.STATE_COMPUTE_RESULT;
	}

	hasToComplete () {
		var state = this.findStateForNode(this.currentNode);
		return state == c.STATE_COMPUTE_RESULT;
	}

	completedAsync () {
		if (!this.currentNode)
			return false;
		if (this.currentNode.isConditional())
			this.setState(c.STATE_COMPUTE_RESULT);
		else
			this.setState(c.STATE_COMPLETED);
	}

	waitUntil (callback) {
		this.setState(c.STATE_EXECUTING);
		callback();
	}

	/* ----------------------------- helpers methods ----------------------------- */

	/**
	 * This is the function that crawls the behaviour tree instance you pass to it
	 * and calls the executors if the the argument is a node of some kind, calls it as an action otherwise.
	 * The same node may be called to execute twice, once for starting it and on a subsequent tick for completion.
	 */
	executeBehaviourTree () {
		if (this.finished)
			return;
		//find current node to be executed, or a running one, or root to launch, or root completed
		this.currentNode = this.findCurrentNode(this.behaviourTree);
		if (this.currentNode == null) {
			this.numberOfRuns++;
			if (this.numberOfLoops == 0 || this.numberOfRuns < this.numberOfLoops) {
				this.nodeAndState = [];
				this.currentNode = this.findCurrentNode(this.behaviourTree);
			}
			else {
				this.finished = true;
				return;
			}
		}
		var state = this.findStateForNode(this.currentNode); // esempio: ...STATE_EXECUTING
		if (state == null || state == c.STATE_TO_BE_STARTED) {
			//first call to execute
			//if the node is async, this will be the first of a two part call
			var result = this.currentNode.execute(this);
			var afterState = this.findStateForNode(this.currentNode);
			//if the node is async, it will set the state to STATE_EXECUTING
			if (afterState == null || afterState == c.STATE_TO_BE_STARTED) {
				this.setState(c.STATE_COMPLETED);
			}
			return result;
		}
		// this is the case we have to call the second execute
		// on the async node, which will bring it compute the final result and end
		if (state == c.STATE_COMPUTE_RESULT) {
			var result = this.currentNode.execute(this);
			this.setState(c.STATE_COMPLETED);
			return result;
		}
	}

	// Finds in the behaviour tree instance the currend node that is either to be executed 
	// or is executing (async). Also marks all parent nodes completed when necessary.
	findCurrentNode (node) {
		var state = this.findStateForNode(node);
		if (state == c.STATE_DISCARDED)
			return null;
		if (state == null) {
			state = this.setState(c.STATE_TO_BE_STARTED, node);
		}
		if (state == c.STATE_EXECUTING ||
			state == c.STATE_COMPUTE_RESULT ||
			state == c.STATE_TO_BE_STARTED)
			return node;
		var children = node.children();
		if (children == null) {
			return null;
		}
		else {
			for (var i = 0; i < children.length; i++) {
				var childNode = this.findCurrentNode(children[i]);
				if (childNode)
					return childNode;
			}
			if (state == c.STATE_WAITING) {
				this.setState(c.STATE_COMPLETED, node);
			}
		}
		return null;
	}

}



window.onload = function () {

	const btn = document.getElementById('main');
	btn.addEventListener('click',function(e){
		example();
	})
}

