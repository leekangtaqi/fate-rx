import * as riot from 'riot';

export default class MyForm extends riot.Tag {
	get name() {
		return 'my-form'
	}
	get tmpl() {
		return require('./Form.tag')
	}
	onCreate() {
		$.get('/user').then(data => {
			this.list = data;
			this.update();
    }).catch(e => {
			console.warn(e);
    })
	}
	async onSubmit() {
		let username = this.refs['username'].value.trim()

		if (!username) {
			return;
		}

		let user = await $.post('/user', {username, score: this.opts.score || 0, count: this.opts.count || 0});
		let unrefinedList = this.list.concat([{name: username, score: this.opts.score}]);
		unrefinedList.sort((a, b) => {
			return b.score - a.score
		})
		this.list = unrefinedList.slice(0, 5)
		this.submitted = true;
		this.update();
	}
	onRestart() {
		window.location.reload();
	}
}