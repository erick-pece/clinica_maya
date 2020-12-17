const mysql = require("mysql2");
const express = require("express");
const bodyparser = require("body-parser");
const path= require('path');
const router =express.Router();

const app = express();

var urlencodedParser = bodyparser.urlencoded({ extended: false })

//settings
app.use(bodyparser.json());
//app.use(express.static(__dirname + '/proyecto_node'));
app.use(express.static(__dirname + '/views/css'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
//app.set('port', process.env.port || 3000);

 var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zimbarawr1466',
    database: 'clinica',
    port: 3306
 });

 mysqlConnection.connect((err) =>{
    if(!err)
        console.log("DB Connected");
    else
        console.log("DB Connection failed \n Error :"+ JSON.stringify(err,undefined,2));
 });

 app.listen(3000, () => {
    console.log('Server on port 3000');
});

app.get('/data',(req,res) =>{
    mysqlConnection.query('SELECT * FROM pacientte',(err,rows, fields)=>{
        if(!err){
        console.log(rows);
        
        }
        else
        console.log(err);
    })
    res.redirect('index.html');
});

//  app.get('/',(req,res)=>{
//      console.log('prueba');
//      res.render('index');

//  });


//rutas pantallas
 app.get('/admin',(req,res)=>{
    console.log('prueba');
    res.render('Bienvenido_Adm');
});

app.get('/paciente',(req,res)=>{
    console.log('prueba');
    res.render('Pacientes');
});

app.get('/doctor',(req,res)=>{
    console.log('prueba');
    res.render('Personal_Medico');
});

app.get('/registro1',(req,res)=>{
    console.log('prueba');
    res.render('Registro_1');
});

app.get('/sysadmin',(req,res)=>{
    console.log('prueba');
    res.render('Sysadmin');
});

app.get('/registro2',(req,res)=>{
    console.log('prueba');
    res.render('Registro_2');
});

app.get('/registro3',(req,res)=>{
    console.log('prueba');
    res.render('Registro_3');
});

app.get('/registro_padmin',(req,res)=>{
    console.log('prueba');
    res.render('Registro_Personal_Administrativo');
});


/////
 app.post('/new',urlencodedParser,(req,res) =>{
    const data =req.body;
    console.log(req.body);
    //mysqlConnection.query('INSERT INTO pacientte (nombre,edad,comentarios) VALUES("Laura","32","bonjour")',(err,rows, fields)=>{
    mysqlConnection.query('INSERT INTO pacientte set ?',data,(err,rows)=>{  
        if(!err){
        console.log(rows);
        
        }
        else
        console.log(err);
    })
    res.render('index');

 })
