const mysql = require("mysql2");
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
var port = process.env.PORT || 3003;

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "clinica_maya",
    port: 3306
 });

 mysqlConnection.connect((err) =>{
    if(!err)
        console.log("DB Connected");
    else
        console.log("DB Connection failed \n Error :"+ JSON.stringify(err,undefined,2));
 });

 

app.get('/registros',(req,res)=>{   //==========Mandar Get eventos
        console.log('registros');
        res.send(posts);         
});

app.post('/registros', urlencodedParser, async (req,res)=>{ //===========Mandar Post de eventos
        console.log('Enviando eventos registros...');
        const id = randomBytes(4).toString('hex');
        datos2 = [];
        const { data } = req.body;
        console.log(req.body);
          let datos = [
            [
              data.nombre,
              data.apellidopaterno,
              data.apellidomaterno,
              data.TipoUsuario,
              data.fechanacimiento,
              0,
              "Soltero",
              "55778899",
              data.email,
              data.password,
            ],
          ];        

        posts[id] = {
            id, data
        };

        await axios.post('http://localhost:3005/events', {
            type: 'DatosRegistro',
            data: {
                id, data
            }
        });
});


app.post('/events',(req,res)=>{ //==============================Recibir eventos
    console.log('Se recibió el evento:', req.body.type);
    var datos = req.body;
    console.log('Se recibieron los datos:', datos.data.datos);

    mysqlConnection.query(
    "INSERT INTO persona (Nombre,PrimerApellido,SegundoApellido,TipoUsuario,FechaNacimiento,Sexo,EstadoCivil,Celular,email,contraseña) VALUES ?",
    [datos.data.datos],
    (err, rows) => {
      if (!err) {
        console.log(rows);
        datos2 = rows;
      } else console.log(err);
    }
  );
    res.send({});             
});

app.listen(port, () => {
    console.log(port);
});
