var mongoose = require('mongoose');

var CustomerOrderDetailsSchema = new mongoose.Schema({
                                        customerId: String,
                                        txnReferenceNo:String,
                                        merchantId:String,
                                        totalAmount:String,
                                        shareText:String,
                                        rating:Number,
                                        views:Number,
                                        items:[{itemName:String, itemPrice:String}]
                                        });

module.exports = mongoose.model('CustomerOrderDetails', CustomerOrderDetailsSchema, 'CustomerOrderDetails');

/*
db.CustomerOrderDetails.insert({"customerId": "88882522", "txnReferenceNo":"1111111111", "merchantId":"amazon", "totalAmount":"20000.00", shareText:"view purchase <a href=\"http://sosh-purulalwani.rhcloud.com/viewshare?txnrefno=1111111111\" value=\"http://ss.co/1111111111\"/>","rating":1,"views":1,"items":[{"itemName":"iPhone 5s", "itemPrice":"17000"}, {"itemName":"iPhone 5s Case", "itemPrice":"3000"}]})
db.CustomerOrderDetails.update({"merchantId":"amozon"},{$set:{"merchantId":"amazon"}})
*/