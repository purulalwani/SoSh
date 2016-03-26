var mongoose = require('mongoose');

var CustomerOrderDetailsSchema = new mongoose.Schema({
                                        customertId: String,
                                        txnReferenceNo:String,
                                        merchantId:String,
                                        totalAmount:String,
                                        shareText:String,
                                        rating:Number,
                                        views:Number,
                                        items:[{itemName:String, itemPrice:String}]
                                        });

module.exports = mongoose.model('CustomerOrderDetails', CustomerOrderDetailsSchema);

/*
{"customertId": "88882522", "txnReferenceNo":"1111111111", "merchantId":"amozon", "totalAmount":"20000.00", shareText:"view purchase <a href=\"http://host:port/viewshare?txnrefno=1111111111\" value=\"http://ss.co/1111111111\"/>","rating":1,"views":1,"items":[{"itemName":"iPhone 5s", "itemPrice":"17000"}, {"itemName":"iPhone 5s Case", "itemPrice":"3000"}]}
*/