
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.render('user/index.html', {
    userName: '杰洛特',
  });
});

router.get('/detail', function (req, res) {
  res.render('user/detail.html', {
    userData: '我是一个猎魔人，来自于利维亚',
  });
});

module.exports = router;
