// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
	res.render('hello', { message: 'Congrats, you just set up your app!' });
});
app.enable('trust proxy');

app.get('/', function(req, res){
	res.render('index',{ name: "AVOSCloud"});
});

var Visitor = AV.Object.extend('Visitor');
function renderIndex(res, name){
	var query = new AV.Query(Visitor);
	query.skip(0);
	query.limit(10);
	query.find({
		success: function(results){
			res.render('index',{ name: name, visitors: results});
		},
		error: function(error){
			res.render('500',500)
		}
	});

}

app.post('/',function(req, res){
	var name = req.body.name;
	if(name && name!=''){
		//Save visitor
		var visitor = new Visitor();
		visitor.set('name', name);
		visitor.save(null, {
			success: function(gameScore) {
				renderIndex(res, name);
			},
			error: function(gameScore, error) {
				res.render('500', 500);
			}
		});
	}else{
		renderIndex(res, 'AVOSCloud');
	}
});

// This line is required to make Express respond to http requests.
app.listen();