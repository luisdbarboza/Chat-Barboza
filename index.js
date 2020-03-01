//servidor
const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//configura el puerto
app.set('port', process.env.PORT || 4000);

//Envia los archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));


let contadorUsuarios = 0;
let username;
let usersData = [];//almacena los datos(nombre, id) de usuarios conectados

io.on('connection', (socket) => {

    contadorUsuarios += 1; 

    
    //guarda los datos de los usuarios conectados al chat
    socket.on('username&ID', (username)=>{
        usersData.push({
            id: socket.id,
            nombreUsuario: username
        });

        socket.join(`${username}`);//cada usuario tiene su propia sala de chat privada

        //sirve para notificar sobre los usuarios que se conectan al sistema    
        io.emit('newConnection', contadorUsuarios, usersData);
    });
    

    //ENVIA MENSAJES
    socket.on('mensajes', (datos) => {
        //añade la hora a la que se envio el mensaje
        let fecha = new Date();
        let hora = fecha.getHours();
        let minutos = fecha.getMinutes();

        datos.hora = hora;
        datos.minutos = minutos;

        io.emit('mensajes', datos);
    });

    //ENVIA MENSAJES PRIVADOS
    socket.on('mensajes-priv', (datos, receptor) => {
        socket.join(`${receptor}`);
        //envia un mensaje a la sala con el nombre del receptor
        io.in(`${receptor}`).emit('mensajes-priv', datos, receptor);

        socket.leave(`${receptor}`);
    });

    //OBTIENE LAS IMAGENES
    socket.on('subir-imagen', (imagen, username) => {
        //crea un writeStream para subir el archivo al servidor
        let writer = fs.createWriteStream(path.join(__dirname, 'public/img/' + imagen.nombre), {encoding: 'base64'});

        writer.write(imagen.datos);//crea la imagen
        writer.end();

        //crea un readStream para leer los datos por partes
        let readStream = fs.createReadStream(path.join(__dirname, 'public/img/' + imagen.nombre), {encoding: 'binary'}),
        pedazos = [];

        readStream.on('data', (pedazo) => {
            pedazos.push(pedazo);
            io.emit('subir-imagen', pedazo, username);//envia partes de la imagen para guardarlas en un arrays
        });

        readStream.on('close', () => {
            io.emit('cargar-imagen', username);//evento que se desencadena al enviarse todas las partes de la imagen
        });

    });

    //NOTIFICA A LOS USUARIOS QUIEN ESTA ESCRIBIENDO
    socket.on('teclado', (usuario) =>{
        socket.broadcast.emit('teclado', usuario);
    });

    //EVENTOS PRODUCIDOS AL DESCONECTARSE UN USUARIO
    socket.on('disconnect', ()=>
    {   
        contadorUsuarios -= 1;
        io.emit('substractUsers', contadorUsuarios, usersData, socket.id);
    
        //borra los datos de los usuarios que se desconectan del chat de usersData[]
        for(let i=0; i< usersData.length; i++){
            
            if(usersData[i].id === socket.id){
                idUsuarioDesconectado = socket.id;
                usersData.splice(i, 1);//borra al usuario del arreglo de usuarios conectados
            }
            
        }
    });
    
});

server.listen(app.get('port'),() => {
    console.log('Servidor funcionando');
});

