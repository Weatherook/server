const express = require('express');
const router = express.Router();
const get = require('../../module/get.js');
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.get('/', async function(req, res){
    let token = req.headers.token;
    if(!token){
        res.status(400).send({
            message : "null token"
        });
    }
    let decoded = jwt.verify(token);
    let checkBoardResult;
        //decoding 실패시
        if(decoded == -1){
            res.status(500).send({
                message : "Token Error"
            });
        }
        else{
            let user_idx = decoded.user_idx;
            let checkBoardQuery = 'SELECT * FROM user WHERE user_idx = ?'; 
            checkBoardResult = await db.queryParam_Arr(checkBoardQuery, [user_idx]);

            if(!checkBoardResult){ // 쿼리 에러
                res.status(400).send({
                    message : "wrong user"
                });
            }
        }
    //지역
    let x=62;
    let y=126;
    //날짜
    let date_type=2;
    if(!x || !y || !date_type){
        res.status(400).send({
            message : "null value"
        });
        return;
    }
    let current_weather;
    let current_temp;
    let current_pop;
    let current_reh; 
    if(date_type==2){ //현재날씨 일때 날씨, 온도, 강수확률, 습도
        let weather= await get.http_gets(x,y);
        current_weather=weather[0].wfKor[0];
        current_temp=parseInt(weather[0].temp);
        current_pop=parseInt(weather[0].pop);
        current_reh=parseInt(weather[0].reh);   
    }
    let loc_type; 
    await get.type_get(x,y).then(num=>{loc_type=num});//지역 type
    console.log(loc_type);
    let checkweatherQuery = "SELECT * FROM weather WHERE date_type= ? and loc_type= ?"; 
    let checkweatherResult = await db.queryParam_Arr(checkweatherQuery, [date_type, loc_type]);
    
    if(!checkweatherResult){ //쿼리 오류
        res.status(500).send({
            message : "Internal Server Error"
        }); 
    }
    else{
        let data_res = {
            user_img :checkBoardResult[0].user_img,
            date_type:date_type,
            current_weather:current_weather,
            current_temp:current_temp,
            current_pop:current_pop,
            current_reh:current_reh,
            temp_am:checkweatherResult[0].temp_min,
            temp_af:checkweatherResult[0].temp_max,
            weather_af:await get.weather_get(checkweatherResult[0].weather_af,0,1),
            weather_am:await get.weather_get(checkweatherResult[0].weather_am,0,1)
        }
        res.status(201).send({
            message:"successfully get weather",
            data : data_res
        });
    }
});

module.exports=router;