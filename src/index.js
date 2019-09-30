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
		this.nodeAndState = [];				// array piatto
		this.currentNode = null;			//è il nodo corrente
		this.numberOfLoops = numberOfLoops;
		this.numberOfRuns = 0;				// si confronta con il numero di loops
		this.finished = false; 				// è la letiabile che ferma il behavioural three
	}

	findStateForNode (node) {
		for (let i = 0; i < this.nodeAndState.length; i++) {
			if (this.nodeAndState[i][0] == node)
				return this.nodeAndState[i][1]; // ritorna ad es "TO_BE_COMPLETED"
		}
	}

	setState (state, node) {
		if (typeof node == "undefined")
			node = this.currentNode;
		for (let i = 0; i < this.nodeAndState.length; i++) {
			if (this.nodeAndState[i][0] == node) {
				this.nodeAndState.splice(i, 1);
				break;
			}
		}
		this.nodeAndState.push([node, state]); // doppio array con [ "Node", "TO_BE_STARTED"]
		return state;
	};

	/* ----------------------------- helpers methods ----------------------------- */
	hasToStart () {
		let state = this.findStateForNode(this.currentNode);
		return state != c.RUNNING && state != c.COMPUTE_RESULT;
	}

	hasToComplete () {
		let state = this.findStateForNode(this.currentNode);
		return state == c.COMPUTE_RESULT;
	}

	completedAsync () {
		if (!this.currentNode)
			return false;
		if (this.currentNode.isConditional())
			this.setState(c.COMPUTE_RESULT);
		else
			this.setState(c.COMPLETED);
	}

	waitUntil (callback) {
		this.setState(c.RUNNING);
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
		let state = this.findStateForNode(this.currentNode); // esempio: ...RUNNING
		if (state == null || state == c.TO_BE_STARTED) {
			//first call to execute
			//if the node is async, this will be the first of a two part call
			let result = this.currentNode.execute(this);
			let afterState = this.findStateForNode(this.currentNode);
			//if the node is async, it will set the state to RUNNING
			if (afterState == null || afterState == c.TO_BE_STARTED) {
				this.setState(c.COMPLETED);
			}
			return result;
		}
		// this is the case we have to call the second execute
		// on the async node, which will bring it compute the final result and end
		if (state == c.COMPUTE_RESULT) {
			let result = this.currentNode.execute(this);
			this.setState(c.COMPLETED);
			return result;
		}
	}

	// Finds in the behaviour tree instance the currend node that is either to be executed 
	// or is executing (async). Also marks all parent nodes COMPLETEDwhen necessary.
	findCurrentNode (node) {
		let state = this.findStateForNode(node);
		if (state == c.DISCARDED) return null;
		if (state == null) {
			state = this.setState(c.TO_BE_STARTED, node);
		}
		if (state == c.RUNNING || state == c.COMPUTE_RESULT || state == c.TO_BE_STARTED){
			return node;
		}
		let children = node.children();
		if (children == null) {
			return null;
		} else {
			for (let i = 0; i < children.length; i++) {
				let childNode = this.findCurrentNode(children[i]);
				if (childNode){
					return childNode;
				}
			}
			if (state == c.WAITING) {
				this.setState(c.COMPLETED, node);
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

