//몽고 디비 연결의 캡슐화 (모듈화)
var config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	var db = mongoose.connect(config.db);
	//몽구스 이용해 모델스키마 초기화
	require('../app/models/user.server.model');
	return db;
};