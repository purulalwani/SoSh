var mongoose = require('mongoose');

var ShareDocumentsSchema = new mongoose.Schema({
                                        customerId: String,
                                        referenceNo:String,
                                        bank:String,
                                        documents:[{documentid:String}]
                                        });

module.exports = mongoose.model('ShareDocuments', ShareDocumentsSchema, 'ShareDocuments');

/*
{"customerId": "88882522","referenceNo":"1111111111","bank":"HDFC","documents":[{"documentid":"DL"}, {"documentid":"PC"}]}

*/