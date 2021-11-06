
const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.render('index.html', {
    welcome: 'hello world',
  });
});

module.exports = router;
