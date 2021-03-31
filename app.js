const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const dbService = require('./dbService');
const e = require('express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/index.js', (req,res) => {
    res.sendFile(path.join(__dirname+'/index.js'));
});

app.get('/stylesheet.css', (req,res) => {
    res.sendFile(path.join(__dirname+'/stylesheet.css'));
});


// create
app.post('/insert', (request, response) => {
    const { Name }= request.body;
    const { Numb }= request.body;
    

    const db = dbService.getDbServiceInstance();

    const result1 = db.searchByName(Name);
    
    result1
    .then(data => {
            const result = db.insertNewName(Name,Numb);
            result
            .then(data => response.json({ data: data}))
            .catch(err => console.log(err));
        })
    .catch(err => console.log(err));   
});

// read
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    result
    .then(data => {
            response.json({data : data})
        })
    .catch(err => console.log(err));
})

// update
app.patch('/update', (request, response) => {
    const { id, Name } = request.body;
    const db = dbService.getDbServiceInstance();

    const result1 = db.searchByName(Name);
    
    result1
    .then(data => {
        if(data.length===0)
        {
            const result = db.updateNameById(id, Name);   
            result
            .then(data => response.json({success : data}))
            .catch(err => console.log(err));
        }
        else
        {
            response.json({success : data});
        }
    })
    .catch(err => console.log(err));

    // const result = db.updateNameById(id, Name);
    
    // result
    // .then(data => response.json({success : data}))
    // .catch(err => console.log(err));
});

// delete
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

app.get('/search/:Name', (request, response) => {
    const { Name } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(Name);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.listen(5000, () => console.log('app is running'));

