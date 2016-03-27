var express = require('express');
var http=require('http');
var request=require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




var mongoose = require('mongoose');
var passport = require('passport');

var ejwt = require('express-jwt');


var Post = require('../models/Posts');
var Comment = require('../models/Comments');
var User = require('../models/Users');
var Item = require('../models/Users');
var Preference=require('../models/PaymentPreference');
var CustomerDocuments=require('../models/CustomerDocuments');
var ShareDocuments=require('../models/ShareDocuments');
var CustomerOrderDetails=require('../models/CustomerOrderDetails');
var Merchants=require('../models/Merchants');

var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var util = require('./util')


var auth = ejwt({secret: 'SECRET', userProperty: 'payload'});





//var Post = mongoose.model('Post');
//var Comment = mongoose.model('Comment');

router.post('/register', function(req, res, next){
             console.log(req.body)
            if(!req.body.username || !req.body.password){
            return res.status(400).json({message: 'Please fill out all fields'});
            }
            
            
            var user = new User();
            
            user.username = req.body.username;
             user.merchantName = req.body.merchantName;
              user.mobileNumber = req.body.mobileNumber;
            
            util.setPassword(user, req.body.password)
            
            user.merchantId =  Math.floor(Math.random()*900000) + 100000; 

           
           
            user.save(function (err){
                      if(err){ console.log(err); return next(err); }
                      
                      return res.json({token: util.generateJWT(user)})
                      });
});

router.post('/login', function(req, res, next){
            if(!req.body.username || !req.body.password){
            return res.status(400).json({message: 'Please fill out all fields'});
            }
            
            passport.authenticate('local', function(err, user, info){
                                  if(err){ return next(err); }
                                  
                                  if(user){
                                  return res.json({token: util.generateJWT(user)});
                                  } else {
                                  return res.status(401).json(info);
                                  }
                                  })(req, res, next);
});

router.get('/posts', auth, function(req, res, next) {
           User.findById(req.payload._id, function (err, user){
                       if (err) { return next(err); }
                       if (!user) { return next(new Error('can\'t find post')); }
                         Preference.find({ merchantId: user.merchantId }, function (err, data){
                                if (err) { return next(err); }
                                 var responseData = {data : data , merchantId : user.merchantId }
                            return res.json(data);
        
                   });
                      
                       });
});

router.post('/posts', auth, function(req, res, next) {
            
           User.findById(req.payload._id, function (err, user){
                       if (err) { return next(err); }
                       if (!user) { return next(new Error('can\'t find post')); }
                         Preference.remove({ merchantId: user.merchantId }, function (err, data){
                                if (err) { return next(err); }

                          var perfernce  =  new Preference ();
                          perfernce.paymentMethods = req.body.paymentMethods;
                          perfernce.merchantId =  user.merchantId;
                          perfernce.save(function(err) {
                            if (err) {
                              return next(err);
                            }

                            return res.json(req.body.paymentMethods);
        
                         });

                         });
                      
                       });
            });

router.param('post', function(req, res, next, id) {
//            var query = Post.findById(id);
            
             console.log("Post ID: " + id);
            Post.findById(id, function (err, post){
                       if (err) { return next(err); }
                       if (!post) { return next(new Error('can\'t find post')); }
                       
                       console.log("Post Title: " + post.title);
                       req.post = post;
                       return next();
                       });
            });

router.get('/posts/:post', function(req, res) {
           req.post.populate('comments', function(err, post) {
                             if (err) { return next(err); }
                             
                             res.json(post);
                             });
           });

router.put('/posts/:post/upvote', auth, function(req, res, next) {
           
           console.log("Before upvotes: " + req.post.upvotes);
           
           req.post.upvotes += 1;
           
           console.log("After upvotes: " + req.post.upvotes);
           
           
           req.post.save(function(err, post){
                         if (err) { return next(err); }
                         
                         res.json(post);
                         });
           
           /*Post.update(req.post, function(err, post){
                       if(err){ return next(err); }
                       
                       res.json(post);
                       });*/

           
           
           /*req.post.upvote(function(err, post){
                           if (err) { return next(err); }
                           
                           res.json(post);
                           });*/
           });

