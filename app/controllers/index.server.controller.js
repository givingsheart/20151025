//컨트롤러의 역할대로 모델과 뷰를 제어한다.

exports.render = function(req, res) {
	//세션 사용
	if(req.session.lastVisit) {
		console.log(req.session.lastVisit);
	}

	req.session.lastVisit = new Date();
	//res.send('Hello World');
	//render(템플릿 이름, json 데이터 ) 
	res.render('index', {
		title: 'Hello World',
		userFullName: req.user ? req.user.fullNam : ''
	});
	//console.log(req.session.lastVisit);
};