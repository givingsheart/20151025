//익스프레스 애플리케이션을 구성하는 파일  개발용 vs 배포용 env폴더에서 설정을 읽어온다.
module.exports = require('./env/' + process.env.NODE_ENV + '.js');