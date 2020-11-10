const http= require('http');
const port = 3000;

http.createServer((req, res) => {//경로를 string으로 받고 요청 들어오면 아래 콜백함수 실행.
  res.write('Hello World!');
  res.end();
})

.listen(port, () => {//listen에서 포트번호 들어가고 콜백함수 실행됨.
  console.log(`Node.js on ${port}`);
});
