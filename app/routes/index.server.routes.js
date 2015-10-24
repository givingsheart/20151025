//COMMONGJS 모듈 패턴 
module.exports = function(app) {
	//해당 컨트롤러 모듈을 찾아서
	//인덱스 라우팅 = 기본 url 
	//var index = require('C:\study\node\20151021_2\app\controllers\index.server.controller')
	var index = require('../controllers/index.server.controller');
	app.get('/', index.render);
};
