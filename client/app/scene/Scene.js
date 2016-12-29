import * as riot from 'riot';
import Hero from '../fate/Hero';

export default class Scene extends riot.Tag {
	get name() {
		return 'scene'
	}
	get tmpl() {
		return require('./Scene.tag')
	}
	onCreate() {
		this.redsNum = 0;
		this.yellowsNum = 0;
		this.bluesNum = 0;
		this.wholeTime = 66;
		let gamingInverval = setInterval(() => {
			if (this.wholeTime <= 0) {
				scene.user.gameoverSubject.next({score: this.yellowsNum, count: this.redsNum + this.yellowsNum + this.bluesNum});
				clearInterval(gamingInverval)
				return;
			}
			this.wholeTime--;
			this.update()
		}, 1000)
		this.redPath = '../../assets/images/red-role.png';
		this.yellowPath = '../../assets/images/yellow-role.png';
		this.bluePath = '../../assets/images/blue-role.png';
		this.on('mount', this.onMount.bind(this))
		let skill2 = scene.hero.pickCard;
		skill2.pickSubject.subscribe(() => {
			switch (skill2.currCard.type) {
				case 'red':
					this.redsNum++;
					break
				case 'yellow':
					this.yellowsNum++;
					break;
				case 'blue':
					this.bluesNum++;
					break;
				default: 
			}
			this.update();
		})
	}
	onMount() {
		new Hero(this.refs['hero'])
	}
}