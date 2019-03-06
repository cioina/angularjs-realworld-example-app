//  OpenShift sample Node application
// https://docs.openshift.com/online/getting_started/beyond_the_basics.html
// https://blog.openshift.com/getting-started-nodejs-oso3/
// https://expressjs.com/en/starter/static-files.html

var express = require('express'),
    app = express();

    
Object.assign = require('object-assign');

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/dist'));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/', function (req, res) {
    res.render('index.html');
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
