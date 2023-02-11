const fb = require('express').Router();
const { json } = require('express');
const { readFromFile, writeToFile} = require('../helpers/fsUtils');

// GET Route for retrieving all the feedback
fb.get('/notes', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

fb.post('/notes', (req, res) => 
{
    readFromFile('./db/db.json').then((data)=> {
        let jsonData = JSON.parse(data)
        // get id at end of db list and increase by one to add into db
        let id = parseInt(jsonData[jsonData.length - 1].id )+ 1;
        jsonData.push({
            "id" : `${id}`,
            "title": req.body.title,
            "text": req.body.text
        })
        writeToFile('./db/db.json',jsonData).then(data => res.json(JSON.parse(data)))
    })
});

module.exports = fb;
