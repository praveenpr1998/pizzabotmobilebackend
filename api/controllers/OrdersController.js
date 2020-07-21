/**
 * OrdersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var accountSid = 'ACaf7acf3278a5cc699eefc2fe938b0eb3';
var authToken = '3dd5223e6ab222c7ef2c866b61f43e2d';
var twilio = require('twilio')
var client=new twilio(accountSid, authToken);
var nodemailer = require('nodemailer');
const { FeedbackContext } = require('twilio/lib/rest/api/v2010/account/call/feedback');

module.exports = {
  
    getPizza:async function(req,res){
    var pizza=await Pizza.find();
    res.json({data:pizza})
    },
    placeOrder:function(req,res){
        var orderId=""+Math.floor(Date.now() / 1000)+Math.floor(Math.random() * 101);
        Orders.create({orderId:orderId,userName:req.body.userName,userMobile:req.body.userMobile,userAddress:req.body.userAddress,items:req.body.items,orderStatus:'OrderPlaced',totalAmount:req.body.totalAmount}).fetch().exec(function(err,data){
            if(err){
                res.json({status:false})
            }
            else{
                client.messages.create({
                    body: 'Your Order hase been Placed.Order ID:'+data.orderId+'TotalAmount: '+data.totalAmount,
                     from: '+18329246041',
                      to: '+91'+req.body.userMobile
                    }).then(message => console.log(message));
                res.json({status:true,orderId:orderId})
            }
        })
    },
    trackOrder:async function(req,res){
        Orders.findOne({orderId:req.body.orderId},function(err,data){
            if(err){
                res.json({status:false})
            }
            else{
                res.json({status:true,data:data})
            }
        })
    },
    query:function(req,res){
        Query.create({userDetail:req.body.email,Query:req.body.query}).fetch().exec((err,data)=>{
            if(err){
                res.json({status:false});
            }
            else{
                res.json({status:true})
            }
        })
    },
    feedback:function(req,res){
        Feedback.create({userName:req.body.userName,userMobile:req.body.userMobile,Feedback:req.body.feedback}).fetch().exec((err,data)=>{
            if(err){
                res.json({status:false})
            }
            else{
                res.json({status:true})
            }
        })
    }

};

