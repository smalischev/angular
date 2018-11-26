var express = require("express");
var cors = require('cors')
var app = express();


app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}))

//create a server object:
app.listen(3000, () => {
  console.log("Server running on port 3000");
 });

var counter = 0;
var timer;
app.get("/url", (req, res, next) => {
  
  if (counter % 3 === 0){
    timer = setTimeout(() => {
      res.status(500).send({ error: `${counter}` })
      counter++,
      clearTimeout(timer);
    }, 10 * 1000);
  }
  else {
    res.json(counter);
    counter++;
  }
  
 });


app.get('/error', (req, res, next) => {
  counter === 0 ? res.status(500).send({ error: 'Something failed!' }) : res.json(["Tony","Lisa","Michael","Ginger","Food"]); 
  counter++;
});