router.post('/posts/:post/comments', auth, function(req, res, next) {
            var comment = new Comment(req.body);
            comment.post = req.post;
            comment.author = req.payload.username;
            comment.save(function(err, comment){
                         if(err){ return next(err); }
                         
                         req.post.comments.push(comment);
                         req.post.save(function(err, post) {
                                       if(err){ return next(err); }
                                       
                                       res.json(comment);
                                       });
                         });
            });

router.param('comment', function(req, res, next, id) {
             //            var query = Post.findById(id);
             
             Comment.findById(id, function (err, comment){
                           if (err) { return next(err); }
                           if (!comment) { return next(new Error('can\'t find post')); }
                           
                           req.comment = comment;
                           return next();
                           });
             });



router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
           
           //console.log("comment upvotes: " + req.comment.upvotes);
           
           req.comment.upvotes += 1;
           
           //console.log("comment upvotes: " + req.comment.upvotes);
           
           
           req.comment.save(function(err, comment){
                         if (err) { return next(err); }
                         
                         res.json(comment);
                         });
           
           /*Post.update(req.post, function(err, post){
            if(err){ return next(err); }
            
            res.json(post);
            });*/
           
           
           
           /*req.post.upvote(function(err, post){
            if (err) { return next(err); }
            
            res.json(post);
            });*/
           });




/** URLs for Items */

router.get('/items', auth, function(req, res, next) {
    Item.find(function(err, posts){
              if(err){ return next(err); }
              
              res.json(posts);
              });
});

router.get('/triggerPayment', function(req, res, next) {
              var amt=req.query.amount;
              var merchantId=req.query.payAgg_MID;
              console.log("M : "+amt);

              var responseData="";
              Preference.findOne({merchantId:merchantId},function (err, data){
              if (data!=null)
              {    
                responseData='<html><body>';
                  for(var i=0;i<data.paymentMethods.length;i++)
                  {
                    if(data.paymentMethods[i].key=="Paypal")
                    {
                      responseData+='<a href="http://payagg-purulalwani.rhcloud.com/paypalPayment?amt='+amt+' " target="_blank">Paypal</a><br>'
                    }
                    else
                    {
                      responseData+='<a href="http://payagg-purulalwani.rhcloud.com/intiPayment?type='+data.paymentMethods[i].key+'" target="_blank">'+data.paymentMethods[i].value+'</a><br>';
                    }
                  }
                  responseData+='</body></html>';
                    res.json({txnid: 12345, html:responseData});
              } 
                           });
              //console.log("retirve all posts - posts: " + res.json(posts));
            
              
});

router.get('/intiPayment',function(req,res,next){
var type=req.query.type;
res.setHeader('content-type', 'text/html');
if(type=="CreditCard")
{

res.end('<html><link href="/javascripts/bootstrap-3.3.5/css/bootstrap.min.css" rel="stylesheet"> <div class="row"> <div class="col-md-6 col-md-offset-3"><form action="http://payagg-purulalwani.rhcloud.com/creditCardPayment" method="post"><div class="page-header"><h1>Credit Card</h1> </div><div class="form-group"><Label>Card Number</Label><input type="text" class="form-control" placeholder="Card Number"  required ></input> </div><div class="form-group"> <Label>Expiry Date</Label><input type="text" class="form-control"  placeholder="expiryDate"   required></input></div> <div class="form-group"><Label>CVV</Label> <input type="password" class="form-control" placeholder="CVV"  required></input></div><div class="form-group"><Label>Name On Card</Label><input type="text" name="nameonCard" class="form-control" placeholder="Name on Card" ></input></div><button type="submit" class="btn btn-primary">Submit</button></form></div></div</html>');
}
// else
// {
// res.end('<html><form action="http://payagg-purulalwani.rhcloud.com/paypalPayment" method="post"><table><tr><td>Username</td><td><input type="text" id="username"></td></tr><tr><td>Password</td><td><input type="password" id="password"></td></tr><tr><td></td><td><input type="submit" value="PAY"></td></tr></table></form></html>');  
// }

});

