const path= require('path');
const router= require('express').Router();

//route for the index html file
router.get("/", (req, res) =>
{
    res.sendFile(path.join(__dirname, "../../public/index.html"));
});

//route for the animals html file
router.get("/animals", (req, res) => 
{
    res.sendFile(path.join(__dirname, "../../public/animals.html"));
});

//route for the zookeepers html file
router.get("/zookeepers", (req, res)=> 
{
    res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
});

//route to deal with unexpected requests, always make this route last
router.get("*", (req, res) =>
{
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});


module.exports= router;