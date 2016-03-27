var mongoose = require('mongoose');

var MerchantsSchema = new mongoose.Schema({
                                        merchantId:String,
                                        merchantName:String,
                                        merchantType:String,
                                        merchantWebsite:String
                                        });

module.exports = mongoose.model('Merchants', MerchantsSchema, 'Merchants');

/*
{"merchants":[{merchantId:"amazon", merchantName:"Amazon India Pvt. Ltd.", merchantType:"e-commerce"}]}

db.Merchants.insert({merchantId:"amazon", merchantName:"Amazon India Pvt. Ltd.", merchantType:"e-commerce", merchantWebsite:"http://www.amazon.in"})
db.Merchants.insert({merchantId:"snapdeal", merchantName:"Snapdeal India Pvt. Ltd.", merchantType:"e-commerce", merchantWebsite:"http://www.snapdeal.com"})
db.Merchants.insert({merchantId:"flipkart", merchantName:"Flipkart India Pvt. Ltd.", merchantType:"e-commerce", merchantWebsite:"http://www.flipkart.com"})
*/