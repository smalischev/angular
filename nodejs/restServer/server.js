var express = require("express");
var cors = require('cors')
var app3000 = express();
var app3001 = express();


app3000.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app3001.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}))

//create a server object:
app3000.listen(3000, () => {
  console.log("Server running on port 3000");
 });

 app3001.listen(3001, () => {
  console.log("Server running on port 3001");
 });
 var counterSaved;
 var timer;
 async function response(res){
  timer = setTimeout(() => {
    res.status(500).send({ error: `${counterSaved}` })
    counter++;
    clearTimeout(timer);
  }, 10 * 1000);
 }

var counter = 0;
var error = true;
app3000.get("/url", (req, res, next) => {
  console.log("request arrived 3000");
  console.log("counter: " + counter);
  counterSaved = counter;
  if (error) {
    response(res);
  }
  else {
    res.json(counter);
    counter++;
  }

  error = !error;
  
});

app3001.get("/url", (req, res, next) => {
  console.log("request arrived 3001");
  console.log("counter: " + counter);
    res.json(counter);
    counter++;
 });