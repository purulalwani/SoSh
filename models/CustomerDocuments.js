var mongoose = require('mongoose');

var CutomerDocumentsSchema = new mongoose.Schema({
                                        customertId: String,
                                        documents:[{documentid:String, documentname:String, documenttypes:[{type:String}]}]
                                        });

module.exports = mongoose.model('CutomerDocuments', CutomerDocumentsSchema);

/*
db.CutomerDocuments.insert({"customertId": "88882522",
documents:[{"documentid":"PP", documentname:"Passport", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
          , {"documentid":"PC", documentname:"Pancard", "documenttypes":[{"type":"IP"}]}
          , {"documentid":"DL", documentname:"Driving License", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
          , {"documentid":"AC", documentname:"Aadhaar Card", "documenttypes":[{"type":"AP"},{"type":"IP"}]}
          , {"documentid":"TB", documentname:"Telephone Bill", "documenttypes":[{"type":"AP"}]}
          ]
                                        
});
*/
