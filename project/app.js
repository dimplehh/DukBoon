const express=require('express');
const app=express();
const PORT=3000;
const fs=require('fs');
const helmet=require('helmet');
const compression=require('compression');

const indexRouter=require('./routes/index');
const articleRouter=require('./routes/article');

const getConnection=require('./lib/db');

app.use(helmet());
app.use(compression());
app.post('*',express.urlencoded({extended:false}));
app.use(express.static('public'));//정적 파일들을 가져오는 basic repository(이미지)

app.get('*',(req,res,next)=>{//미들웨어:요청,응답 객체에 접근 가능한 함수.
    //fs.readdir('./data',(err,files)=>{ 
    //    if(err) 
    //        next(err);//미들웨어(맨 아래 미들웨어로 갑니다.)
    //    req.list=files;
    //    next();
    //});
    getConnection(function (conn) {
        conn.query('SELECT TITLE,ID FROM ARTICLE',(err,results)=>{//SQL문이랑 완전 똑같은 부분.
            if (err)
                next(err);
            req.list==results;
            console.log(results);
            next();
        });
        conn.release();
    });
});

app.use('/',indexRouter);
app.use('/article',articleRouter);

app.use((req,res,next)=>{
    res.status(404).send('Sorry! Wrong path.');//위 두개의 라우터에 해당하는 경로가 아닐 때.
});

app.use((err,req,res,next)=>{//에러 처리 미들웨어
    console.log(err.stack);
    res.status(500).send('Sorry!');
});

app.listen(PORT,()=>console.log('node on 3000'));
