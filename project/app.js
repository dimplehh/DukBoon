const express=require('express');
const app=express();
const router=express.Router();
const PORT=3000;
const fs=require('fs');
const template=require('./lib/template');

app.post('*',express.urlencoded({extended:false}));
app.use(express.static('public'));//정적 파일들을 가져오는 basic repository

app.get('*',(req,res,next)=>{//미들웨어:요청,응답 객체에 접근 가능한 함수.
    fs.readdir('./data',(err,files)=>{ 
        if(err) throw err;
        req.list=files;
        next();
    });
});

app.use('/',router);

router.get('/',(req,res)=>{
    const login='';

    const title="Index Page";
    const content="메인 페이지입니다.";
    const list=template.list(req.list);
    const create=template.create();
    const html=template.html(title,content,
        list,create,login);

    res.status(200).send(html);
});

router.get('/article/create',(req,res)=>{//article/name위에 써야함.
    const login='';
    const title="Create";
    const content=
    `
    <form action="/article/create" method="post">
    <p>
        <input type="text" name="title" placeholder="title">
    </p>
    <p>
        <textarea name="content"></textarea>
    </p>
    <input type="submit" value="글쓰기">
    </form>
    `;
    const list=template.list(req.list);
    const create=template.create();
    const html=template.html(title,content,
        list,create,login);

    res.status(200).send(html);
});

router.post('/article/create',(req,res)=>{
    const title=req.body.title;
    const content=req.body.content;
    fs.writeFile(`./data/${title}.txt`,content,'utf8',()=>{
        res.redirect(302,`/article/${title}`);
    });
});

router.get('/article/update/:name',(req,res)=>{
    fs.readFile(`./data/${req.params.name}.txt`,'utf8',(err,data)=>{
        if (err) throw err;
        const title=`Update - ${req.params.name}`;
        const content=
        `
        <form action="/article/update" method="post">
            <p>
                <input type="hidden" name="origin_title" value="${req.params.name}">
                <input type="text" name="title" placeholder="title"
                value="${req.params.name}">
            </p>
            <p>
            <textarea name="content">${data}</textarea>
         </p>
            <input type="submit" value="수정하기">
        </form> 
        `;
        const login='';
        const list=template.list(req.list);
        const create=template.create();
        const updateDelete=template.updateDelete(req.params.name);
        const html=template.html(title,content,
            list,`${create}${updateDelete}`,login);
        res.status(200).send(html);
    })
});

router.post('/article/update',(req,res)=>{
    const origin_title=req.body.origin_title;
    const title=req.body.title;
    const content=req.body.content;
    fs.rename(`./data/${origin_title}.txt`,`./data/${title}.txt`,()=>{
        fs.writeFile(`./data/${title}.txt`,content,'utf8',()=>{
            res.redirect(302,`/article/${title}`);
        });
    });
});

router.get('/article/:name',(req,res,next)=>{ //:name:req.params.name이라는 뜻
    fs.readFile(`./data/${req.params.name}.txt`,(err,data)=>{
        if (err) throw err;
        const login = '';
        const title=req.params.name;
        const content=data;
        const list=template.list(req.list);//함수를 다 빼놓을 수 있음.
        const create=template.create();
        const updateDelete=template.updateDelete(title);
        const html=template.html(title,content,list,
            `${create}${updateDelete}`,login);
        res.status(200).send(html);
    });
});

router.post('/article/delete',(req,res)=>{
    const title=req.body.title;
    fs.unlink(`./data/${title}.txt`,()=>{
        res.redirect(302,'/');//홈으로 돌아가기.
    });
});

app.listen(PORT,()=>console.log('node on 3000'));
