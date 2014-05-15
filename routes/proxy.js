var express = require('express');
var crypto = require('crypto');
var base64_encode = require('base64').encode;
var Buffer=require('buffer').Buffer;
var Client = require('node-rest-client').Client;
var param = require('node-jquery-param');
var extend = require('extend-object');
var url = require('url');
var util = require('util');

var client = new Client();
var router = express.Router();
var remote = 'http://111.207.166.195/gg/'

router.get('/',function(req,res){

  console.log(req.query);

  var params = {
     'nonce':1,
     'from':'yintai',
     'ts':parseInt(new Date().getTime()/1000),
     'data':JSON.stringify(req.query)
  };

  extend(params,{
    'sign':sign(params)
  });

  console.log(params);

  // 请求参数
  var args = {
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    data: param(params)
  };

  //请求地址
  var path = util.format('%s%s',remote,url.parse(req.originalUrl).pathname.replace('/proxy/',''));

  console.log('请求地址:'+path);
  console.log(args);

  // 请求远程
  client.post(path,args,function(data,response){
    res.send(data);
  }).on('error',function(err){
    res.send(err);
  });
});

function sign(params){
  var temp= [];

  for(var key in params){
    temp.push(params[key])
  }

  temp.sort();

  var rawString = temp.join('');
  return encode(rawString);
}


function encode(input){
  var shasum = crypto.createHmac('sha1','yintaitest');
  return shasum.update(input).digest('base64');
}

module.exports=router;
