const mysql = require("mysql2");
const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const { Console } = require("console");
const { ENGINE_METHOD_NONE } = require("constants");
const router = express.Router();

const app = express();

const app2 = express();

var urlencodedParser = bodyparser.urlencoded({ extended: false });

//settings
app.use(bodyparser.json());
//app.use(express.static(__dirname + '/proyecto_node'));
app.use(express.static(__dirname + "/views/css"));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
//app.set('port', process.env.port || 3000);
var port = process.env.PORT || 3000;

var mysqlConnection = mysql.createConnection({
  // host: 'localhost',
  host: "104.155.165.28",
  user: "root",
  password: "prueba123",
  database: "prueba_erick",
  port: 3306,
});

mysqlConnection.connect((err) => {
  if (!err) console.log("DB Connected");
  else
    console.log(
      "DB Connection failed \n Error :" + JSON.stringify(err, undefined, 2)
    );
});

app.listen(port, () => {
  console.log(port);
});

////////////////login///////////////////////////////////
app.get("/login", (req, res) => {
  console.log("login");
  res.render("Acceder");
});
app.post("/login", urlencodedParser, (req, res) => {
  datos = req.body;
  console.log(datos.usuario, datos.contraseña);
  mysqlConnection.query(
    "SELECT * FROM persona WHERE email= ? AND contraseña=?",
    [datos.usuario, datos.contraseña],
    (err, rows) => {
      if (!err) {
        console.log("mysql rows");
        console.log(rows);
        if (rows[0].TipoUsuario == "paciente") {
          res.render("Pacientes_(Modificado)", {
            data: rows[0],
          });
          console.log("paciente");
        } else if (rows[0].TipoUsuario == "doctor") {
          res.render("Bienvenido_Doc_(Modificado)", {
            data: rows[0],
          });
          console.log("doctor");
        } else if (rows[0].TipoUsuario == "SysAdmin") {
          res.render("Sysadmin_(Modificado)", {
            data: rows[0],
          });
          console.log("Sys");
        } else if (rows[0].TipoUsuario == "Administrativo") {
          res.render("Bienvenido_Adm", {
            data: rows[0],
          });
          console.log("Adm");
        } else {
          res.render("Acceder", {
            data: datos,
          });
          console.log("otro");
        }
      } else console.log(err);
    }
  );
});

/////////////////busqueda de pacientes////////////////
app.get("/search", (req, res) => {
  console.log("busqueda");
  res.render("Busqueda_pacientes");
});
app.post("/search", urlencodedParser, (req, res) => {
  nombre = req.body;
  //console.log(nombre);
  var campos = nombre.busqueda.split(" ");
  mysqlConnection.query(
    'SELECT * FROM persona WHERE Nombre = ? AND  PrimerApellido = ?  AND  SegundoApellido = ? AND TipoUsuario = "paciente"',
    [campos[0], campos[1], campos[2]],
    (err, rows) => {
      if (!err) {
        console.log(rows);
        const datosPaciente = {
          datos: rows[0],
          tipo: "doctor",
        };
        res.render("Consulta_expediente", {
          data: datosPaciente,
        });
      } else {
        console.log(err);
      }
    }
  );
});
/////////ruta inicio//////////////////
app.get("/inicio", (req, res) => {
  console.log("inicio");
  res.render("Inicio");
});

/////////////agendar cita///////

app.get("/cita", (req, res) => {
  console.log("Agendar cita");
  res.render("Cita");
});

app.post("/cita", urlencodedParser, (req, res) => {
  data = req.body;
  console.log(data);
  //mysqlConnection.query('INSERT INTO prueba set ?',data,(err,rows)=>{
  // if(!err){
  // console.log(rows);

  // }
  // else
  // console.log(err);
  // })
});
/////////////////////rutas pantallas de usuarios
app.get("/admin", (req, res) => {
  console.log("admin");
  //res.render('Bienvenido_Adm');
  res.render("Bienvenido_Adm_(Modificado)");
});
// //////////////////
app.get("/paciente", urlencodedParser, (req, res) => {
  console.log("paciente");
  res.render("Pacientes_(Modificado)", {
    data: req.body,
  });
});

