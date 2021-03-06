var express = require('express');
var router = express.Router();

router.use('/', require('./weather.js'));
router.use('/comment', require('./comment.js'));
router.use('/list', require('./list.js'));
router.use('/web', require('./web.js'));


module.exports = router;