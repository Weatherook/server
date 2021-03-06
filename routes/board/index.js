var express = require('express');
var router = express.Router();


router.use('/follow', require('./follow.js'));
router.use('/', require('./board.js'));
router.use('/commend', require('./commend.js'));
router.use('/like', require('./like.js'));
router.use('/comment', require('./comment.js'));
router.use('/filter', require('./filter.js'));

router.use('/today', require('./today/index.js')); 

module.exports = router; 