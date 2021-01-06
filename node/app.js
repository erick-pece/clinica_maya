const mysql = require("mysql2");
const express = require("express");
const bodyparser = require("body-parser");
const path= require('path');
const { Console } = require("console");
const router =express.Router();

const app = express();

const app2= express();

var urlencodedParser = bodyparser.urlencoded({ extended: false })

//settings
app.use(bodyparser.json());
//app.use(express.static(__dirname + '/proyecto_node'));
app.use(express.static(__dirname + '/views/css'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs');
//app.set('port', process.env.port || 3000);
var port = process.env.PORT || 3000;
const posts = {};

 var mysqlConnection = mysql.createConnection({
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
 });

 app.listen(port, () => {
    console.log(port);
});




app.get('/dat',(req,res) =>{
    mysqlConnection.query('SELECT * FROM pacientte',(err,rows, fields)=>{
        if(!err){
        console.log(rows);
        
        }
        else
        console.log(err);
    })
    res.redirect('index.html');
});

  app.get('/',(req,res)=>{
      console.log('ejecutando la raiz');
      //res.render('index');
      res.render('inicio');

  });
//login
app.get('/login',(req,res)=>{
    console.log('login');
    res.render('Acceder');
});

//ruta inicio
app.get('/inicio',(req,res)=>{
    console.log('inicio');
    res.render('Inicio');
});

//rutas pantallas de usuarios
 app.get('/admin',(req,res)=>{
    console.log('admin');
    res.render('Bienvenido_Adm');
});

app.get('/paciente',(req,res)=>{
    console.log('paciente');
    res.render('Pacientes');
});

app.get('/doctor',(req,res)=>{
    console.log('doctor');
    res.render('Personal_Medico');
});
app.get('/sysadmin',(req,res)=>{
    console.log('prueba');
    res.render('Sysadmin');
});


//rutas de registro de pacientes
    //get
        app.get('/registro1',(req,res)=>{
            console.log('registro1');
            res.render('Registro_1');
        });
        app.get('/registro2',(req,res)=>{
            console.log('get registro 2');
            res.render('Registro_2');
        });
        app.get('/registro3',(req,res)=>{
            console.log('registro13');
            res.render('Registro_3');
        });


    //post
        app.post('/registro1',urlencodedParser,(req,res)=>{
            console.log(req.body)
            console.log('registro1');
            //res.render('Registro_2');
        });
        app.post('/registro2',urlencodedParser,(req,res)=>{
            console.log(req.body);
            data = req.body;
            console.log(data.nombre)
            res.render('Registro_2');
        });
        app.post('/registro3',urlencodedParser,(req,res)=>{
            console.log('registro3');
            console.log(req.body);
            res.render('Registro_3');
        });




//////////////ruta registro personal administrativo
app.get('/registro_padmin',urlencodedParser,(req,res)=>{
    console.log('registro administrativos');
    dat=res.params
    //console.log(dat)
    res.render('Registro_Personal_Administrativo');
});

app.post('/registro_padmin',urlencodedParser,(req,res) =>{
    datos2=[]
    const data =req.body;
    console.log(req.body);
    let datos=[[data.nombre,data.apellidopaterno,data.apellidomaterno,data.TipoUsuario,data.fechanacimiento,0,'Soltero','55778899',data.email,data.password]]
    //console.log(datos)
    mysqlConnection.query('INSERT INTO persona (Nombre,PrimerApellido,SegundoApellido,TipoUsuario,FechaNacimiento,Sexo,EstadoCivil,Celular,email,contraseña) VALUES ?',[datos],(err,rows)=>{  
       if(!err){
        //console.log(rows);
        datos2=rows
       }
       else
       console.log(err);
    })

    res.render('Registro_Personal_Administrativo',{dat:datos2});

 });


////////////ruta registro doctores
app.get('/registro_doctor',(req,res)=>{
    dat=res.params
    console.log('registro doctores');
    res.render('Registro_Medicos');
});

app.post('/registro_doctor',urlencodedParser,(req,res) =>{
    const data =req.body;
    //console.log(req.body);
    let datos=[[data.nombre,data.apellidopaterno,data.apellidomaterno,'doctor',data.fechanacimiento,0,'Soltero','55778899',data.email,data.password]]
    //console.log(datos)
    mysqlConnection.query('INSERT INTO persona (Nombre,PrimerApellido,SegundoApellido,TipoUsuario,FechaNacimiento,Sexo,EstadoCivil,Celular,email,contraseña) VALUES ?',[datos],(err,rows)=>{  
        if(!err){
        //console.log(rows);
        }
        else
        console.log(err);
    })

    mysqlConnection.query('SELECT * FROM persona WHERE Nombre = ? AND  PrimerApellido = ?  AND  SegundoApellido = ?',[data.nombre,data.apellidopaterno,data.apellidomaterno] ,(err,rows)=>{ 
        // mysqlConnection.query('SELECT * FROM persona' ,(err,rows)=>{  
        let datos2={}
        if(!err){

            datos2=[[data.cedula,rows[0].IDPersona,data.especialidad,data.turno]]
            datos2=[[data.cedula,rows[0].IDPersona,data.especialidad,1]]
            mysqlConnection.query('INSERT INTO medico (Cedula,IDPersona,Especialidad,Turno) VALUES ?',[datos2],(err,rows)=>{  
            if(!err){
            //console.log(rows);
            datos3=rows
            }
            else
            console.log(err);
            })

        }
        else
        console.log(err);
    })
    res.render('Registro_Medicos',{
        dat:datos
    });

 });

///////////////ruta recetas
app.get('/recetas',(req,res)=>{
    console.log('prueba');
    res.render('Generador_Recetas');
});

//consulta de usuarios

app.get('/mod',(req,res)=>{
    console.log('consulta');
    res.render('Registro_Medicos_mod');
});



/////
 app.post('/registro11',urlencodedParser,(req,res) =>{
    const data =req.body;
    console.log(req.body);
    mysqlConnection.query('INSERT INTO prueba set ?',data,(err,rows)=>{  
        if(!err){
        console.log(rows);
        
        }
        else
        console.log(err);
    })
    res.render('Registro_1');

 });

 //////CONSULTA
 app.get('/consulta1',urlencodedParser,(req,res) =>{
    data={};
    mysqlConnection.query('SELECT * FROM persona',(err,rows)=>{  
        if(!err){
        console.log('consulta');
      //  console.log(rows)
        data=rows
        //console.log(data[0].id)    
        }
        else
        console.log(err);
    res.render('Consulta_usuarios',{
        datos:data
    })
    });

 });

 //eliminar registro
 app.get('/eliminar/:id',(req,res) =>{
    var id =req.params;
 

    //mysqlConnection.query('INSERT INTO pacientte (nombre,edad,comentarios) VALUES("Laura","32","bonjour")',(err,rows, fields)=>{
     mysqlConnection.query('DELETE FROM persona WHERE IDPersona = ?',id.id,(err,rows)=>{  
        
        if(!err){
        //console.log('Registro' ,id.id,'Eliminado');
        res.redirect('/consulta1');
    //     data=rows
    //     console.log(data[0].id)    
        }
        else
        console.log(err);

 
    //res.render('Consulta_usuarios')
  
    });

 });


 //Modificar medicos
    /////ver registro
        app.get('/modificar_doctor/:id',(req,res) =>{
            const id = req.params
            datos={};
            mysqlConnection.query('SELECT * FROM persona WHERE IDPersona = ?',id.id,(err,rows)=>{  
                
                if(!err){
                //console.log(rows);
                datos=rows;
                console.log(datos)
                res.render('Registro_Medicos_mod',{
                    data:datos
                  })
                }
                else
                console.log(err);
            })
        //     res.render('Registro_Medicos_mod',{
        //         data:datos
        // })
        });

            //modificar
        app.post('/modificar/:',urlencodedParser,(req,res) =>{
            data={};
            //mysqlConnection.query('INSERT INTO pacientte (nombre,edad,comentarios) VALUES("Laura","32","bonjour")',(err,rows, fields)=>{
            mysqlConnection.query('SELECT * FROM prueba',(err,rows)=>{  
                
                if(!err){
                //console.log(rows);
                data=rows
                //console.log(data[0].id)    
                }
                else
                console.log(err);
                
            res.render('Consulta_usuarios',{
                datos:data
            })
            });

        });