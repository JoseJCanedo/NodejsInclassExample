//require express
var express = require('express');
//require body-parser
var bodyParser = require("body-parser");
//create express object, call express
var app = express();
//get port information
const port = process.env.PORT || 3000;

//tell application to use EJS for templates
app.set('view engine', 'ejs');
//tell app to use Body parser
app.use(bodyParser.urlencoded({extended: true}));

//Couple of items todo
var tasks = ["make it to class", "take child to daycare"];

//completed items
var completed = ["extra work"];

//get home page /
app.get('/', function(req, res){
    //return something to home page
    res.render('index', {tasks: tasks}); //add completed variable to ejs ex {a:a, b:b}
});

//add post method /addtask
app.post('/addtask', function(req, res){
    var newTask = req.body.newtask;
    tasks.push(newTask);
    //return index
    res.redirect('/');
});

app.post('/removetask', function(req, res){
    var removeTask = req.body.check;
    //push to completed
    if(typeof removeTask === 'string'){
        tasks.splice(tasks.indexOf(removeTask), 1);
    }else if(typeof removeTask === 'object'){
        for (var i = 0; i < removeTask.length; i++){
            tasks.splice(tasks.indexOf(removeTask[i]), 1);
        }
    }
    res.redirect('/');
});

//server setup
app.listen(port, function(){
    console.log('Listening on ' + port)
});