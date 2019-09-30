import ActionNode from './nodes/ActionNode';
import IfNode from './nodes/IfNode';
import SelectorArrayNode from './nodes/SelectorArrayNode';
import SelectorNode from './nodes/SelectorNode';
import SelectorRandomNode from './nodes/SelectorRandomNode';
import SelectorRandomProbabilityNode from './nodes/SelectorRandomProbabilityNode';
import SelectorWeightedRandomNode from './nodes/SelectorWeightedRandomNode';
import SequencerNode from './nodes/SequencerNode';
import SequencerRandomNode from './nodes/SequencerRandomNode';

import BehaviourTreeInstance from './index';

// E' l'unica variabvile che rappresenta il world TODO: mettre un oggetto da passare dentro ogni 
var totalKidsWondering = 20;

export default function example () {
	/**
	 *  PolicemanManager is like a static instance that processes actions on a given actor
	 *  through a behaviour tree instance. Sotto sono tutte funzioni 
	 */
	var PolicemanManager = {};

	PolicemanManager.ifKidInSight = function (BTInstance) {

		BTInstance.setState(BehaviourTreeInstance.COMPLETED);

		if (totalKidsWondering > 0) {
			console.log("total kids wandering: " + totalKidsWondering);
			var b = Math.random() > 0;
			console.log(BTInstance.actor.name + ": " + "see kid? " + (b ? "yes" : "no"));
			return b;
		} else {
			console.log(BTInstance.actor.name + ": " + "No more kids");
			return false;
		}
	};

	PolicemanManager.ifChaseGotKid = function (BTInstance) {
		console.log("ifChaseGotKid 1 ->" + new Date());
		console.log("ifChaseGotKid state: " + BTInstance.findStateForNode(BTInstance.currentNode));

		if (BTInstance.hasToStart()) {
			console.log("ifChaseGotKid 2 ->" + new Date());
			console.log("running after kid");

			BTInstance.waitUntil(function () {
				setTimeout(function () {
					console.log("ifChaseGotKid 2.5 ->" + new Date());
					BTInstance.completedAsync();
				}, 3000);
			});

		} else if (BTInstance.hasToComplete()) {
			console.log("ifChaseGotKid 3 ->" + new Date());
			var b = Math.random() > 0.5;
			console.log(BTInstance.actor.name + ": " + " got child: " + b);
			return b;

		} else {
			console.log("ifChaseGotKid 4 ->" + new Date());
			console.log("running after kid doing nothing");
		}

		console.log("ifChaseGotKid 5 ->" + new Date());

	};

	PolicemanManager.ifChaseGotKidCases = function (BTInstance) {
		if (BTInstance.hasToStart()) {
			console.log("running after kid");
			console.debug("ifChaseGotKid currentNode ", BTInstance.currentNode);
			BTInstance.waitUntil(function () {
				setTimeout(function () {
					BTInstance.completedAsync();
				}, 3000);
			});
		} else if (BTInstance.hasToComplete()) {
			var random = Math.random();
			var b = random > 0.6 ? 2 : (random > 0.3 ? 1 : 0);
			console.log(BTInstance.actor.name + ": " + " got child: " + b);
			return b;
		} else {
			console.log("running after kid doing nothing");
		}
	};

	PolicemanManager.actionBringChildToStation = function (BTInstance) {
		if (BTInstance.hasToStart()) {
			console.log(BTInstance.actor.name + ": " + "Bring child to station");
			BTInstance.waitUntil(function () {
				setTimeout(function () {
					console.log(BTInstance.actor.name + ": " + " child in station");
					BTInstance.completedAsync();
				}, 3000);
			});
			totalKidsWondering--;
		}
	};

	PolicemanManager.actionBringChildHome = function (BTInstance) {
		totalKidsWondering--;
		console.log(BTInstance.actor.name + ": " + "Bring child home");
	};

	PolicemanManager.actionSmoke = function (BTInstance) {
		console.log(BTInstance.actor.name + ": " + "Smoke");
	};

	PolicemanManager.actionImHurt = function (BTInstance) {
		console.log(BTInstance.actor.name + ": " + "  I'm hurt!");
	};


	PolicemanManager.actionWanderAround = function (BTInstance) {
		console.log(BTInstance.actor.name + ": " + "Wander around");
	};

	// examples of behaviour tree definitions

	var patrollingPoliceBehaviourTreeTwoResults =
		(new SelectorNode(
			PolicemanManager.ifKidInSight,	// ritorna true o false...
			new SelectorNode(
				PolicemanManager.ifChaseGotKid,
				new ActionNode(PolicemanManager.actionBringChildToStation),
				new SequencerNode([new ActionNode(PolicemanManager.actionWanderAround), new ActionNode(PolicemanManager.actionSmoke)])
			),
			new ActionNode(PolicemanManager.actionSmoke)
		));

	var patrollingPoliceBehaviourSimpleTreeTwoResults =
		(new SelectorNode(
			PolicemanManager.ifKidInSight,
			new ActionNode(PolicemanManager.actionWanderAround),
			new ActionNode(PolicemanManager.actionSmoke)
		));

	var patrollingPoliceBehaviourTreeRandomWeightedResults =
		(new SelectorWeightedRandomNode(
			[
				[0.2, new ActionNode(PolicemanManager.actionSmoke)],
				[0.8, new ActionNode(PolicemanManager.actionWanderAround)]
			]
		));

	var patrollingPoliceBehaviourTreeRandomProbabilityResults =
		(new SelectorRandomProbabilityNode(
			[
				[22, new ActionNode(PolicemanManager.actionSmoke)],
				[100, new ActionNode(PolicemanManager.actionWanderAround)]
			]
		));

	var patrollingPoliceBehaviourTreeMultiResults =
		new SelectorArrayNode(
			new IfNode(PolicemanManager.ifChaseGotKidCases),
			[
				new ActionNode(PolicemanManager.actionBringChildToStation),
				new SequencerNode([
					new ActionNode(PolicemanManager.actionWanderAround), 
					new ActionNode(PolicemanManager.actionSmoke)
				]),
				new ActionNode(PolicemanManager.actionImHurt)
			]
		);

	var patrollingPoliceBehaviourTreeRandomResults =
		new SelectorRandomNode(
			[
				new ActionNode(PolicemanManager.actionBringChildToStation),
				new SequencerRandomNode([
					new ActionNode(PolicemanManager.actionWanderAround), 
					new ActionNode(PolicemanManager.actionSmoke)
				]),
				new ActionNode(PolicemanManager.actionImHurt)
			]
		);

	var patrollingPoliceBehaviourTreeRandom =
		new SequencerRandomNode([
			new ActionNode(PolicemanManager.actionWanderAround), 
			new ActionNode(PolicemanManager.actionSmoke)
		]);


	/**
	 * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
	 * and get them acting on a certain behaviour tree instance.
	 */
	var policeman1 = {};
	policeman1.name = "Bobby";
	policeman1.haveBeenChasing = 0;

	var bti1 = new BehaviourTreeInstance(patrollingPoliceBehaviourTreeMultiResults, policeman1, 1);
	
	gameLoop(bti1);

	//you can have several instances of course
	/* var policeman2 = {};
	 policeman2.name = "Jimmy";
	 var bti2 = new BehaviourTreeInstance(patrollingPoliceBehaviourTreeTwoResults,policeman2,1);
	 gameLoop(bti2); */
}


function gameLoop (behaviourTreeInstance) {
	var tick = setInterval(function () {
		behaviourTreeInstance.executeBehaviourTree();

		if (behaviourTreeInstance.finished) {
			console.log(behaviourTreeInstance.actor.name + " has finished.");
			clearTimeout(tick);
		}
	}, 100);
}



