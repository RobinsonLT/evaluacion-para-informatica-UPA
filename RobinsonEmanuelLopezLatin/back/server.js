const express=require("express");
const cors= require("cors");
const bodyParser=require("body-parser");
const mysql=require('mysql2');

const app=express();
const PORT=3000;

//conexion a la base de datos
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'evaluacion_robinson'
});
//se verifica la conexion
db.connect((err)=>{
    if(err){
        console.error('error al conectar la db');
        return;
    }
    console.log('conexion a db exitosa');
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.post("/guardar_usuario",(req, res)=>{
    const {name, correo, telefono, edad, fecha_nacimiento}= req.body;

    if(!name || !correo || !telefono || !edad || !fecha_nacimiento){//valida si los campos nombre, fecha, telefono, correo existen
        return res.json({status:'error', mensaje: 'Faltan datos'});
    }else{

        let letras=/^[a-zA-Z]+$/;
        if(!letras.test(name) || name==''){//valida si el nombre solo contiene letras a-Z
            return res.json({status:'error', mensaje: 'El nombre solo debe contener letras de minusculas o mayusculas'});
        }
        let numero=/^[0-9]+$/;
        if(!numero.test(telefono) || telefono==''){
            return res.json({status: 'error', mensaje: 'El teléfono solo puede contener numeros del 0-9'});
        }

        let val_correo=new RegExp('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}');
        if(!val_correo.test(correo) || correo==''){
            return res.json({status: 'error', mensaje: 'El correo debe ser veridico'});
        }

        if(edad<18){//valida edad si es mayor o menos de edad
            return res.json({status: 'error', mensaje: 'El usuario no es mayor de edad'});
        }
        if(edad>100){
            return res.json({status:'error', mensaje:'El usuario es demasiado mayor'});
        }

        let estado=1;//estado activo
        let fecha_actual=new Date();

        const query='INSERT INTO usuario (nombre, fecha, telefono, correo, creacion, EstadoUsuarioid) VALUES ("'+name+'","'+fecha_nacimiento+'","'+telefono+'","'+correo+'","'+fecha_actual+'","'+estado+'")';

        db.query(query,(err, result)=>{
            if(err){
                console.error('error al guardar el usuario', err);
                return res.json({status:'error', mensaje: 'Error al registrar el usuario'});
            }
            let usuarioId=result.insertId;
            res.json({status:'ok', mensaje: 'Usuario guardado correctamente su ID: '+usuarioId});
        });
    }

});

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});