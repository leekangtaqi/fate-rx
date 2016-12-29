import Rx from 'rxjs/Rx';

export default class User {
	constructor(hero) {
		this.hero = hero;
		this.allowsOperator = ['KeyQ', 'KeyW', 'KeyE'];
		this.stream = null;
		this.gameoverSubject = new Rx.Subject();
		this.init();
	}
	init() {
		var keys = Rx.Observable
		.fromEvent(document, 'keyup')
		.map(e => e.code)
		.filter(code => this.allowsOperator.indexOf(code) >= 0)
		.map(code => {
			if (code === 'KeyQ') {
				return 0;
			}
			if (code === 'KeyW') {
				return 1;
			}
			if (code === 'KeyE') {
				return 2;
			}
		})

		this.gameoverSubject.subscribe(() => {
			this.gameover = true;
		})

		this.stream = keys.subscribe(index => {
			if (this.gameover) {
				return;
			}
			this.hero.trigger(index)
		})
	}
}