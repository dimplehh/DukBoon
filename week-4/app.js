const express = require('express');
const app = express();//app에 express담기(서버역할을 하는 application이 됨)
const pagesRouter=require('./router');
const port = 3000;

app.use('/pages',pagesRouter);//특정 경로에 미들웨어 함수(라우터)를 등록하는 함수.

app.get('/', (req, res) => {//경로를 string으로 받고 요청 들어오면 아래 콜백함수 실행.
  res.send('Hello World!');//루트 경로로 들어오는 get요청에 문자열을 보내 응답.
});

app.listen(port, () => {//listen에서 포트번호 들어가고 콜백함수 실행됨.
  console.log(`Node on ${port}`);//PORT번호로 리스닝 성공했을 때 콜백함수 실행함(생략가능).
});