app.get("/paciente/:id", urlencodedParser, (req, res) => {
  id = req.params;
  console.log("paciente");
  mysqlConnection.query(
    "SELECT * FROM persona WHERE IDPersona =?",
    [id.id],
    (err, rows) => {
      if (!err) {
        console.log(rows[0]);
        res.render("Pacientes_(Modificado)", {
          data: rows[0],
        });
      } else {
        console.log(err);
      }
    }
  );

  // res.render('Pacientes_(Modificado)',{
  //     data:req.body
  // });
});
////////////////////

app.get("/doctor", (req, res) => {
  console.log("doctor");
  res.render("Bienvenido_Doc_(Modificado)", {
    datos: {},
  });
});
app.get("/sysadmin", (req, res) => {
  console.log("Sysadmin");
  res.render("Sysadmin_(Modificado)");
});

//////////rutas de registro de pacientes
//get
app.get("/registro1", (req, res) => {
  console.log("registro1");
  res.render("Registro_pacientes_1");
});

app.get("/registro2/:id", urlencodedParser, (req, res) => {
  id = req.params;
  console.log("id");
  console.log(id);
  mysqlConnection.query(
    "SELECT * FROM persona WHERE IDPersona=  ? ",
    [id.id],
    (err, rows) => {
      if (!err) {
        console.log("registro2");
        console.log(rows);
        res.render("Registro_2_(Modificado)", {
          data: id.id,
        });
      } else {
        console.log(err);
      }
    }
  );
  // console.log('get registro 2');
  // console.log(req.body)
  // res.render('Registro_2_(Modificado)');
});

app.get("/registro3/:id", urlencodedParser, (req, res) => {
  id = req.params;
  console.log(id)
  console.log("registro3");
  res.render("Registro_3_(Modificado)", {
    data: id.id,
  });
});

