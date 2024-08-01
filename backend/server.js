const express = require('express');

const app = express()

app.get('/',(req,res) => {
    res.send('Server is ready')
})

app.get('/twitter',(req,res) => {
    res.send('are you ready')
})
//get the list of five jokes

const port = process.env.PORT||3000;

app.listen(port ,() => {
    console.log(`server is running at ${port}`)
});
