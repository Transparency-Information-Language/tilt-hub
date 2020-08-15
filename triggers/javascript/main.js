const https = require('https');

var url = 'https://raw.githubusercontent.com/Transparency-Information-Language/schema/master/tilt-schema.json';
let req = https.get(url, function(res) {
	let data = '',
		json_data;

	res.on('data', function(stream) {
		data += stream;
	});
	res.on('end', function() {
        json_data = JSON.parse(data);
        console.log('Downloaded schema from ' + url);
        var schema = json_data;

        var Ajv = require('ajv');
var ajv = new Ajv({ allErrors : true });
// console.log(schema);
var validate = ajv.compile(schema);


var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://root:SuperSecret@mongo/?authSource=admin&authMechanism=SCRAM-SHA-256&replicaSet=rs0", {useNewUrlParser: true, useUnifiedTopology: true})
     .then(function(client){
       let db = client.db('tilt')

       let change_streams = db.collection('tilt').watch()
          change_streams.on('change', function(change){
            console.log('Document changes detected!');
              
            // console.log(JSON.stringify(change));

            var mongoId = change.fullDocument._id;
        
            delete change.fullDocument._id;
            
            var valid = validate(change.fullDocument);
            if (!valid) {
                console.error('tilt schema validation errors occured:');
                console.error(validate.errors);
                // TODO : handle the document --> maybe set status to inactive
            } else {
                console.log('tilt schema validation successful!');
            }

          });
      });

      console.log('Trigger on tilt collection initialized successfully!')











	});
});

req.on('error', function(e) {
    console.log(e.message);
});



