
const express = require('express');
const mainRouter = require('./main');
const userRouter = require('./user');

const router = express.Router();

router.use('/', mainRouter);
router.use('/user', userRouter);

// 处理 404 的情况，在未匹配到任何路由的情况下，将会进入这个中间件
router.use(function (req, res) {
  res.send('404 not found');
});

module.exports = router;
