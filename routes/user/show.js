const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//유저 개인 페이지 보여주기
router.get('/', async function(req, res){
    let token = req.headers.token; 
    let decoded = jwt.verify(token);
    if (decoded == -1){
        res.status(500).send({
            message : "Token error"
        }); 
    }
    else{ 
        let user_idx = decoded.user_idx;
        let follower
        //사용자 사진, 아이디, 소개 보여주기
        let showUserPage = 'SELECT user_img, user_id, user_desc FROM user WHERE user_idx = ? ';
        let showUserPageResult = await db.queryParam_Arr(showUserPage, [user_idx]);
        //게시물 수
        let showBoardNum = 'SELECT COUNT(board_idx) AS board_num FROM user_board WHERE user_idx=?';
        let showBoardNumResult = await db.queryParam_Arr(showBoardNum, [user_idx]);
        //팔로워 수
        let showFollowerNum = 'SELECT COUNT(user_idx) AS follwer FROM follow WHERE follower_idx=?';
        let showFollowerNumResult = await db.queryParam_Arr(showFollowerNum, [user_idx]);
        //팔로잉 수
        let showFolloingNum = 'SELECT COUNT(follower_idx) AS following FROM follow WHERE user_idx=?';
        let showFollogingNumResult = await db.queryParam_Arr(showFolloingNum, [user_idx]);

        if(!showUserPageResult){
            res.status(500).send({
                message : "Internal Server Error"
            });
        }
        else{
            res.status(201).send({
                message : "user persnoal show success",
                data: {
                    showUserPageResult,
                    showBoardNumResult,
                    showFollowerNumResult,
                    showFollogingNumResult
                }
            });
        }

    }
});

module.exports = router;