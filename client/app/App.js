import * as riot from 'riot';
import Scene from './scene/Scene';
import Footer from './footer/Footer';
import MyForm from './form/form';
import Rx from 'rxjs/Rx';

export default class App extends riot.Tag {
	get name() {
		return 'app'
	}

	get tmpl() {
		return require('./App.tag');
	}

	get attrs() {
		return 'class="{ className }"'
	}

	get css() {
		return 'my-tag p{ color: blue; }'
	}

	onCreate(opts) {
		this.on('mount', this.onMounted)
		this.message = opts.message
		let hero = scene.user
		hero.gameoverSubject.subscribe(({ score, count }) => {
			new MyForm(this.refs['my-form'], {score, count})
		})
	}

	onMounted() {
		new Scene(this.refs['scene'])
		new Footer(this.refs['footer'])
		
	}

	click() {
		this.message = 'goodbye'
	}
}