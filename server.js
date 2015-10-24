//노드 애플리케이션의 주파일이며, 익스프레스 애플리케이션을 부트스트랩하기 위한 express.js파일을 모듈로 올림
//라우터&컨트롤러가 초기화된 익스프레스 모듈 객체 로드
//개발용 설정 - morgan(요청 로그) 사용 . production이면 compress 사용

//운영체제에 NODE_ENV 환경변수 설정

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//다른 구성에 앞서 몽구스 구성 파일을 가장 먼저 올리는건 중요한 관례다. 왜냐하면 다른 모듈이 직접 require(model) 안하고 바로 model을 사용할수 있음으로
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();


app.listen(3000);
//node server 로서 모듈을 실행시키기 위해서
module.exports = app;

console.log('서버동작중 http://localhost:3000/');

//애플리케이션 실행에 앞서 운영체제에 NODE_ENV 환경변수를 설정한다.
// set NODE_ENV = development
//유닉스에선 export NODE_ENV = development
