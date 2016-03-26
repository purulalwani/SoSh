var mongoose = require('mongoose');

var ShareDocumentsSchema = new mongoose.Schema({
                                        customertId: String,
                                        referenceNo:String,
                                        bank:String,
                                        documents:[{documentid:String}]
                                        });

module.exports = mongoose.model('ShareDocuments', ShareDocumentsSchema);

/*
{"customertId": "88882522","referenceNo":"1111111111","bank":"HDFC","documents":[{"documentid":"DL"}, {"documentid":"PC"}]}

*/