router.post('/creditCardPayment',function(req,res,next){




});


router.get('/paypalPayment',function(req,res,next){
  var file="";
  var  amt=req.query.amt;
  console.log("amt : "+amt);
  request.get('https://api-3t.sandbox.paypal.com/nvp?USER=purulalwani-facilitator_api1.gmail.com&PWD=JN87FYAKTW69FHQT&SIGNATURE=A8U4kN1ozZa4NoSGUvTXiP3pGt8FAevAp1IrIeFt0XbsQUf70iPlImPv&METHOD=SetExpressCheckout&VERSION=98&PAYMENTREQUEST_0_AMT='+amt+'&PAYMENTREQUEST_0_CURRENCYCODE=USD&PAYMENTREQUEST_0_PAYMENTACTION=SALE&cancelUrl=http://www.example.com/cancel.html&returnUrl=http://payagg-purulalwani.rhcloud.com/executePayment?amt=2',function(err,response,body){
    console.log("Init Pay"+ body);
    var info= body.split('&')[0].split('=')[1];
    console.log(body);
    var token=decodeURIComponent(info);
    console.log("token : "+token);
    var url='https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token='+token;
    console.log("URL : "+url);
    var file='<html><head><script>window.location.href="'+url+'"</script></head></html>';
    res.setHeader('content-type', 'text/html');
    res.end(file);
 //    request.get(url,function(err,resp,body1){
    
      
 //      res.writeHead(200, {
 //   'Content-Type': 'text/html', 
 //   'Set-Cookie': '604800',
 //   'Connection': 'keep-alive',
 //   'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
 // });
 //    //  console.log("body : "+body1);
 //      res.end(body1);
 //  //    console.log("body : "+body);
 //    });
 
    // request.get('https://api-3t.sandbox.paypal.com/nvp?METHOD=GetExpressCheckoutDetails&TOKEN=EC%2d8BA611440L054983X&USER=purulalwani-facilitator_api1.gmail.com&PWD=JN87FYAKTW69FHQT&SIGNATURE=A8U4kN1ozZa4NoSGUvTXiP3pGt8FAevAp1IrIeFt0XbsQUf70iPlImPv&VERSION=98',function(err,res,body){
    //     //console.log("Checkout details " +body);
    // });

  });

 
});

router.get('/executePayment',function(req,res,next){
var amt=req.query.amt;
var payerId=req.query.PayerID;
var token=req.query.token;
var url='https://api-3t.sandbox.paypal.com/nvp?METHOD=DoExpressCheckoutPayment&TOKEN='+token+'&USER=purulalwani-facilitator_api1.gmail.com&PWD=JN87FYAKTW69FHQT&SIGNATURE=A8U4kN1ozZa4NoSGUvTXiP3pGt8FAevAp1IrIeFt0XbsQUf70iPlImPv&VERSION=98&PAYERID='+payerId+'&PAYMENTREQUEST_0_AMT='+amt;
request.get(url,function(err,resp,body){
  res.end('success');
});

});

router.get('/authenticate_client',function(req,res,next){
	var clientId=req.query.client_id;
	var password=req.query.password;
	var json;
	console.log("Client ID: "+ clientId);
	console.log ("Password: " + password);
	var url='http://corporate_bank.mybluemix.net/corporate_banking/mybank/authenticate_client?client_id='+clientId+'&password='+password;
	request.get(url,function(err,resp,body){
	  /*var replaceSquareBracket = body.replace('[','');
	  console.log("replaceSquareBracket: " + replaceSquareBracket);
	  replaceSquareBracket = replaceSquareBracket.replace(']','');
	  console.log("replaceSquareBracket: " + replaceSquareBracket);
	  json = JSON.parse(replaceSquareBracket);
	  console.log("json: " + json);*/
	  var jsonWithoutSquareBrackets = util.removeSquareBrackets(body);
	  //var jsonObj = JSON.parse(jsonWithoutSquareBracket);
	  //console.log("token: " + jsonObj.token);
	  res.end(body);
	});

});

