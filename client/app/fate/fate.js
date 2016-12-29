import Rx from 'rxjs/Rx';

class Skill {
	constructor(hero) {
		this.hero = hero;
	}
	routine() {
		throw new Error('routine must be override.');
	}
	trigger() {
		throw new Error('trigger must be override.');
	}
	fire() {
		throw new Error('fire must be override.');
	}
}

class Card {
	constructor(type) {
		this.type = type;
		this._next = null;
	}
	get next() {
		return this._next;
	}
	set next(successor) {
		this._next = successor;
	}
}

class PickCard extends Skill {
	constructor(hero) {
		super(hero);
		this.index = 0;
		this.active = false;
		this.isCD = false;
		this.isPicked = false;
		this.picked = null;
		this.pickedTimeout = null;
		this.endTimeout = null;
		this.hero = hero;
		this.during = 600;
		this.duration = 4000;
		this.cdTime = 6000;
		this.currCard = null;
		this.cardBlue = new Card('blue');
		this.cardRed = new Card('red');
		this.cardYellow = new Card('yellow');
		this.cardBlue.next = this.cardRed;
		this.cardRed.next = this.cardYellow;
		this.cardYellow.next = this.cardBlue;
		this.pickingSubject = new Rx.Subject();
		this.pickSubject = new Rx.Subject();
		this.pickEndSubject = new Rx.Subject();
		this.endSubject = new Rx.Subject();
		this.routine();
	}

	routine() {
		var interval = Rx.Observable.interval(this.during);
		interval.subscribe(() => {
			this.nextCard();
		})
	}

	getRandomCard() {
		let index = Math.floor(Math.random() * 3);
		switch (index) {
			case 0:
				return this.cardRed;
			case 1:
				return this.cardYellow;
			case 2:
				return this.cardBlue;
		}
	}

	nextCard() {
		if (!this.currCard) {
			this.currCard = this.getRandomCard();
		} else {
			this.currCard = this.currCard.next;
		}
		if (this.picking) {
			this.pickingSubject.next();
		}
	}

	trigger() {
		if (this.isCD) {
			return;
		}

		if (!this.isPicked) {
			if( this.picking ) {
				this.pick();
			} else {
				this.pickStart();
			}
		}
		
		if (!this.pickedTimeout) {
			this.pickedTimeout = setTimeout(this.activeEnd.bind(this), this.duration);
		}
		
		if (!this.endTimeout) {
			this.endTimeout = setTimeout(this.end.bind(this), this.cdTime)
		}
	}

	pickStart() {
		this.picking = true;
		// todo picking
		this.pickingSubject.next();
	}

	pick() {
		this.picked = this.currCard;
		this.isPicked = true;
		this.picking = false;
		// pick next
		this.pickSubject.next();
	}

	activeEnd() {
		this.isPicked = false;
		this.picked = null;
		this.isCD = true;
		this.pickEndSubject.next();
	}

	end() {
		this.isCD = false;
		this.picking = false;
		clearTimeout(this.pickedTimeout)
		clearTimeout(this.endTimeout)
		this.pickedTimeout = null;
		this.endTimeout = null;
		// end next
		this.endSubject.next();
	}

};

class WildCard extends Skill {
	constructor(...args) {
		super(args);
		this.index = 1;
	}
	routine() {

	}
	trigger() {

	}
	fire() {

	}
}

export default class Fate {
	constructor() {
		this.wildCard = new WildCard(this);
		this.pickCard = new PickCard(this);
		this.skills = [this.wildCard, this.pickCard];
		this.cdTime = 6000;
		this.init();
	}

	trigger(index) {
		let skill = this.skills[index];
		skill.trigger();
	}

	fire() {
		let skill = this.skills[index];
		skill.fire();
	}

	gameover() {
		
	}

	init() {
		// noop	

	}
}