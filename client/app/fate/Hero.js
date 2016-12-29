import * as riot from 'riot';

export default class Hero extends riot.Tag {
	get name() {
		return 'hero'
	}
	get tmpl() {
		return require('./Hero.tag')
	}
	onCreate() {
		let hero = scene.hero
		let skill2 = scene.hero.pickCard;
		skill2.pickingSubject.subscribe(() => {
			this.renderSkill2();
		})
		skill2.pickSubject.subscribe(() => {
			console.warn("pick .......");
		})
		skill2.endSubject.subscribe(() => {
			this.renderSkill2(true);
		})
	}

	renderSkill2(isDefault) {
		let hero = scene.hero
		let skill = hero.pickCard;
		let img = null;
		
		if (isDefault) {
			this.update({skill: null})
			return;
		}	else {
			switch (skill.currCard.type) {
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
		img = '../../assets/images/' + img + '-role.png'
		this.skill = {
			img
		}
		this.update();
	}
}