const express=require('express');
const router=express.Router();
const fs=require('fs');
const template = require('../lib/template');
const sanitizeHtml=require('sanitize-html');
const getConnection = require('../lib/db');
const { title } = require('process');


router.get('/create',(req,res)=>{//article/name위에 써야함.
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

router.post('/create',(req,res)=>{
    const title=sanitizeHtml(req.body.title);
    const content=sanitizeHtml(req.body.content,{
        allowedTags:['em','strong','h1']
    });
    fs.writeFile(`./data/${title}.txt`,content,'utf8',()=>{
        res.redirect(302,`/article/${title}`);
    });
});

router.get('/update/:name',(req,res)=>{
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

router.post('/update',(req,res)=>{
    const origin_title=req.body.origin_title;
    const title=sanitizeHtml(req.body.title);
    const content=sanitizeHtml(req.body.content,{
        allowedTags:['em','strong','h1']//스크립트 태그 중 이것들만 살려둠.
    });
    fs.rename(`./data/${origin_title}.txt`,`./data/${title}.txt`,()=>{
        fs.writeFile(`./data/${title}.txt`,content,'utf8',()=>{
            res.redirect(302,`/article/${title}`);
        });
    });
});

router.post('/delete',(req,res)=>{
    const title=req.body.title;
    fs.unlink(`./data/${title}.txt`,()=>{
        res.redirect(302,'/');//홈으로 돌아가기.
    });
});

router.get('/:id',(req,res,next)=>{ //:name:req.params.name이라는 뜻
    //fs.readFile(`./data/${req.params.id}.txt`,(err,data)=>{
      //  if (err) throw err;
  //  });
  getConnection(conn=>{
      conn.query('SELECT id,title,content FROM article WHERE id=?',
      [req.params.id],(err,results)=>{
        if(err)
            next(err);
        
        console.log(results);
        const login = '';
        const title=results[0].title;
        const content=results[0].content;
        const list=template.list(req.list);//함수를 다 빼놓을 수 있음.
        const create=template.create();
        const updateDelete=template.updateDelete(title);

        const html=template.html(title,content,list,
            `${create}${updateDelete}`,login);
        res.status(200).send(html);
      });
    });
});

module.exports=router;