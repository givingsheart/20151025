var passport = require('passport'),
	mongoose = require('mongoose');

module.exports = function() {
	var User = mongoose.model('User');
	//패스포트가 사용자 직렬화를 다루는 방식을 정의함
	//패스포트는 세션에 _id속성을 저장할 것이다 
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	//몽구스가 password와 salt 속성을 가져오지 않게 보증하기 위해 필드 옵션을 사용
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-password -salt', function(err, user) {
			done(err, user);
		});
	});

	//지역 인증 전략 수행
	require('./strategies/local.js')();
	//페이스북 인등
	require('./strategies/facebook.js')();
}