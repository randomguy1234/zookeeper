const router= require('express').Router();
const { filterByQuery, findById, createNewZookeeper, validateZookeeper }= require('../../lib/zookeepers');
const { zookeepers }= require('../../data/zookeepers.json');


//retrieve data from the json file
router.get('/zookeepers', (req, res) =>
{
    let results= zookeepers;
    if (req.query)
    {
        results= filterByQuery(req.query, results);
    }
    
    res.json(results);
});

//retrieve data from the json file based on the id
router.get('/zookeepers/:id', (req, res) => 
{
    const result= findById(req.params.id, zookeepers);
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
router.post('/zookeepers', (req, res) => 
{
    // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id= zookeepers.length.toString();

    // add animal to json file and animals array in this function
    // if any data in req.body is incorrect, send 400 error back
    if(!validateZookeeper(req.body))
    {
        res.status(400).send('The zookeeper is not properly formatted.');
    }
    
    else
    {
        const zookeeper= createNewZookeeper(req.body, zookeepers);
        res.json(zookeeper);
    }
});

module.exports= router;