//post
app.post("/registro1", urlencodedParser, (req, res) => {
  info = req.body;
  console.log("info");
  console.log(info);
  fields = [
    [
      info.nombre,
      info.PrimerApellido,
      info.SegundoApellido,
      "paciente",
      info.FechaNacimiento,
      info.sexo,
      info.EstadoCivil,
      info.Telefono,
      info.email,
      "paciente",
    ],
  ];
  mysqlConnection.query(
    "INSERT INTO persona (Nombre,PrimerApellido,SegundoApellido,TipoUsuario,FechaNacimiento,Sexo,EstadoCivil,Celular,email,contraseña) VALUES ?",
    [fields],
    (err, rows) => {
      if (!err) {
        mysqlConnection.query(
          "SELECT * FROM persona WHERE Nombre=  ? AND PrimerApellido = ? AND SegundoApellido = ?  AND email = ?",
          [info.nombre, info.PrimerApellido, info.SegundoApellido, info.email],
          (err, rows) => {
            if (!err) {
              id = rows[0].IDPersona;
              datos = [[id, info.Direccion]];
              console.log("id");
              console.log(id);
              mysqlConnection.query(
                "INSERT INTO domicilio (IDPersona,Calle) VALUES ?",
                [datos],
                (err, rows) => {
                  if (!err) {
                    //res.render('Registro_2_(Modificado)')
                    res.redirect("/registro2/" + id);
                  } else {
                    console.log(err);
                  }
                }
              );
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log(err);
      }
    }
  );
});

app.post("/registro2/:id", urlencodedParser, (req, res) => {
  // console.log(req.body);
  id = req.params;
  datos = req.body;
  console.log("post2 id");
  console.log(id);
  console.log("post2 datos");
  console.log(datos);
  if (datos.historialfarma.length > 1) {
    hfarma = datos.historialfarma.join();
  } else {
    hfarma = datos.historialfarma;
  }
  if (datos.antecedentesfam.length > 1) {
    antfam = datos.antecedentesfam.join();
  } else {
    antfam = datos.antecedentesfam;
  }

  values = [[id.id, hfarma, datos.reaccionad, antfam]];
  mysqlConnection.query("INSERT INTO expediente (IDPersona,HistorialFarmacologico,ReaccionAdversaMed,AntecFam) VALUES ? ",[values],(err, rows) => {
      if (!err) {
        console.log("Antecedentes Familiares");
        console.log(rows);
        //res.render('Registro_3_(Modificado)');
        res.redirect("/registro3/" +id.id)
      }
       else {
        console.log(err);
      }
    }
  );
});

app.post("/registro3/:id", urlencodedParser, (req, res) => {
  console.log("registro3 post");
  console.log(req.body);
  id=req.params
  datos=req.body

  console.log(datos.AntecedentesPersonales.length)
    console.log("longitud datos")

  if (datos.AntecedentesPersonales.length > 1) {
    hfarma = datos.AntecedentesPersonales.join();
  } else {
    antper = datos.AntecedentesPersonales;
  }
  
 console.log("otros")
 console.log(datos.otros)

  if(datos.otros!=null){ 
  valores=[datos.AntecedentesPersonales,datos.otros]
  

    }
    else{
        valores=datos.AntecedentesPersonales   
    }

valores=valores.join();  

    mysqlConnection.query("UPDATE expediente SET AntecPerson = ? WHERE IDPersona= ? ",[valores,id.id],(err, rows) => {
        if(!err){

            console.log("Valores")
            console.log(rows)
          res.redirect("/Sysadmin");

        }
        else{
            console.log(err)
        }
 
    })

});

/////////////////prueba///////////////////////
app.get("/prueba", (req, res) => {
  const cp = 07562;
  datos = [[56, cp, "asdfasdfda"]];
  mysqlConnection.query(
    "INSERT INTO domicilio (domicilio.IDPersona,domicilio.CP,domicilio.Calle) VALUES ?",
    [datos],
    (err, rows) => {
      if (!err) {
        console.log(rows);
      } else {
        console.log(err);
      }
    }
  );
});

//////////////////////////////

//////////////ruta registro personal administrativo
app.get("/registro_padmin", urlencodedParser, (req, res) => {
  console.log("registro administrativos");
  dat = res.params;
  //console.log(dat)
  res.render("Registro_Personal_Administrativo");
});

app.post("/registro_padmin", urlencodedParser, (req, res) => {
  datos2 = [];
  const data = req.body;
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
  //console.log(datos)
  mysqlConnection.query(
    "INSERT INTO persona (Nombre,PrimerApellido,SegundoApellido,TipoUsuario,FechaNacimiento,Sexo,EstadoCivil,Celular,email,contraseña) VALUES ?",
    [datos],
    (err, rows) => {
      if (!err) {
        //console.log(rows);
        datos2 = rows;
      } else console.log(err);
    }
  );

  res.render("Registro_Personal_Administrativo", { dat: datos2 });
});

//////////////////ruta registro doctores///////////////////////////////////
app.get("/registro_doctor", (req, res) => {
  dat = res.params;
  console.log("registro doctores");
  res.render("Registro_Medicos");
});

app.post("/registro_doctor", urlencodedParser, (req, res) => {
  const data = req.body;
  //console.log(req.body);
  let datos = [
    [
      data.nombre,
      data.apellidopaterno,
      data.apellidomaterno,
      "doctor",
      data.fechanacimiento,
      0,
      "Soltero",
      "55778899",
      data.email,
      data.password,
    ],
  ];
  //console.log(datos)
  mysqlConnection.query(
    "INSERT INTO persona (Nombre,PrimerApellido,SegundoApellido,TipoUsuario,FechaNacimiento,Sexo,EstadoCivil,Celular,email,contraseña) VALUES ?",
    [datos],
    (err, rows) => {
      if (!err) {
        //console.log(rows);
      } else console.log(err);
    }
  );

  mysqlConnection.query(
    "SELECT * FROM persona WHERE Nombre = ? AND  PrimerApellido = ?  AND  SegundoApellido = ?",
    [data.nombre, data.apellidopaterno, data.apellidomaterno],
    (err, rows) => {
      // mysqlConnection.query('SELECT * FROM persona' ,(err,rows)=>{
      let datos2 = {};
      if (!err) {
        datos2 = [
          [data.cedula, rows[0].IDPersona, data.especialidad, data.turno],
        ];
        datos2 = [
          [data.cedula, rows[0].IDPersona, data.especialidad, data.turno],
        ];
        mysqlConnection.query(
          "INSERT INTO medico (Cedula,IDPersona,Especialidad,Turno) VALUES ?",
          [datos2],
          (err, rows) => {
            if (!err) {
              console.log(rows);
              datos3 = rows;
              res.render("Registro_Medicos", {
                dat: rows,
              });
            } else console.log(err);
          }
        );
      } else console.log(err);
    }
  );
  // res.render('Registro_Medicos',{
  //     dat:datos
  // });
});

/////////////////////////////ruta recetas//////////////////////////////////////
app.get("/recetas", (req, res) => {
  console.log("recetas");
  res.render("Generador_de_Recetas");
});

///////////////consulta de expediente///////////

app.get("/expediente", urlencodedParser, (req, res) => {
  data = req.body;
  console.log("expediente");
  console.log(data);
  mysqlConnection.query(
    "SELECT * FROM persona WHERE Nombre = ? AND  PrimerApellido = ?  AND  SegundoApellido = ?",
    [data.nombre, data.apellidopaterno, data.apellidomaterno],
    (err, rows) => {
      if (!err) {
        console.log(rows);
        const datosPaciente = {
          datos: rows[0],
          tipo: "doctor",
        };
        res.render("Consulta_expediente", {
          // data:rows[0]
          data: datosPaciente,
        });
      } else {
        console.log(err);
      }
    }
  );
});

app.get("/expediente/:id", urlencodedParser, (req, res) => {
  id = req.params;
  //data =req.body;
  console.log("expediente");
  //console.log(data)
  mysqlConnection.query(
    "SELECT * FROM persona WHERE IDPersona = ?",
    [id.id],
    (err, rows) => {
      if (!err) {
        console.log(rows);
        // const datosPaciente=[[rows[0]],['paciente']]
        const datosPaciente = {
          datos: rows[0],
          tipo: "paciente",
        };
        console.log("Paciente id");
        console.log(datosPaciente);
        res.render("Consulta_expediente", {
          //data:rows[0]
          data: datosPaciente,
        });
      } else {
        console.log(err);
      }
    }
  );
});

//consulta de usuarios

app.get("/mod", (req, res) => {
  console.log("consulta");
  res.render("Registro_Medicos_mod");
});

/////
app.post("/registro11", urlencodedParser, (req, res) => {
  const data = req.body;
  console.log(req.body);
  mysqlConnection.query("INSERT INTO prueba set ?", data, (err, rows) => {
    if (!err) {
      console.log(rows);
    } else console.log(err);
  });
  res.render("Registro_1");
});

//////CONSULTA
app.get("/consulta", urlencodedParser, (req, res) => {
  data = {};
  mysqlConnection.query("SELECT * FROM persona", (err, rows) => {
    if (!err) {
      // console.log('consulta');
      // console.log(rows)
      data = rows;
      //console.log(data[0].id)

      res.render("Consulta_usuarios", {
        datos: rows,
      });
    } else console.log(err);
    // res.render('Consulta_usuarios',{
    //     datos:data
    // })
  });
});

//////////////////////eliminar registros//////////////////////////////
app.get("/eliminar/:tipo/:id",urlencodedParser, (req, res) => {
  var id = req.params;
  console.log(id)
  if(id.tipo=="doctor"){
    mysqlConnection.query('DELETE FROM persona  WHERE persona.IDPersona= ?',[id.id],(err,rows, fields)=>{
    if(!err){
      console.log("Doctor elimminado")
      res.redirect("/consulta")
    }
    else{
      console.log(err)
    }
    
    })


  }
  else if(id.tipo=="paciente"){
    mysqlConnection.query('DELETE FROM persona  WHERE persona.IDPersona= ?',[id.id],(err,rows, fields)=>{
      if(!err){
        console.log("Paciente elimminado")
        res.redirect("/consulta")
      }
      else{
        console.log(err)
      }
      
      })


  }
  else{
    mysqlConnection.query('DELETE FROM persona  WHERE persona.IDPersona= ?',[id.id],(err,rows, fields)=>{
      if(!err){
        console.log("Personal administrativo elimminado")
        res.redirect("/consulta")
      }
      else{
        console.log(err)
      }
      
      })


  }
  //mysqlConnection.query('INSERT INTO pacientte (nombre,edad,comentarios) VALUES("Laura","32","bonjour")',(err,rows, fields)=>{
  // mysqlConnection.query(
  //   "DELETE FROM persona WHERE IDPersona = ?",
  //   [id.id],
  //   (err, rows) => {
  //     if (!err) {
  //       //console.log('Registro' ,id.id,'Eliminado');
  //       //res.redirect('/consulta1');
  //       // res.render("Consulta_usuarios");
  //       res.redirect("/consulta")
  //       //     data=rows
  //       //     console.log(data[0].id)
  //     } else console.log(err);

  //     // res.render("Consulta_usuarios");
  //   }
  // );
});

/////////////////////////////Modificar medicos////////////////////////////////
/////ver registro
app.get("/modificar_doctor/:id", (req, res) => {
  console.log("modificar doctor");
  const id = req.params;
  datos = {};
  //mysqlConnection.query('SELECT * FROM persona WHERE IDPersona = ?',id.id,(err,rows)=>{
  mysqlConnection.query(
    "SELECT persona.IDPersona,persona.Nombre,persona.PrimerApellido,persona.SegundoApellido,persona.email,persona.FechaNacimiento,persona.contraseña,medico.Cedula,especialidad.Especialidad,turno.Turno from persona inner join medico on persona.IDPersona= medico.IDPersona inner join especialidad on IDEspecialidad=medico.Especialidad inner join turno on medico.Turno=turno.IDTurno Where persona.IDPersona =?",
    id.id,
    (err, rows) => {
      if (!err) {
        datos = rows;
        console.log(datos);
      } else {
        console.log(err);
      }
      res.render("Registro_Medicos_mod", {
        data: datos[0],
      });
    }
  );
});

//modificar
app.post("/modificar_doctor/:id", urlencodedParser, (req, res) => {
  var id = req.params;
  data = req.body;
  datos = {};
  banner = "mod";
  //console.log("post mod-doctor")
  //console.log(data)
  datos = [
    [
      data.nombre,
      data.apellidopaterno,
      data.apellidomaterno,
      data.email,
      data.especialidad,
      data.fechanacimiento,
      data.cedula,
      data.turno,
      data.password,
      id.id,
    ],
  ];
  datos2 = [["Lopez", 1, 40]];
  console.log("Arreglo");
  console.log(datos2);
  //mysqlConnection.query('INSERT INTO pacientte (nombre,edad,comentarios) VALUES("Laura","32","bonjour")',(err,rows, fields)=>{
  mysqlConnection.query(
    "UPDATE persona INNER JOIN medico ON persona.IDPersona = medico.IDPersona SET persona.Nombre= ?,persona.PrimerApellido = ?,persona.SegundoApellido= ? ,persona.email=?,persona.FechaNacimiento=? ,persona.contraseña=?, medico.Especialidad=?,medico.Cedula=?,medico.Turno=? WHERE persona.IDPersona=?",
    [
      data.nombre,
      data.apellidopaterno,
      data.apellidomaterno,
      data.email,
      data.fechanacimiento,
      data.password,
      data.especialidad,
      data.cedula,
      data.turno,
      id.id,
    ],
    (err, rows) => {
      //mysqlConnection.query('UPDATE persona INNER JOIN medico ON persona.IDPersona=medico.IDPersona SET persona.PrimerApellido = ?, medico.Turno= ? WHERE persona.IDPersona= ?',[data.nombre,data.apellidopaterno,data.apellidomaterno,data.email,data.especialidad,data.fechanacimiento,data.cedula,data.turno,data.password,id.id],(err,rows, fields)=>{
      if (!err) {
        console.log(rows);
        data = rows;
        //console.log(data[0].id)
        res.render("Registro_Medicos_mod", {
          data: rows,
        });
      } else console.log(err);
    }
  );
});

/////////////////////////////Modificar personal administrativo////////////////////////////////
/////ver registro
app.get("/modificar_admin/:id", (req, res) => {
  const id = req.params;
  datos = {};
  mysqlConnection.query(
    "SELECT * FROM persona WHERE IDPersona = ?",
    id.id,
    (err, rows) => {
      //mysqlConnection.query('select persona.IDPersona,persona.Nombre,persona.PrimerApellido,persona.SegundoApellido,persona.email,persona.FechaNacimiento,persona.contraseña,medico.Cedula,especialidad.Especialidad,turno.Turno from persona inner join medico on persona.IDPersona= medico.IDPersona inner join especialidad on IDEspecialidad=medico.Especialidad inner join turno on medico.Turno=turno.IDTurno Where persona.IDPersona =?',id.id,(err,rows)=>{

      if (!err) {
        datos = rows;
        console.log(datos);
        res.render("Registro_Padmin_mod", {
          data: datos[0],
        });
      } else console.log(err);
    }
  );
});

//modificar
app.post("/modificar_admin/:id", urlencodedParser, (req, res) => {
  var id = req.params;
  data = req.body;
  datos = {};
  //console.log("post mod-doctor")
  console.log(data);
  //mysqlConnection.query('INSERT INTO pacientte (nombre,edad,comentarios) VALUES("Laura","32","bonjour")',(err,rows, fields)=>{
  mysqlConnection.query(
    "UPDATE persona  SET persona.Nombre= ?,persona.PrimerApellido = ?,persona.SegundoApellido= ? ,persona.TipoUsuario = ?,persona.FechaNacimiento=?,persona.email=? ,persona.contraseña=? WHERE persona.IDPersona=?",
    [
      data.nombre,
      data.apellidopaterno,
      data.apellidomaterno,
      data.TipoUsuario,
      data.fechanacimiento,
      data.email,
      data.password,
      id.id,
    ],
    (err, rows) => {
      //mysqlConnection.query('UPDATE persona INNER JOIN medico ON persona.IDPersona=medico.IDPersona SET persona.PrimerApellido = ?, medico.Turno= ? WHERE persona.IDPersona= ?',[data.nombre,data.apellidopaterno,data.apellidomaterno,data.email,data.especialidad,data.fechanacimiento,data.cedula,data.turno,data.password,id.id],(err,rows, fields)=>{
      if (!err) {
        console.log(rows);
        data = rows;
        //console.log(data[0].id)
        res.render("Registro_Padmin_mod", {
          data: rows,
        });
      } else console.log(err);
    }
  );
});


////////////////////////modificar pacientes////////

app.get("/modificar_paciente/:id",urlencodedParser, (req,res) =>{
  id=req.params

  mysqlConnection.query("SELECT * from persona inner join domicilio on  persona.IDPersona =domicilio.IDPersona where persona.IDPersona=?",[id.id],(err,rows)=>{

    if(!err){
      // console.log("update paciente")
      // console.log(rows[0])
      res.render("Registro_1_modificar",{
        data:rows[0]
      })
    }
    else{
      console.log(err)
    }

  })
});

app.get("/modificar_paciente2/:id",urlencodedParser, (req,res) =>{
  id=req.params
  res.render("Registro_2_modificar",{
    data:id
  })

});

app.get("/modificar_paciente3/:id",urlencodedParser, (req,res) =>{
  id=req.params

  res.render("Registro_3_modificar",{
    data:id
  })

});

app.post("/modificar_paciente/:id",urlencodedParser,(req,res)=>{
  id=req.params
  datos=req.body
  console.log("datos modificar1")
  console.log(datos)

  mysqlConnection.query("UPDATE persona,domicilio SET persona.Nombre= ?,persona.PrimerApellido = ?,persona.SegundoApellido= ? ,persona.FechaNacimiento=?,persona.Sexo=?,persona.EstadoCivil=?,persona.email=? ,domicilio.Calle = ? WHERE persona.IDPersona=? AND domicilio.IDPersona= ? ",
  
  [
  datos.Nombre,
  datos.ApellidoPaterno,
  datos.ApellidoMaterno,
  datos.FechaNacimiento,
  datos.sexo,
  datos.EstadoCivil,
  datos.email,
  datos.Direccion,
  id.id,
  id.id

  ],(err,rows)=>{

    if(!err){
      console.log("moficicacion correcta")
      res.redirect("/modificar_paciente2/" + id.id)
    }
    else{
      console.log(err)
    }

  });

});

app.post("/modificar_paciente2/:id",urlencodedParser,(req,res)=>{
  id=req.params
  datos=req.body
  console.log("datos modificar2")
  console.log(datos)
  hfarma=[datos.HistorialFarma]
  antfam=[datos.AntecedentesFam]


  if (hfarma.length > 1) {
    hfarma = hfarma.join();
  }
  else{
    hfarma=hfarma[0]
  }

  if (antfam.length > 1) {
    antfam = antfam.join();
  } 
  else{
    antfam=antfam[0]
  }


  console.log("hfarma")
  console.log(hfarma)
  console.log("antecedentesfam")
  console.log(antfam)
  console.log("reacc")
  console.log(datos.ReaccionAdversa)
 
  mysqlConnection.query("UPDATE expediente SET expediente.AntecFam = ?,expediente.ReaccionAdversaMed = ?, expediente.HistorialFarmacologico = ? WHERE expediente.IDPersona=? ",
  
  [
    antfam[0],
    datos.ReaccionAdversa,
    hfarma[0],
    id.id

  ],(err,rows)=>{
    if(!err){
      console.log("moficicacion correcta")
      res.redirect("/modificar_paciente3/" + id.id)
    }
    else{
      console.log(err)
    }
  });
});

app.post("/modificar_paciente3/:id",urlencodedParser,(req,res)=>{
  id=req.params
  datos=req.body
  console.log("datos modificar3")
  console.log(datos)
  antper=[datos.AntecedentesPers]
  console.log("antper lista")
  console.log(antper)

    if(datos.otros!=null){
      console.log("otro")
      console.log(datos.otros)
    
      antper.push(datos.otros)
      antper = [antper.join()]

    }
  
  // if (antfam.length > 1) {
  //   antfam = antfam.join();
  // } 

  console.log("antper")
  console.log(antper)
  console.log("id")
  console.log(id.id)
 
  mysqlConnection.query("UPDATE expediente SET expediente.AntecPerson = ? WHERE expediente.IDPersona=? ",
  
  [
    antper[0],
    id.id

  ],(err,rows)=>{
    if(!err){
      console.log("moficicacion correcta")
      // res.redirect("/modificar_paciente3/"+ id.id)
      res.redirect("/consulta")
    }
    else{
      console.log(err)
    }
  });
});