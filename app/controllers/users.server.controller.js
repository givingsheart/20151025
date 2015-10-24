var User = require('mongoose').model('User'),
	passport = require('passport');

//외부에서 유저 컨트롤러 오듈 사용시 공개할 메소드

//20151023 인증 메서드 추가
//인증 무효처리 위해 패스포트 모듈이 req.logout()을 제공한다.
//사용자 생성에 성공하면 req.login() 메소드를 사용해 사용자 세션을 생성한다.
//로그인 연산을 완료후에 user객체는 req.user 객체에 대입된다.
//사용자에게 로그인 과정중 어떤 잘못이 있는지 전달을 위해서 휘발성 flash 객체를 쓴다.

var getErrorMessage = function(err) {
	var message = '';

	if(err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for(var errName in err.errors) {
			if(err.errors[errName].message)
				err.errors[errName].message;
		}
	}

	return message;
};


exports.renderSignin = function(req, res, next) {
	if(!req.user) {
		res.render('signin', {
			title: 'Sign-in Form',
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

exports.renderSignup = function(req, res, next) {
	if(!req.user) {
		res.render('signup', {
			title: 'Sign-up Form',
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};

exports.signup = function(req, res, next) {
	if(!req.user) {
		var user = new User(req.body);
		var message = null;

		user.provider = 'local';

		user.save(function(err) {
			if(err) {
				var message = getErrorMessage(err);

				req.flash('error', message);
				return res.redirect('/signup');
			}
			//db에 저장 성공시 인증 확인하고 세션에 저장하는 작업이 패스포트 제공 login()
			req.login(user, function(err) {
				if(err)
					return next(err);

				return res.redirect('/');
			});
		});
	} else {
		return res.redirect('/');
	}
};

exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};



//생성 
exports.create = function(req, res, next) {
	var user = new User(req.body);

	user.save(function(err) {
		if(err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};

//찾기 모두 vs 아디로
exports.list = function(req, res,next) {
	User.find({}, function(err, users) {
		if(err) {
			return next(err);
		} else {
			res.json(users);
		}
	});
};

exports.read = function(req, res) {
	res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}, function(err, user) {
		if(err) {
			return next(err);
		} else {
			req.user = user;
			next();
		}
	});
};

exports.update = function(req, res, next) {
	User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
		if(err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};

exports.delete = function(req, res, next) {
	req.user.remove(function(err) {
		if(err) {
			return next(err);
		} else {
			res.json(req.user);
		}
	})
};


//OAuth
//사용자 프로필을 받아들여 providerId와 provider속성을 포함하는 기존 사용자가
//있는지 살펴본다. 해당하는 사용자를 찾으면 사용자의 MongoDB다큐먼트를 넘기며
//done()콜백메소드를 호출한다. 찾을수 없으면 User모델의 findUniqueUsername()
//정적 메소드를 사용해 유일한 사용자명을 찾은후에 새로운 사용자 인스턴스를 저장한다.
//오류발생시 req.flash()와 getErrorMessage()메소드를 사용해 오류를 보고
exports.saveOAuthUserProfile = function(req, res, done) {
	User.findOne({
		provider : profile.provider,
		providerId : profile.providerId
	}, function(err, user) {
		if(err) {
			return done(err);
		} else {
			if(!user) {
				var possibleUsername = profile.username || (profile.email) ?
					profile.email.split('@')[0] : '';

				User.findUniqueUsername(possibleUsername, null, 
					function(availableUsername) {
						profile.username = availableUsername;

						user = new User(profile);

						user.save(function(err) {
							if(err) {
								var message = _this.getErrorMessage(err);

								req.flash('error', message);
								return res.redirect('/signup');
							}

							return done(err, user);
						});
					});
			} else {
				return done(err, user);
			}
		}
	});
};