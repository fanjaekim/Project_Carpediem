var express = require('express');
var models = require("../models")
var crypto = require("crypto");
var sequelize = require("sequelize");
var router = express.Router();

const Op = sequelize.Op;

async function update_make_result_list(qry, hie_qry, i){
  let before_rank = qry.rows[i].Ranking;

  if(qry.rows[i].Ranking <= 2){ //간부직들 목숨 무한
    qry.rows[i].Life = 999;
    qry.rows[i].save({fields : ['Life']});
  }
  else{ //길드원 직책 설정
    if(qry.rows[i].Name === qry.rows[i].Tag){ //본캐
      qry.rows[i].Ranking = 3;
      qry.rows[i].save({fields : ['Ranking']});
    }
    else{ //부캐
      qry.rows[i].Ranking = 4;
      qry.rows[i].save({fields : ['Ranking']});
    }
  }

  //강등
  if(qry.rows[i].Life <= 0){
    qry.rows[i].Ranking = 5;
    qry.rows[i].save({fields : ['Ranking']});
  }

  //변한 인원만 저장
  let now_name = qry.rows[i].Name;
  let now_r = qry.rows[i].Ranking;

  console.log(now_name + " and " + now_r);

  if(qry.rows[i].Ranking != before_rank){ //계급 변동 발생
    let res_qry = await models.result_list.create(
      {Name : now_name, Hierarchy : hie_qry.rows[now_r - 1].Hierarchy})
      .then().catch(err => {console.log("Error to insert for" + qry.rows[i].Name)});
  }

  return qry;
}

async function cycleFn(mainID, subID){
    console.log("Main : " + mainID);
    console.log("Sub : " + subID);
    let update_qry = await models.manage_list.findOne({
      where : {Name : subID}
    });
    if(update_qry == undefined) return undefined;
    update_qry.Tag = mainID;
    update_qry.save({fields : ['Tag']});
    return update_qry;
}

async function update_manage_list_Fn_1(inputLife, inputName){
  console.log("inputLife : " + inputLife);
  console.log("inputName : " + inputName);

  //Name 혹은 Tag에 해당하는 모든 인원의 수명을 업데이트
  let update_qry = await models.manage_list.findAndCountAll({
    where : { [Op.or]: [{Name : inputName}, {Tag : inputName}] }
  });
  if(update_qry == undefined) return undefined;

  for(let i=0; i<update_qry.count; i++){
    update_qry.rows[i].Life = inputLife;
    update_qry.rows[i].save({fields : ['Life']});
  }
  return update_qry;
}

async function update_manage_list_Fn_2(){
  console.log("Last update");

  //매번 갱신을 위한 삭제. 1주일 텀을 둬야한다면 수정
  let destroy_result = await models.result_list.destroy({
    where: {},
    truncate: true
  })

  let hie_qry = await models.ranking_dict.findAndCountAll();
  let qry = await models.manage_list.findAndCountAll();
  if(qry == undefined || hie_qry == undefined) return undefined;

  console.log("Length : " + qry.count);
  for(let i=0; i<qry.count; i++){
    //console.log(qry.rows[i].Name);
    let ret = await update_make_result_list(qry, hie_qry, i);

  }
}

/* GET users listing. */

//main
router.get('/main', function(req, res, next){
  let session = req.session;

  models.result_list.findAll().then( result => {
    res.render("user/main", {
      session:session,
      posts: result
    });
  });
});

//Log Out, 세션파괴
router.get('/logout', function(req, res, next){
  req.session.destroy();
  res.clearCookie('sid');
  console.log("Session Cookie destroyed");

  res.redirect("/user/login");
});

//log_in
router.get('/login', function(req, res,next){
  let session = req.session;

  res.render("user/login", {
    session:session
  });
});

//로그인 post
router.post('/login', async function(req, res, next){
  let body = req.body;

//해당 ID를 탐색하는 query
  let result = await models.account.findOne({
    where: {
      userID : body.login_ID
    }
  });

//result 쿼리가 잘못되면 나감
  if(result == undefined){
    console.log("Wrong ID");
    res.redirect("/user/login");
    return;
  }

  console.log(result.dataValues.userID);

  let dbPassword = result.dataValues.userPW;
  let inputPassword = body.login_Password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

//해당 ID의 password가 서로 일치하면 main, 아니면 돌려보냄
  if(dbPassword === hashPassword){
    console.log("Same Password");
    req.session.userID = body.login_ID;

    res.redirect("/user/main");
  }
  else{
    console.log("Wrong Password");
    res.redirect("/user/login");
  }
});


/* 회원가입 */
//회원가입 탭으로 오면 해당 사이트 출력
router.post('/signup', function(req, res, next){
  res.render("user/signup");
});

//회원가입 탭에서 Create Account 시도 시 make액션생성되고 make 받으면 이하 시행
router.post("/make", async function(req, res, next){
  let body = req.body;
  let inputPW = body.create_Password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPW = crypto.createHash("sha512").update(inputPW + salt).digest("hex");

  let result = models.account.create({
    userID: body.create_ID,
    userPW: hashPW,
    salt: salt
  })

//로그인창으로 복귀
  res.redirect("/user/signup");
});

//데이터 입력
router.post('/main/inputlist', function(req, res, next){
  res.render("user/inputlist");
});

//Tag 입력란 진입
router.post('/main/inputtag', function(req, res, next){
  res.render("user/inputtag");
});

//Tag 입력란 다이렉트 접근 시, 있어야하나?
router.get('/main/inputtag/submit_tag', function(req, res, next){
  res.redirect("/user/main");
});

//Tag 제출 post
router.post('/main/inputtag/submit_tag', async function(req, res, next){
  let body = req.body;
  console.log(body.main_nick);
  console.log(body.sub_nick);

  //본캐 유효성 검사
  let find_main = await models.manage_list.findOne({
    where: {
      Name : body.main_nick
    }
  });

  //없으면 돌려보냄
  if(find_main == undefined){
    console.log("There is no Main Nickname!");
    res.redirect("/user/main");
    return;
  }

  //본캐 유효하면 Parsing
  console.log("Next step parse!");

  let sub_nick_parse = body.sub_nick.replace( /\r\n/g, " ").split(" "); //문자열 파싱

  for(let i = 0; i < sub_nick_parse.length; i++){
    let ret = await cycleFn(body.main_nick, sub_nick_parse[i]);
    if(ret == undefined)
      console.log("Failed Update");
  }

  res.redirect("/user/main");
});

//수로, 플래그 인원 제출 시
router.post('/main/inputlist/submit_list', async function(req, res, next){
  let body = req.body;
  console.log(body.life);
  console.log(body.list);

  console.log("Next step parse!");

  let list_parse = body.list.replace( /\r\n/g, " ").split(" "); //문자열 파싱

  for(let i = 0; i < list_parse.length; i++){
    let ret = await update_manage_list_Fn_1(body.life, list_parse[i]);
    if(ret == undefined){
      console.log("Failed result Update for " + list_parse[i]);
    }
  }

  let ret = await update_manage_list_Fn_2();

  res.redirect("/user/main");
});

module.exports = router;
