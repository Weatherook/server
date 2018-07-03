const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js'); 
const upload = require('../../config/multer.js'); 
const moment = require('moment');
const jwt = require('../../module/jwt.js'); 


//게시글 등록하기
router.post('/', upload.single('board_img'), async function(req, res){
    let token = req.headers.token;
    let user_idx = req.body.user_idx;
    let board_desc = req.body.board_desc;
    let board_temp_min = req.body.board_temp_min;
    let board_temp_max = req.body.board_temp_max;
    let board_auth = req.body.board_auth; 
    let style_type = req.body.style_type; 
    let token = req.headers.token;  

    //토큰을 decoding
    let decoded = jwt.verify(token);

    //decoding 실패시
    if(decoded == -1){
        res.status(500).send({
            message : "Token Error"
        });
    }
    //title 또는 content 의 잘못된 입력
    else if(!board_title || !board_content){
        res.status(400).send({
            message : "Null Value"
        });
    }
    //정상 수행 시
    else{
        //user 정보 확인
        let checkBoardQuery = 'SELECT * FROM user WHERE user_idx = ?'; 
        let checkBoardResult = await db.queryParam_Arr(checkBoardQuery, [user_idx]);

        if(!checkBoardResult){ // 쿼리 에러
            res.status(500).send({
                message : "Internal Server Error"
            }); 
        }
        //user 정보가 존재할 시
        else {
            user_idx = decoded.user_idx; 
            
            let board_date = moment().format('YYYY-MM-DD HH:mm:ss'); 

            //board 테이블에 게시글 정보 삽입
            let insertBoardQuery = 'INSERT INTO board (board_img, board_desc, board_temp_min, board_temp_max, board_weather, board_auth, board_date) VALUES (?, ?, ?, ?, ?, ?, ?)'; 
            let insertBoardResult = await db.queryParam_Arr(insertBoardQuery, [board_img, board_desc, board_temp_min, board_temp_max, board_weather, board_auth, board_date]); 
            
            let last_board_idx_query = 'SELECT LAST_INSERT_ID()'; 
            let last_board_idx = await db.queryParam_None(last_board_idx_query); 

            //style 테이블에 키워드 정보 삽입
            let insertStyleQuery = 'INSERT INTO style (style_type) VALUES (?)'; 
            let insertStyleResult = await db.queryParam_Arr(insertStyleQuery, [style_type]);
            
            let last_style_idx_query = 'SELECT LAST_INSERT_ID()';
            let last_style_idx = await db.queryParam_None(last_style_idx_query); 

            let insertBoardStyleQuery = 'INSERT INTO board_style (board_idx, style_idx) VALUES (?, ?)';
            let insertBoardStyleResult = await db.queryParam_Arr(insertBoardStyleQuery, [last_board_idx[0], last_style_idx[0]]); 


            if(!insertBoardResult || !insertStyleResult || !insertBoardStyleResult){ //쿼리 에러
                res.status(500).send({
                    message : "Internal Server Error"
                }); 
            }
            //정상 수행 시 
            else {
                res.status(201).send({
                    message : "Successfully register",
                    board_idx : last_board_idx[0]
                }); 
            }
        }
   }
}); 


router.get('/:board_idx', async function(req, res){
    let board_idx = req.params.board_idx; 
    
    //board_idx 게시글이 존재하는지 확인
    //board_idx 입력 오류 
    if(!board_idx){
        res.status(400).send({
            message : "Null Value"
        }); 
    }
    else {
        let selectOneBoardQuery = 'SELECT * FROM board WHERE board_idx = ?'; 
        let selectOneBoardResult = await db.queryParam_Arr(selectOneBoardQuery, [board_idx]); 
    
        //쿼리 에러
        if(!selectOneBoardResult) {
            res.status(500).send({
                message : "Internal Server Error"
            }); 
        }
        //정상 수행
        else {
            res.status(201).send({
                message : "Successfully get One board", 
                data : selectOneBoardResult[0]
            }); 
        }
    }
})

router.delete('/', async function(req, res){
    let board_idx = req.body.board_idx; 

    
})

module.exports = router;