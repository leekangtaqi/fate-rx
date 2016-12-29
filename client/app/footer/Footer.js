import * as riot from 'riot';
import Rx from 'rxjs/Rx';

export default class Footer extends riot.Tag {
	get name() {
		return 'footer'
	}
	get tmpl() {
		return require('./Footer.tag')
	}
	onCreate() {
		let hero = scene.hero
		let skill2 = scene.hero.pickCard;
		skill2.pickingSubject.subscribe(() => {
			clearInterval(this.intervalId);
			this.intervalId = null;
			this.startTime = (new Date()).getTime();
			this.renderSkill2();
		})
		skill2.pickSubject.subscribe(() => {
			console.warn("pick .......");
		})
		skill2.endSubject.subscribe(() => {
			this.renderSkill2(true);
		})
		skill2.pickEndSubject.subscribe(() => { 
			this.endTime = (new Date()).getTime();
			this.spendTime = this.endTime - this.startTime;
			this.spendRate = Math.floor((this.spendTime / skill2.cdTime).toFixed(2) * 100);
			this.intervalId = setInterval(() => {
				if (this.spendRate >= 100) {
					clearInterval(this.intervalId);
					this.intervalId = null;
					return;
				}
				this.spendRate++;
				this.update();
			}, 60)
			this.skill2.isCD = true;
			this.update();
		})
	}

	renderSkill2(isDefault) {
		let hero = scene.hero
		let skill2 = scene.hero.pickCard;
		let img = null;
		if (isDefault) {
			img = 'default';
		}
		else {
			switch (skill2.currCard.type) {
				case 'yellow':
					img = 'yellow'; break;
				case 'red': 
					img = 'red'; break;
				case 'blue':
					img = 'blue'; break;
				default:
					img = 'default'; break;
			}
		}
		
		this.skill2 = {
			isCD: false,
			img: '../../assets/images/' + img + '-skill.png'
		}
		this.update();
	}
}