router.get('/balanceenquiry',function(req,res,next){
	var clientId=req.query.client_id;
	var token=req.query.token;
	var accountno=req.query.accountno;
	console.log("Client ID: "+ clientId);
	
	var url='http://retailbanking.mybluemix.net/banking/icicibank/balanceenquiry?client_id='+clientId+'&token='+token+'&accountno='+accountno;
	request.get(url,function(err,resp,body){
	  /*var replaceSquareBracket = body.replace('[','');
	  console.log("replaceSquareBracket: " + replaceSquareBracket);
	  replaceSquareBracket = replaceSquareBracket.replace(']','');
	  console.log("replaceSquareBracket: " + replaceSquareBracket);
	  json = JSON.parse(replaceSquareBracket);
	  console.log("json: " + json);*/
	  var jsonWithoutSquareBrackets = util.removeSquareBrackets(body);
	  //var jsonObj = JSON.parse(jsonWithoutSquareBracket);
	  //console.log("token: " + jsonObj.token);
	  res.end(body);
	});

});

router.get('/account_summary',function(req,res,next){
	var clientId=req.query.client_id;
	var token=req.query.token;
	var custid=req.query.custid;
	console.log("Client ID: "+ clientId);
	
	var url='http://retailbanking.mybluemix.net/banking/icicibank/account_summary?client_id='+clientId+'&token='+token+'&custid='+custid;
	request.get(url,function(err,resp,body){
	  /*var replaceSquareBracket = body.replace('[','');
	  console.log("replaceSquareBracket: " + replaceSquareBracket);
	  replaceSquareBracket = replaceSquareBracket.replace(']','');
	  console.log("replaceSquareBracket: " + replaceSquareBracket);
	  json = JSON.parse(replaceSquareBracket);
	  console.log("json: " + json);*/
	  var jsonWithoutSquareBrackets = util.removeSquareBrackets(body);
	  //var jsonObj = JSON.parse(jsonWithoutSquareBracket);
	  //console.log("token: " + jsonObj.token);
	  res.end(body);
	});

});

router.get('/recenttransaction',function(req,res,next){
	var clientId=req.query.client_id;
	var token=req.query.token;
	var accountno=req.query.accountno;
	console.log("Client ID: "+ clientId);
	
	var url='http://retailbanking.mybluemix.net/banking/icicibank/recenttransaction?client_id='+clientId+'&token='+token+'&accountno='+accountno; 
	request.get(url,function(err,resp,body){
	  /*var replaceSquareBracket = body.replace('[','');
	  console.log("replaceSquareBracket: " + replaceSquareBracket);
	  replaceSquareBracket = replaceSquareBracket.replace(']','');
	  console.log("replaceSquareBracket: " + replaceSquareBracket);
	  json = JSON.parse(replaceSquareBracket);
	  console.log("json: " + json);*/
	  var jsonWithoutSquareBrackets = util.removeSquareBrackets(body);
	  //var jsonObj = JSON.parse(jsonWithoutSquareBracket);
	  //console.log("token: " + jsonObj.token);
	  var txnjson = '[{"code": 200 }, {"transactiondate": "2016-03-25 12:14:33.0", "closing_balance": "5025000.00", "accountno": "5555666677771522", "credit_debit_flag": "Dr.", "transaction_amount": "20000.00", "remark": null, "transactionrefno"="1111111111" }, {"transactiondate": "2016-03-25 12:14:33.0", "closing_balance": "5010000.00", "accountno": "5555666677771522", "credit_debit_flag": "Dr.", "transaction_amount": "15000.00", "remark": null, "transactionrefno"="2222222222" }, {"transactiondate": "2016-03-25 12:14:33.0", "closing_balance": "5000000.00", "accountno": "5555666677771522", "credit_debit_flag": "Dr.", "transaction_amount": "10000.00", "remark": null, "transactionrefno"="3333333333" } ] '
	  res.end(txnjson);
	});

});

