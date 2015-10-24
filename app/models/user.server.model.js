var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;
//구성변경자 trim, default.. 설정변경자 인출변경자 정적/인스턴스 메소드
//모델검증 validate require : true, match: /.+\@.+\..+/
// 모델 검증용 pre 로그용 post미들웨어 , 몽구스 DBRef
var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		index: true,
		//match: /.+\@.+\..+/
		match: [/.+\@.+\..+/ , 'Please fill a valid e-mail adress']
	},
	username: {
		type: String,
		trim: true,
		unique: true,
		//required: true
		required: 'Username is required'
	},
	password: {
		type: String,
		validate: [
		function(password) {
			return password.length >= 6;
		},
		'Password should be longer'
		]
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerId: String,
	providerData: {},
	created: {
		type: Date,
		default: Date.now
	},
	role: {
		type: String,
		enum: ['Admin', 'Owner', 'User']
	}
});

//가상 
UserSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

//모델 검증용 몽구스 미들웨어 
UserSchema.pre('save', function(next) {
	if(this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),
								'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

//인스턴스 메소드
UserSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

//정적 메소드
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	//요 아래거.. 자바스크립트 머시기 땜에 그런데..
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if(!err) {
			if(!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

//이건..
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

mongoose.model('User', UserSchema);

//맞춤식 설정 변경자
/*
var UserSchema = new Schema({
	...
	website: {
	type: String,
	set: function(url) {
		if(!url) {
			return url;
		} else {
			if(url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
				url = 'http://' + url;
			}

			return url;
		}
	}
	},
	...
});

*/
//맞춤식 인출 변경자
/*
var UserSchema = new Schema({
	...
	website: {
	type: String,
	get: function(url) {
		if(!url) {
			return url;
		} else {
			if(url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
				url = 'http://' + url;
			}

			return url;
		}
	}
	},
	...
});


UserSchema.set('toJSON', {getters: true});

몽구스가 MongoDB다큐먼트를 JSON표현으로 변환할때 인출자를 포함하게 강제하며 res.json()을
사용한 다큐먼트 출력결과가 인출자의 동작방식을 포함하게 만들것이다.

가상속성추가
UserSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

색인사용 통한 질의 최적화  = unique=true, 부색인 index=true

var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		index: true
	},
	username: {
		type: String,
		trim: true,
		unique: true
	},
	password: String,
	created: {
		type: Date,
		default: Date.now
	}
});


맞춤식 모델 메소드 정의 
username으로 사용자 검색을 원한다고 가정할때, 이메소드를 컨트롤러에 정의할 수도 있지만 
이곳보다는 모델의 정적 메소드로 추가하는게 올바른 위치이다. 스키마의 statics속성의 일원
으로 선언할 필요가 있다

UserSchema.statics.findOneByUsername = function( username, callback) {
	this.findOne({username: new RegExp(username, 'i')}, callback);
};

사용시에는 User.findOneByUsername('username', function(err, user){
	...
});

인스턴스 메소드 (ex)인증 = 객체마다 패스워드가 다르기때문에
UserSchema.methods.autheticate = function(password) {
	return this.password === password;
}

사용시엔 user.authenticate('password');

그외에도 검증기 require, match, enum
맞춤식 검증기 validate: [function(){}, 'msg']


몽구스용 미들웨어 초기화 init, 검증 validate, 저장 save, 제거 remove
과정을 가로책수 있는 함수들로 pre와 post 미들웨어 두가지가 있다.

pre를 이용한 모델 검증 구현
UserSchema.pre('save', function(next) {
	if(...) {
		next();
	} else {
		next(new Error('An Error Occured'))
	}
});

post를 이용한 로그 남기기 구현
UserSchema.post('save', function(next) {
	if (this.isNew) {
		conosole.log('A new user was created');
	} else {
		console.log('A user updated is details');
	}
});

다른 다큐먼트 참조하기 (관계형 디비의 fk 참조)
var PostSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Post', PostSchema);

사용시에는 
var user = new User();
user.save();

var post = new Post();
post.author = user;
post.save();

DBRef는 id참조일 뿐으로 몽구스는 user인스턴스로 post 인스턴스를 채워 널어야만 한다.

Post.find().populate('author').exec(function(err, posts) {
	...
});
*/