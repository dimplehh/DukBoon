const http = require('http');//http요청
const url = require('url');//url요청

http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);//첫번째인자로 url,두번째인자로 boolean(true:객체,false:문자열)
  const pathName=urlObj.pathname;//명령프롬프트에 pathname나오게 됨
  console.log(urlObj);
  if(pathName=='/'){
    if (urlObj.search===null){
      res.writeHead(200,{'Content-Type':'text/html'});
      res.write(`
      <html>
      <head>
        <meta charset="utf-8">
        <title>GET/POST 메소드 실험</title>
      </head>
      <body>
        <form action="/get" method="get">
          <label for="text"> 텍스트 </label>
          <input type="text" id="text" name="text">
          <input type="submit" value="GET">
        </form>
        <form action="/post" method="post">
          <label for="text"> 텍스트 </label>
          <input type="text" id="text" name="text">
          <input type="submit" value="POST">
        </form>
      </body>
      </html>
      `);
      res.end();
    }
  }else if (pathName==='/get'){
    res.writeHead(200,{'Content-Type':'text/html'});
      res.write(`
      <html>
      <head>
        <meta charset="utf-8">
        <title>GET/POST 메소드 실험</title>
      </head>
      <body>
        <h1>GET!</h1>
        <p>URL을 확인해 보세요.</p>
      </body>
      </html>
      `);
      res.end();//res.end잊지말기.get 쓸 때는 text내용까지 나옴
  }else if (pathName==='/post'){
    res.writeHead(200,{'Content-Type':'text/html'});
      res.write(`
      <html>
      <head>
        <meta charset="utf-8">
        <title>GET/POST 메소드 실험</title>
      </head>
      <body>
        <h1>POST!</h1>
        <p>URL을 확인해 보세요.</p>
      </body>
      </html>
      `);
      res.end();//res.end잊지말기 post쓸때는 form데이터에서만 내용 나옴
  }
}).listen(3000);//3000번포트로