router.get('/documentlist', function(req, res, next) {
    var customerId=req.query.custid;
    
    console.log("customerId : "+customerId);

    var responseData="";
    CustomerDocuments.findOne({customerId:customerId},function (err, data){
    	if(err){ console.log(err); return next(err); }
    	console.log("Data : " + data);
    	if (data!=null)
        { 
    		res.json(data);
        }else{
        	var json = '{ "_id" : "56f5a041ee3c7948433d7273", "customerId" : "88882522", "documents" : [ { "documentid" : "PP", "documentname" : "Passport", "documenttypes" : [ { "type" : "AP" }, { "type" : "IP" } ] }, { "documentid" : "PC", "documentname" : "Pancard", "documenttypes" : [ { "type" : "IP" } ] }, { "documentid" : "DL", "documentname" : "Driving License", "documenttypes" : [ { "type" : "AP" }, { "type" : "IP" } ] }, { "documentid" : "AC", "documentname" : "Aadhaar Card", "documenttypes" : [ { "type" : "AP" }, { "type" : "IP" } ] }, { "documentid" : "TB", "documentname" : "Telephone Bill", "documenttypes" : [ { "type" : "AP" } ] } ] }';
        	res.end(json);
        }
                 });
    //console.log("retirve all posts - posts: " + res.json(posts));
  
    
});

router.get('/sharedocuments', function(req, res, next) {
    var customerId=req.query.custid;
    var docs = req.query.docs;
    var bank = req.query.bank;
    var shareDocuments = new ShareDocuments();
    
    shareDocuments.customerId = customerId;
    shareDocuments.referenceNo = Math.floor(Math.random()*900000) + 1000000000; 
    shareDocuments.bank = bank;
    shareDocuments.documents = [];
    //sharedDocuments.
    var splitDocs = docs.split(',');
    console.log("splitDocs: " + splitDocs);
    var documents; 
    for(var i=0;i<splitDocs.length;i++)
    {
    	console.log("splitDocs[i]: " + splitDocs[i]);
    	console.log("shareDocuments.documents: " + shareDocuments.documents);
    	//console.log("shareDocuments.documents[i]: " + shareDocuments.documents[i]);
    	//shareDocuments.documents[i].documentid=splitDocs[i];
    	var documentObj = {documentid:splitDocs[i]};
    	/*if (i==0){
    		documents = documents + '{documentid:' + splitDocs[i] +'}';
    	}else{
    		documents = documents + ',{documentid:' + splitDocs[i] +'}';
    	}*/
    	shareDocuments.documents.push(documentObj);
    	
    }
   // documents = documents + ']';
    
    console.log ("shareDocuments.documents: " + shareDocuments.documents);
    //shareDocuments.documents = documents;
   console.log("customerId : "+customerId);
    
    shareDocuments.save(function (err){
        if(err){ console.log(err); return next(err); }
        if(shareDocuments){
        	 res.json(shareDocuments)
        }else{
        	var json = '{"_id" : "56f5a041ee3c7948433d7273","customertId": "88882522","referenceNo":"1111111111","bank":"HDFC","documents":[{"documentid":"DL"}, {"documentid":"PC"}]}';
            res.end(json);	
        }
        
        
        });
    //var json = '{"_id" : "56f5a041ee3c7948433d7273","customertId": "88882522","referenceNo":"1111111111","bank":"HDFC","documents":[{"documentid":"DL"}, {"documentid":"PC"}]}';
    //res.end(json);
    /*var responseData="";
    CustomerDocuments.findOne({customertId:customerId},function (err, data){
    	if (data!=null)
        { 
    		res.json(data);
        }else{
        	var json = '{ "_id" : ObjectId("56f5a041ee3c7948433d7273"), "customertId" : "88882522", "documents" : [ { "documentid" : "PP", "documentname" : "Passport", "documenttypes" : [ { "type" : "AP" }, { "type" : "IP" } ] }, { "documentid" : "PC", "documentname" : "Pancard", "documenttypes" : [ { "type" : "IP" } ] }, { "documentid" : "DL", "documentname" : "Driving License", "documenttypes" : [ { "type" : "AP" }, { "type" : "IP" } ] }, { "documentid" : "AC", "documentname" : "Aadhaar Card", "documenttypes" : [ { "type" : "AP" }, { "type" : "IP" } ] }, { "documentid" : "TB", "documentname" : "Telephone Bill", "documenttypes" : [ { "type" : "AP" } ] } ] }'
        	res.end(json);
        }
                 });*/
    //console.log("retirve all posts - posts: " + res.json(posts));
  
    
});

