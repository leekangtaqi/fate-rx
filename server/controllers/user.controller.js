import User from '../models/User';
var express = require('express');
var router = express.Router();

class UserController {
	async find(req, res) {
		let users = await User.find().sort({"score": -1}).limit(5).exec()
		res.json(users)
		return;
	}

	async post(req, res) {
		try {
			let { username, score, count } = req.body
			let user = new User({name: username, score, count});
			await user.save();
			res.status(200).json(user);
		} catch (e) {
			console.warn(e);
			res.status(500).json();
		}
		
	}
}

let user = new UserController();

router.get('/', user.find);
router.post('/', user.post);

export default router;