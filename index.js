
var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var fetch = require('node-fetch');
var app = express();
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Connection Information for Mongo
const Todo = require('./models/todo.model');
const mongoDB = 'mongodb+srv://example_user:T9I7SERp3l6O0A9u@cluster0.jnbwk.mongodb.net/todolist?retryWrites=true&w=majority'
//const mongoDB =  'mongodb+srv://testConnection:b8RwqJYgo4hD1xhe@nodetodoexample-iqnde.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var tasks = [];
var completed = [];

app.get('/', function(req, res){
    Todo.find(function(err, todo){
        if(err){
            console.log(err);
        }else{
            tasks = [];
            completed = [];
            for(i = 0; i< todo.length; i++){
                if(todo[i].done){
                    completed.push(todo[i])
                }else{
                    tasks.push(todo[i])
                }
            }
        }
    });
    res.render('index', {tasks: tasks, completed: completed});
});

app.post('/addtask', function(req, res){
    let newTodo = new Todo({
        item: req.body.newtask,
        done: false
    })
    newTodo.save(function(err, todo){
        if (err){
            console.log(err)
        } else {
            //return index
            res.redirect('/');
        }
    });
});

app.post('/removetask', function(req, res){
    var id = req.body.check;
    if(typeof id === 'string'){
        Todo.updateOne({_id: id},{done:true},function(err){
            if(err){
                console.log(err)
            }
            res.redirect('/');
        })
    }else if(typeof id === 'object'){
        for (var i = 0; i < id.length; i++){
            Todo.updateOne({_id: id[i]},{done:true},function(err){
                if(err){
                    console.log(err)
                }
                res.redirect('/');
            })
        }
    }
    
});

app.post('/deleteTodo', function(req, res){
    var id = req.body.delete;
    if(typeof id === "string"){
        Todo.deleteOne({_id: id}, function(err){
            if (err){
               console.log(err)
            }
        });
    }else if (typeof id === "object"){
        for(var i = 0; i < id.length; i++){
            Todo.deleteOne({_id: id[i]}, function(err){
            if (err){
                console.log(err)
            }
        });
        }
    }
    res.redirect('/');
})

app.get('/nasa', function(req, res){
    fetch('https://api.nasa.gov/planetary/apod?api_key=7lqr4qoVCaJweZv9hp89XHb6he3UEqesrowGwAMa')
    .then(res => res.json())
    .then(data => {
        res.render('nasa',{data:data});
    });
})

app.get('/nasaDate', function(req, res){
    //wrote logic for random date
    let date = '2019-12-16'
    fetch('https://api.nasa.gov/planetary/apod?api_key=7lqr4qoVCaJweZv9hp89XHb6he3UEqesrowGwAMa&date=' + date)
    .then(res => res.json())
    .then(data => {
        res.render('nasaRandom', {data: data})
    });
})

//server setup
app.listen(port, function(){
    console.log('Listening on ' + port)
});