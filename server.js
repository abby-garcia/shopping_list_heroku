var express = require('express');
var bodyParser = require('body-parser');

var Storage = function() {
    this.items = [];
    this.id = 0;
};
// Crud - Create, Read, Update, Delete
Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(id) {
    var item = "";
    for(var i=0; i < this.items.length; i++){
        if(this.items[i].id == id){
            item = this.items.splice(i, 1);   
        }
    }
    return item;
};

Storage.prototype.update = function(id,name) {
    var item = "";
    for(var i=0; i < this.items.length; i++){
        if(this.items[i].id == id){
            this.items[i].name = name;
            item = this.items[i];
        }
    }
    return item;
};


var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');


var app = express(); // opens door to reading URLs
app.use(express.static('public'));

app.get('/items', function(req, res) {  //this is the "read" part
    res.json(storage.items);
});

var jsonParser = bodyParser.json();

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400);
    }
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400);
    }
    
    var item = storage.remove(req.params.id);
    
    if(item === ""){
        return res.status(400);
    }
    console.log(storage.items);
    res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400);
    }
    var item = storage.update(req.params.id, req.body.name);
    if(item === ""){
        return res.status(400);
    }
    
    
    res.status(201).json(item);
});



app.listen(process.env.PORT || 8080);

//These will allow you to make requests to the app, and investigate the current state of the storage object.
exports.app = app;
exports.storage = storage;