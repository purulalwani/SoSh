var mongoose = require('mongoose');

var MerchantsSchema = new mongoose.Schema({
                                        merchantId:String,
                                        merchantName:String,
                                        merchantType:String
                                        });

module.exports = mongoose.model('Merchants', MerchantsSchema);

/*
{"merchants":[{merchantId:"amazon", merchantName:"Amazon India Pvt. Ltd.", merchantType:"e-commerce"}]}
*/