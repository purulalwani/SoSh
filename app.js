var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                       message: err.message,
                       error: err
                       });
            });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
                   message: err.message,
                   error: {}
                   });
        });


module.exports = app;


// Open mongo DB connection

var mongoose = require('mongoose');
var passport = require('passport');

var Post = require('./models/Posts');
var Comment = require('./models/Comments');
var User = require('./models/Users');
var Item = require('./models/Items');
var Preference = require('./models/PaymentPreference');
var CustomerDocuments=require('./models/CustomerDocuments');
var ShareDocuments=require('./models/ShareDocuments');
var CustomerOrderDetails=require('./models/CustomerOrderDetails');
var Merchants=require('./models/Merchants');
require('./config/passport');



app.use(passport.initialize());



//provide a sensible default for local development
mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + 'news';
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}




//mongoose.connect('mongodb://localhost/news', function(err) {
mongoose.connect(mongodb_connection_string, function(err) {
                 if(err) {
                 console.log('DB connection error', err);
                 } else {
                 console.log('DB connection successful');
                 }
                 });

var conn = mongoose.connection;

var merchant = {merchantId:"amazon", merchantName:"Amazon India Pvt. Ltd.", merchantType:"e-commerce", merchantWebsite:"http://www.amazon.in"}

conn.collection('Merchants').insert(merchant);

merchant = {merchantId:"snapdeal", merchantName:"Snapdeal India Pvt. Ltd.", merchantType:"e-commerce", merchantWebsite:"http://www.snapdeal.com"}

conn.collection('Merchants').insert(merchant);

merchant = {merchantId:"flipkart", merchantName:"Flipkart India Pvt. Ltd.", merchantType:"e-commerce", merchantWebsite:"http://www.flipkart.com"}

conn.collection('Merchants').insert(merchant);

var orderdetails = {"customerId": "88882522", "txnReferenceNo":"1111111111", "merchantId":"amazon", "totalAmount":"20000.00", shareText:"view purchase <a href=\"http://sosh-purulalwani.rhcloud.com/viewshare?txnrefno=1111111111\" value=\"http://ss.co/1111111111\"/>","rating":0,"views":0,"items":[{"itemName":"iPhone 5s", "itemPrice":"17000"}, {"itemName":"iPhone 5s Case", "itemPrice":"3000"}]}

conn.collection('CustomerOrderDetails').insert(orderdetails);

orderdetails = {"customerId": "88882522", "txnReferenceNo":"2222222222", "merchantId":"snapdeal", "totalAmount":"15000.00", shareText:"view purchase <a href=\"http://sosh-purulalwani.rhcloud.com/viewshare?txnrefno=2222222222\" value=\"http://ss.co/2222222222\"/>","rating":0,"views":0,"items":[{"itemName":"Samsung Note", "itemPrice":"15000"}]}

conn.collection('CustomerOrderDetails').insert(orderdetails);

orderdetails = {"customerId": "88882522", "txnReferenceNo":"3333333333", "merchantId":"flipkart", "totalAmount":"10000.00", shareText:"view purchase <a href=\"http://sosh-purulalwani.rhcloud.com/viewshare?txnrefno=3333333333\" value=\"http://ss.co/3333333333\"/>","rating":0,"views":0,"items":[{"itemName":"Moto X", "itemPrice":"10000"}]}

conn.collection('CustomerOrderDetails').insert(orderdetails);

var documents = {customerId: "88882522",
		documents:[{"documentid":"PP", documentname:"Passport", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
        , {"documentid":"PC", documentname:"Pancard", "documenttypes":[{"type":"IP"}]}
        , {"documentid":"DL", documentname:"Driving License", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
        , {"documentid":"AC", documentname:"Aadhaar Card", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
        , {"documentid":"TB", documentname:"Telephone Bill", "documenttypes":[{"type":"AP"}]}
        ]
                                      
}

conn.collection('CustomerDocuments').insert(documents);

//mongoose.connect('mongodb://localhost/news');