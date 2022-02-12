const router= require('express').Router();
const {filterByQuery, findById, createNewAnimal, validateAnimal}= require('../../lib/animals');
const {animals}= require('../../data/animals.json');


//retrieve data from the json file
router.get('/animals', (req, res) =>
{
    let results= animals;
    if (req.query)
    {
        results= filterByQuery(req.query, results);
    }
    
    res.json(results);
});

//retrieve data from the json file based on the id
router.get('/animals/:id', (req, res) => 
{
    const result= findById(req.params.id, animals);
    if (result)
    {
        res.json(result);
    }
    else
    {
        res.send(404);
    }
});


//sends data to the json file
router.post('/animals', (req, res) => 
{
    // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id= animals.length.toString();

    // add animal to json file and animals array in this function
    // if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body))
    {
        res.status(400).send('The animal is not properly formatted.');
    }
    
    else
    {
        const animal= createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

module.exports= router;