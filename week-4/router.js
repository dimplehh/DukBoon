const express = require('express');
const router = express.Router();//app과 사용하는 method비슷.

router.get('/:id', (req, res) => {//req:쿼리스트링,바디,헤더 등을 받음.
  console.log(`${req.params.id}`);//1,2,3과 같은 숫자 콘솔창에 출력함.
});//req.params=:id 부분이 들어감(1,2,3 등등..)

module.exports = router;