//require statements
const express= require('express');
const {animals}= require('./data/animals');
const fs= require('fs');
const path= require('path');


const PORT= process.env.PORT || 3001;

const app= express();

// parse incoming string or array data
app.use(express.urlencoded({extended: true}));
// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));


//function for filtering out data in the animal.json file
function filterByQuery(query, animalsArray)
{
    let personalityTraitsArray= [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults= animalsArray;

    if(query.personalityTraits)
    {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string')
        {
            personalityTraitsArray= [query.personalityTraits];
        }
        else
        {
            personalityTraitsArray= query.personalityTraits;
        }

        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait =>
            {
                // Check the trait against each animal in the filteredResults array.
                // Remember, it is initially a copy of the animalsArray,
                // but here we're updating it for each trait in the .forEach() loop.
                // For each trait being targeted by the filter, the filteredResults
                // array will then contain only the entries that contain the trait,
                // so at the end we'll have an array of animals that have every one 
                // of the traits when the .forEach() loop is finished.

                filteredResults= filteredResults.filter(
                    animal => animal.personalityTraits.indexOf(trait) !== -1);
            });
    }

    if (query.diet)
    {
        filteredResults= filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species)
    {
        filteredResults= filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name)
    {
        filteredResults= filteredResults.filter(animal => animal.name === query.name);
    }

    // return the filtered results:
    return filteredResults;
}

//function to get info based on the id
function findById(id, animalsArray)
{
    const result= animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

//function to add a new animal to the json file
function createNewAnimal(body, animalsArray)
{
    
    // our function's main code will go here!
    //add body to array
    const animal= body;
    animalsArray.push(animal);

    //write added animal to json file
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'), 
        JSON.stringify({animals: animalsArray}, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

//function to validate the data entered into the json file
function validateAnimal(animal)
{
    if (!animal.name || typeof animal.name !== 'string')
    {
        return false;
    }

    if (!animal.species || typeof animal.species !== 'string')
    {
        return false;
    }

    if (!animal.diet || typeof animal.diet !== 'string')
    {
        return false;
    }

    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits))
    {
        return false;
    }

    return true;
}


//retrieve data from the json file
app.get('/api/animals', (req, res) =>
{
    let results= animals;
    if (req.query)
    {
        results= filterByQuery(req.query, results);
    }
    
    res.json(results);
});

//retrieve data from the json file based on the id
app.get('/api/animals/:id', (req, res) => 
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
app.post('/api/animals', (req, res) => 
{
    // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id= animals.length.toString();

    // add animal to json file and animals array in this function
    // if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body))
    {
        res.status(400).send('The animal is not properly formatted.')
    }
    
    else
    {
        const animal= createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

//route for the index html file
app.get('/', (req, res) =>
{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//route for the animals html file
app.get('/animals', (req, res) => 
{
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

//route for the zookeepers html file
app.get('/zookeepers', (req, res)=> 
{
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//route to deal with unexpected requests, always make this route last
app.get('*', (req, res) =>
{
    res.sendFile(path.join(__dirname, './public/index.html'));
});


//port call to browser
app.listen(PORT, () => 
{
    console.log(`API server now onto port ${PORT}!`);
});