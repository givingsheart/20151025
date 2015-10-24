module.exports = {
	db: 'mongodb://localhost/mean-book-test',
	sessionSecret: 'test',
	viewEngine: 'ejs',
	facebook: {
		clientID:'934524183286742',
		clientSecret: '8f14c6f09a1cb314779a9ae26a7b6715',
		callbackURL: 'http://localhost:3000/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'TdYuIPLANVe5MChS58o30Ozd9',
		clientSecret: 'AZmBDbnkJeQN9nqkEvEcvMHq2454y0lpI7wMbnYazbhFEJGUZy',
		callbackURL: 'http://192.168.43.118:3000/oauth/twitter/callback'
	},
	google: {
		clientID: 'givingsheartapp',
		clientSecret: 'AIzaSyAJS5b-krxpOV-Fhdpyyt1HpNH5DNf2nZk',
		callbackURL: 'http://192.168.43.118:3000/oauth/google/callback' 
	}
};
