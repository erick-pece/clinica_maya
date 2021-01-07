//const mysql = require("mysql2");
const express = require('express');
const bodyparser = require("body-parser");
const path= require('path');
const { Console } = require("console");
const router = express.Router();
const app = express();
const posts = {};
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

var urlencodedParser = bodyparser.urlencoded({ extended: false })

//settings
app.use(bodyparser.json());
app.use(cors());
//app.use(express.static(__dirname + '/proyecto_node'));
app.use(express.static(__dirname + '/views/css'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
var port = process.env.PORT || 3002;


/*var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //password: 'zimbarawr1466',
    password: 'admin',
    database: 'clinica_maya',
    port: 3306
 });

 mysqlConnection.connect((err) =>{
    if(!err)
        console.log("DB Connected");
    else
        console.log("DB Connection failed \n Error :"+ JSON.stringify(err,undefined,2));
 });*/
//=====================================================Citas
/*app.get('/citas',(req,res)=>{   //==========Mandar Get eventos
        console.log('get citas');
        res.send(posts);         
});

app.post('/citas', async (req,res)=>{   //===================Mandar posts eventos
        console.log('post citas');
        const id = randomBytes(4).toString('hex');
        const { n_paciente } = req.body;
        const { medico } = req.body;
        const { f_cita } = req.body;

        posts[id] = {
            id, n_paciente, medico, f_cita
        };

        await axios.post('http://localhost:3005/events', {
            type: 'QueryResult',
            data: {
                id, n_paciente, medico, f_cita
            }
        });

        res.status(201).send(posts[id]);
});*/

app.post('/events',(req,res)=>{ //==============================Recibir eventos
    console.log('Se recibió el evento:', req.body.type);
    console.log('Se recibieron los datos:', req.body);
    res.send({});         
});

app.listen(port, () => {
    console.log(port);
});



