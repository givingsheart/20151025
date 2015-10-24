//다양한 환경에서 다르게 동작하게 외부모듈을 구성한다.
//MongoDB서버에 연결할 때 개발환경과 상용환경에서 아마도 다른 연결 문자열을 사용하기 때문
//이 파일에서 모아서 관리한다.

//세션 모듈은 현재 사용자를 식별하기 위해 서명된 식별자를 쿠키에 저장한다. 세션 식별자를 서명하기 위해 비밀문자열을 사용한다.
//악성 세션위조를 방지한다.
module.exports = {
	//개발 구성 옵션으로 현재는 CommonJS 모듈 초기화 뿐
	db: 'mongodb://localhost/mean-book',
	sessionSecret : 'developmentSessionSecret',
	facebook : {
		clientID : '934524183286742',
		clientSecret : '8f14c6f09a1cb314779a9ae26a7b6715',
		callbackURL : 'http://localhost:3000/oauth/facebook/callback'
	}
};