const express = require('express'),
  https = require('https'),
  fs = require('fs'),
  aws = require('aws-sdk');
  
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'UTF-8')),
  awsSecretKey = credentials.amazon.AWSSecretKey,
  awsAccessKeyId = credentials.amazon.AWSAccessKeyId,
  //AWS requires a credentials object when creating any of its API objects.
  //If none is included, it will check in ~/.aws/credentials for your access key and secret key
  awsCreds = new aws.Credentials(awsAccessKeyId, awsSecretKey);
  DynamoDB = new aws.DynamoDB({
    credentials:awsCreds, 
    apiVersion: '2012-08-10',
    //This will need to be set to your particular region
    region: 'us-east-1',
  });
  app = express();

//Express Setup
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});


app.get('/cacheversions', function(req,res){
  res.send({
    getComments:'1'
  });
});

app.get('/comments', function(req,res){
  DynamoDB.scan({'TableName':'Posts'}, (err, data) => {
    if(err){
      return res.end();
    }
    res.set('Cache-Control', 'max-age=9001');//Over 9000
    res.send(data);
  });
});

app.listen(1337, function () {
  console.log('Example app listening on port 1337!');
});