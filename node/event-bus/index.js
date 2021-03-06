const express = require('express');
const bodyparser = require("body-parser");
const axios = require('axios');
const app = express();

app.use(bodyparser.json());

var port = process.env.PORT || 3005;

app.post('/events',(req,res)=>{
        console.log('Se ha enviado un evento');
        const event = req.body;

        axios.post('http://localhost:3001/events', event);	//Front
        axios.post('http://localhost:3002/events', event);	//Citas
        axios.post('http://localhost:3003/events', event);	//Registro


        res.send({ status: 'OK' });
});

app.listen(port, () => {
    console.log(port);
});
