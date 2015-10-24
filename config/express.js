//익스프레스 애플리케이션을 초기화 하는 파일
var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport');
//몽고디비 사용 
//config/env/development.js, config/mongoose.js 에 정의
//var uri = 'mongodb://localhost/mean-book', 
//	db = require('mongoose').connect(uri);

module.exports = function() {
	var app = express();
	//익스프레스 앱에 라우터를 초기화&세팅한다.
	//app.get('/', index.render)
	if(process.env.NODE_ENV === 'developement') {
		app.use(morgan('dev'));
	} else if(process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	//세션사용 -> 테스트 위해서 index.server.controller.js에서 사용
	app.use(session({
		saveUninitalized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	//인증 과정 오류 메세지 사용자에게 전달용 flash
	app.use(flash());
	//패스포트
	app.use(passport.initialize()); //패스포트 부트스트래핑
	app.use(passport.session()); //사용자 세션을 추적하기 위해 익스프레스 세션사용

	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);

	app.use(express.static('./public'));

	return app;
};