var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

mongoose.connect('mongodb://localhost:27017/book');
var book = new mongoose.Schema({
	title: String,
	author: String,
	content: String
});
var Book = mongoose.model('book', book);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//API
app.get('/api/books', function(req,res){
	return Book.find(function(err, books){
		if(!err){
			return res.send(books);
		}else{
			return console.log(err);
		}
	});
});
app.post('/api/books', function(req,res){
	var book = new Book({
		title: req.body.title,
		author: req.body.author,
		content: req.body.content
	});
	book.save(function(err){
		if(!err){
			return console.log('created');
		}else{
			return console.log(err);
		}
	});
	return res.send(book);
});
app.get('/api/books/:id', function(req,res){
	return Book.findById(req.params.id, function(err,book){
		if(!err){
			return res.send(book);
		}else{
			return console.log(err);
		}
	});
});
app.put('/api/books/:id', function(req,res){
	return Book.findById(req.params.id, function(err,book){
		book.title = req.body.title;
		book.author = req.body.author;
		book.content = req.body.content;
		return book.save(function(err){
			if(!err){
				console.log('book updated');
			}else{
				console.log(err);				
			}
			return res.send(book);
		});
	});
});
app.delete('/api/books/:id', function(req,res){
	return Book.findById(req.params.id, function(err,book){
		return book.remove(function(err){
			if(!err){
				console.log('Book removed');
				return res.send('');
			}else{
				console.log(err);
			}
		});
	});
});

app.listen(3000, function(){
	console.log('App run 3000 port');
});