router.get('/fetchorderdetails', function(req, res, next) {
    //var customerId=req.query.custid;
    var txnrefno=req.query.txnrefno;
    
    //console.log("customerId : "+customerId);

    var responseData="";
    CustomerOrderDetails.findOne({txnReferenceNo:txnrefno},function (err, data){
    	if (data!=null)
        { 
    		res.json(data);
        }else{
        	var json = '{ "_id" : "56f5a041ee3c7948433d7273", "customerId": "88882522", "txnReferenceNo":"1111111111", "merchantId":"amozon", "totalAmount":"20000.00", shareText:"view purchase <a href=\"http://host:port/viewshare?txnrefno=1111111111\" value=\"http://ss.co/1111111111\"></a>","rating":1,"views":1,"items":[{"itemName":"iPhone 5s", "itemPrice":"17000"}, {"itemName":"iPhone 5s Case", "itemPrice":"3000"}]}';
            res.end(json);
        }
                 });
    //console.log("retirve all posts - posts: " + res.json(posts));
    
    
});

router.get('/viewshare', function(req, res, next) {
    var txnrefno=req.query.txnrefno;
    
    console.log("txnrefno : "+txnrefno);

    CustomerOrderDetails.findOne({txnReferenceNo:txnrefno},function (err, data){
    	if (data!=null)
        { 
    		data.views +=1;
    		data.save(function (err){
    	        if(err){ console.log(err); return next(err); }
    	        });
    		Merchants.findOne({merchantId:data.merchantId},function (err, merchant){
    	    	if (data!=null)
    	        {
    	    		console.log("merchant.merchantWebsite: " + merchant.merchantWebsite);
    	    		var file='<html><head><script>window.location.href="' + merchant.merchantWebsite +'"</script></head></html>';
    	            res.setHeader('content-type', 'text/html');
    	            res.end(file);
    	    		
    	        }else{
    	        	var file='<html><head><script>window.location.href="http://www.amazon.in"</script></head></html>';
    	            res.setHeader('content-type', 'text/html');
    	            res.end(file);
    	        }
    	    	});
    		
    		
        }else{
        	var file='<html><head><script>window.location.href="http://www.amazon.in"</script></head></html>';
            res.setHeader('content-type', 'text/html');
            res.end(file);
        }
                 });
    
    //console.log("retirve all posts - posts: " + res.json(posts));
  
    
});

router.get('/ratetransaction', function(req, res, next) {
	var txnrefno=req.query.txnrefno;
	var rating=req.query.rating;
    
    console.log("txnrefno : "+txnrefno);


    CustomerOrderDetails.findOne({txnReferenceNo:txnrefno},function (err, data){
    	if (data!=null)
        { 
    		data.rating = rating;
    		data.save(function (err){
    	        if(err){ console.log(err); return next(err); }
    	        });
    		// var json = '{ "_id" : "56f5a041ee3c7948433d7273", "customerId": "88882522", "txnReferenceNo":"1111111111", "merchantId":"amozon", "totalAmount":"20000.00", shareText:"view purchase <a href=\"http://host:port/viewshare?txnrefno=1111111111\" value=\"http://ss.co/1111111111\"></a>","rating":3,"views":1,"items":[{"itemName":"iPhone 5s", "itemPrice":"17000"}, {"itemName":"iPhone 5s Case", "itemPrice":"3000"}]}';
    	        res.end(data);
    		
        }else{
        	 var json = '{ "_id" : "56f5a041ee3c7948433d7273", "customerId": "88882522", "txnReferenceNo":"1111111111", "merchantId":"amozon", "totalAmount":"20000.00", shareText:"view purchase <a href=\"http://host:port/viewshare?txnrefno=1111111111\" value=\"http://ss.co/1111111111\"></a>","rating":3,"views":1,"items":[{"itemName":"iPhone 5s", "itemPrice":"17000"}, {"itemName":"iPhone 5s Case", "itemPrice":"3000"}]}';
             res.end(json);
        }
                 });
   
    //console.log("retirve all posts - posts: " + res.json(posts));
  
    
});

