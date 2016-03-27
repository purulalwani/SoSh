var mongoose = require('mongoose');

var CustomerDocumentsSchema = new mongoose.Schema({
                                        customerId: String,
                                        documents:[{documentid:String, documentname:String, documenttypes:[{type:String}]}]
                                        });

module.exports = mongoose.model('CustomerDocuments', CustomerDocumentsSchema, 'CustomerDocuments');

/*
db.CustomerDocuments.insert({customerId: "88882522",
documents:[{"documentid":"PP", documentname:"Passport", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
          , {"documentid":"PC", documentname:"Pancard", "documenttypes":[{"type":"IP"}]}
          , {"documentid":"DL", documentname:"Driving License", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
          , {"documentid":"AC", documentname:"Aadhaar Card", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
          , {"documentid":"TB", documentname:"Telephone Bill", "documenttypes":[{"type":"AP"}]}
          ]
                                        
});
*/
