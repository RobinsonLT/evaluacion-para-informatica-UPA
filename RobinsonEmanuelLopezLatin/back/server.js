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
    password:'Ujsd#hfQ@s_15',
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

        const query='INSERT INTO usuario (nombre, fecha, telefono, correo, creacion, EstadoUsuarioid) VALUES ("'+name+'",DATE_FORMAT("'+fecha_nacimiento+'", "%Y-%m-%d %H:%i:%s"),"'+telefono+'","'+correo+'",NOW(),"'+estado+'")';

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


app.post("/ejecutar_reporte/:reporte",(req, res)=>{
    const {reporte}=req.params;

    if(!reporte){//valida si existe el codigo
        return res.status(500).json({status:'Error', datos:'Ocurrio un error inesperado.'});
    }

    switch(reporte){
        case "all_usuarios"://ingresa al reporte de todos los usuarios
            reporte_usuarios(res);
            break;
        case "usuarios_hoy"://ingresa al reporte de usuarios registrados hoy
            reporte_usuariosHoy(res);
            break;
        case "usuarios_ayer":// entra al reporte de usuarios registrados ayer
            reporte_usuariosAyer(res);
            break;
        default:
            res.status(500).json({status: 'error', datos:'Ocurrio un error inesperado'});
    }

});


const reporte_usuarios=(res)=>{//usuarios registrados
    let query="SELECT usuario.*, estadousuario.titulo , DATE_FORMAT(usuario.fecha, '%d/%m/%Y') AS fecha_format, DATE_FORMAT(usuario.creacion, '%d/%m/%Y') AS creacion_format FROM usuario INNER JOIN estadousuario ON usuario.EstadoUsuarioid=estadousuario.id";
    let param = [];
    db.query(query,param,(err, result)=>{
        if(err){
            console.error('error al ejecutar el reporte', err);
            return res.status(500).json({status:'error', datos:'Error al ejecutar el reporte'});
        }
        res.json({status:'ok', datos:result});
    });
};

const reporte_usuariosHoy=(res)=>{//usuarios registrados hoy
    let query="SELECT usuario.*, estadousuario.titulo , DATE_FORMAT(usuario.fecha, '%d/%m/%Y') AS fecha_format, DATE_FORMAT(usuario.creacion, '%d/%m/%Y') AS creacion_format FROM usuario INNER JOIN estadousuario ON usuario.EstadoUsuarioid=estadousuario.id WHERE DATE(creacion)=CURDATE()";
   
    db.query(query, (err, result)=>{
        if(err){
            console.error('Error al ejecutar el reporte de usuarios Hoy.');
            return res.status(500).json({status:'error', datos:'Error al ejecutar el reporte de usuarios Hoy'});
        }
        res.json({status:'ok', datos:result});
    });
};

const reporte_usuariosAyer=(res)=>{//usuarios registrados ayer
    let query="SELECT usuario.*, estadousuario.titulo , DATE_FORMAT(usuario.fecha, '%d/%m/%Y') AS fecha_format, DATE_FORMAT(usuario.creacion, '%d/%m/%Y') AS creacion_format FROM usuario LEFT JOIN estadousuario ON usuario.EstadoUsuarioid=estadousuario.id WHERE DATE(creacion) = CURDATE()- INTERVAL 1 DAY";

    db.query(query, (err, result)=>{
        if(err){
            console.error('error al ejecutar el reporte usuarios ayer');
            return res.status(500).json({status:'error', datos:result});
        }
        res.json({status:'ok', datos: result});
    });
};;


app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});