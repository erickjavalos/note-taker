const fb = require('express').Router();
const fs = require('fs');
const { json } = require('express');
const { readFromFile, writeToFile} = require('../helpers/fsUtils');

// GET Route for retrieving all the feedback
fb.get('/notes', (req, res) =>
  readFromFile('./db/db.json').then((data) => {
    res.json(JSON.parse(data))
})
);

fb.post('/notes', (req, res) => 
{
    console.log('saving note')
    readFromFile('./db/db.json').then((data)=> {
        let jsonData = JSON.parse(data)
        // get id at end of db list and increase by one to add into db
        let id = 0;
        // increment id if it exists
        try {
            id = parseInt(jsonData[jsonData.length - 1].id )+ 1;
        }
        catch (err) {}
        
        
        jsonData.push({
            "id" : `${id}`,
            "title": req.body.title,
            "text": req.body.text
        })

        fs.writeFile('./db/db.json', JSON.stringify(jsonData, null, 4), (err) =>  
        {
            if (err){
                console.log(err)
                res.status(400).json("error")
            }
            else {
                console.log("successfully written to db.json")
                res.status(200).json("success")
            }
        })
    })
});


// Delete recipe
fb.delete('/notes/:id', async (req, res) => {

    // read from file 
    readFromFile('./db/db.json').then((data)=> {
        let jsonData = JSON.parse(data)
        // iterate through each element of jsonData and update db that way
        let newData = []
        jsonData.forEach((ele) => {
            // pushes all elements except that of specied id
            if (ele.id !== req.params.id){
                newData.push(ele)
            }
        })

        // write the data to the file and return a success        
        fs.writeFile('./db/db.json', JSON.stringify(newData, null, 4), (err) =>  
        {
            if (err){
                console.log(err)
                res.status(400).json("error")
            }
            else {
                console.log("successfully written to db.json")
                res.status(200).json("success")
            }
        })
    })
})
    
  
    // try {
    //   const recipeData = await Recipe.destroy({
    //     where: {
    //       recipe_id: req.params.id,
    //     },
    //   });
  
    //   if (!recipeData) {
    //     res.status(404).json({ message: 'No library card found with that id!' });
    //     return;
    //   }
  
    //   res.status(200).json(recipeData);
    // } catch (err) {
    //   res.status(500).json(err);
    // }
//   });


module.exports = fb
