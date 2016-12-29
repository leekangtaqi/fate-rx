import scoreControllerCreator from './user.controller';

export default function dispatcherCreator(app) {
		// app.use('/scroe', scoreControllerCreator);	
		console.warn(app);
		app.use('/scroe', () => {
			throw new Error('!!!!!')
			// console.warn("dfjkfosjfodsjfiosjfoids");
		});	
}