router.get('/merchantlist', function(req, res, next) {
   // var customerId=req.query.custid;
    
    //console.log("customerId : "+customerId);

    var responseData="";
    Merchants.find({},function (err, data){
    	if(err){ console.log(err); return next(err); }
    	if (data!=null)
        { 
    		res.json(data);
        }else{
        	var json = '{"merchants":[{"_id" : "56f5a041ee3c7948433d7273", "merchantId":"amazon", "merchantName":"Amazon India Pvt. Ltd.", "merchantType":"e-commerce"}]}';
        	res.end(json);
        }
        });
    	
    //console.log("retirve all posts - posts: " + res.json(posts));
  
    
});

router.get('/merchantrating', function(req, res, next) {
    var merchantId=req.query.merchantId;
    
    console.log("merchantId : "+merchantId);

    var responseData="";
    CustomerOrderDetails.find({merchantId:merchantId},function (err, data){
    	if (data!=null)
        { 
    		console.log("data : "+data);
    		var total = 0;
    		for(var i=0;i<data.length;i++)
    	    {
    			total += data[i].rating;
    			
    	    }
    		console.log("total : "+total);
    		console.log("data.length : "+data.length);
    		total = total/(data.length);
    		//res.json(data);
    		Merchants.findOne({merchantId:merchantId},function (err, merchant){
    			if (merchant!=null)
    	        { 
    				res.json({merchant: merchant, rating:total});
    				
    	        }else{
    	        	var json = '{ "merchant" : {"_id" : "56f5a041ee3c7948433d7273", "merchantId":"amazon", "merchantName":"Amazon India Pvt. Ltd.", "merchantType":"e-commerce"}, "rating":"1"}';
    	            res.end(json);
    	        }
    		});
        }else{
        	var json = '{ "merchant" : {"_id" : "56f5a041ee3c7948433d7273", "merchantId":"amazon", "merchantName":"Amazon India Pvt. Ltd.", "merchantType":"e-commerce"}, "rating":"1"}';
            res.end(json);
        }
                 });
    //var json = '{ "merchant" : {"_id" : "56f5a041ee3c7948433d7273", "merchantId":"amazon", "merchantName":"Amazon India Pvt. Ltd.", "merchantType":"e-commerce"}, "rating":"1"}';
    //res.end(json);
    //console.log("retirve all posts - posts: " + res.json(posts));
  
    
});

router.get('/myreward', function(req, res, next) {
	var customerId=req.query.custid;
    //var txnrefno=req.query.txnrefno;
    
    //console.log("customerId : "+customerId);

    var responseData="";
    CustomerOrderDetails.find({customerId:customerId},function (err, data){
    	

    	if (data!=null)
        { 
    		console.log("data : "+data);
    		var total = 0;
    		for(var i=0;i<data.length;i++)
    	    {
    			total += data[i].views;
    			
    	    }
    		console.log("total : "+total);
    		console.log("total String: "+total.toString());
    		console.log("data.length : "+data.length);
    		var totalStr='' +total+'';
    		res.json({customerId: customerId, reward:totalStr});
    		
    		
        }else{
        	var json = '{ "customerId" : "88882522", "reward":"10"}';
            res.end(json);
        }
                 });
    //var json = '{ "merchant" : {"_id" : "56f5a041ee3c7948433d7273", "merchantId":"amazon", "merchantName":"Amazon India Pvt. Ltd.", "merchantType":"e-commerce"}, "rating":"1"}';
    //res.end(json);
    //console.log("retirve all posts - posts: " + res.json(posts));
  
    
});



module.exports = router;