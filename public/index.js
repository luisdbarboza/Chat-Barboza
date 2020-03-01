//Cliente

const socket = io();
let receptor = '';//almacena el nombre de usuario al cual enviarle el mensaje privado 
let mensajePrivado = false;
const emojis = [
    '😀','😄', '😅', '😉', '😎', '🤔', '🤨', '😭', '😔', '💪', '👍 ', '🤓', '👌'
];

/**********************************PIDE AL USUARIO UN USERNAME ************************************************/
const pedirUsername = () =>
{
    let resultado = prompt('Ingresa un nombre de usuario');
    resultado.trim();

    while(resultado.trim() == "")
    {
        resultado = prompt('Tienes que ingresar un nombre de usuario');
    }
    return resultado;
}

let username = pedirUsername();
/*******************************************************************************************************************/

//ENVIA AL SERIVDOR EL USERNAME Y EL ID DE ESTE USUARIO
socket.emit('username&ID', username);


/************************RENDERIZA LOS CONTACTOS VOLATILMENTE MIENTRAS SE CONECTAN Y/O DESCONECTAN******************/
const renderizaUsuarios = (usersData) =>{
    
   let divListaConectados = document.getElementById("lista-contactos");
   divListaConectados.innerHTML = "";

   //ESTO ELIMINA LOS USUARIOS DEL PANEL LATERAL AL DESCONECTARSE
   for(let i = 0; i < usersData.length; i++)
   {
       divListaConectados.innerHTML += `
                               <div class="caja-us-conectado" id="caja-us-conectado">
                                   <div class="us-conectado">
                                       <i class="fa fa-user" aria-hidden="true"></i>
                                       <p>${usersData[i].nombreUsuario}</p>
                                   </div>
                               </div>`
   }

   /*********************************MENSAJES PRIVADOS USUARIO-A-USUARIO **************************************************/
    let cajasUsuarioConectados = document.getElementsByClassName("us-conectado");
    
    for(let i = 0; i < cajasUsuarioConectados.length; i++)
    {
        //Hace que al hacer click en la caja de otro usuario se puedan eviar mensajes solo
        //a ese usuario en especifico
        cajasUsuarioConectados[i].addEventListener('click', ()=>{
            
            receptor = cajasUsuarioConectados[i].lastElementChild.textContent;

            if(receptor !== username)
            {
                
                let notificaciones = document.querySelector(".notificaciones");
                notificaciones.style.backgroundColor = "purple";

                
                let notificacion = document.querySelector("#notificacion");
                notificacion.textContent = `Mensaje privado para ${receptor}`;  

                mensajePrivado = true;
            }
            
        });
    }

};
/*******************************************************************************************************************/


/***********************************FUNCION PARA ENVIAR MENSAJES ************************************************** */
const enviarMensaje = (datos,socketID, receptor = '') => {

    console.log(socketID);

    const listaMensaje = document.getElementsByClassName('mensajes')[0];
    let divMsg = document.createElement('div');
    let divUser = document.createElement('div');
    let divMsgText = document.createElement('div');
    let notificacion = document.getElementById("notificacion");
    notificacion.textContent = "";

    //agrega el cuadro del usuario con su icono
    let usernameP = document.createElement('p');
    usernameP.classList.add('pUsuario');
    usernameP.appendChild(document.createTextNode(datos.username));
    
    let userIcon = document.createElement('i');
    userIcon.setAttribute('class', 'fa fa-user');
    
    divUser.appendChild(usernameP);
    divUser.appendChild(userIcon);
    divUser.setAttribute('class', 'usuario');

    //agrega el mensaje 
    let messageText = document.createElement('p');
    messageText.classList.add('pMensaje');
    messageText.innerHTML = datos.mensaje;/**reemplazar esto */
    divMsgText.appendChild(messageText);


    divMsg.appendChild(divUser);
    divMsg.appendChild(divMsgText);

    listaMensaje.appendChild(divMsg);


    if((datos.username === username) && (socket.id === datos.ID))
    {
        divMsg.classList.add("msg-item","msg-item-enviado")
        divMsgText.setAttribute('class', 'msg-text-e');
    } else
    {
        divMsg.classList.add("msg-item","msg-item-recibido")
        divMsgText.setAttribute('class', 'msg-text-r');
    }

    if(receptor !== '')
    {
        mensajePrivado = false;//sirve para dejar de enviar mensajes privados
        let notificaciones = document.querySelector(".notificaciones");
        notificaciones.style.backgroundColor = "#E1007F";
        divMsgText.style.backgroundColor = "black";

        if(datos.username === username)
        {
            messageText.innerHTML = `MENSAJE PRIVADO para ${receptor}: <br/> ${datos.mensaje}`;
        } 
        else 
        {
            messageText.innerHTML = `MENSAJE PRIVADO de ${usernameP.textContent}: <br/> ${datos.mensaje}`;
        }
    }


}

/*********************MUESTRA CUANTOS USUARIOS HAY CONECTADOS Y QUIENES SON *******************************************/
socket.on('newConnection', (contadorUsuarios, usersData) => {
    
    // Cambia el texto que muestra a los usuarios conectados
    let usuariosConectados = document.getElementsByClassName('usuariosConectados')[0];
    usuariosConectados.textContent = 'Usuarios conectados: ' + contadorUsuarios;  

    let notificacion = document.getElementById("notificacion");
    notificacion.textContent = usersData[usersData.length - 1].nombreUsuario + " se ha unido a la sala"; 

    renderizaUsuarios(usersData);
});

/************************************ENVIO DE FORMULARIO *********************************************************** */
const form = document.getElementsByTagName('form')[0];
const inputMensaje = document.getElementById('inputMensaje');


//Hace que al enviar los datos del formulario, estos se envien al servidor via socket
form.addEventListener('submit', (e)=>{
    let cajaMensaje = document.getElementById('inputMensaje');


    if(cajaMensaje.value.trim().length !== 0)
    {
        cajaMensaje.classList = '';

        //emite un mensaje al servidor
        if(mensajePrivado === false)
        {
            socket.emit('mensajes', {mensaje: inputMensaje.value, username: username, ID: socket.id});
        }
        else
        {
            socket.emit('mensajes-priv', {mensaje: inputMensaje.value, username: username, ID: socket.id}, receptor);
        }
        
        e.preventDefault();//evita que la pagina se recargue

        inputMensaje.value = '';

        return false;
    }

    e.preventDefault();//evita que la pagina se recarge

    cajaMensaje.setAttribute('class', 'error-form');
    cajaMensaje.focus();
    
});

let cajaMensaje = document.getElementById('inputMensaje');

/*********************************LE INFORMA A LOS USUARIOS SI HAY ALGUIEN ESCRIBIENDO************************* */
cajaMensaje.addEventListener('keypress', ()=>{
    socket.emit('teclado', username);
});

socket.on('teclado', usuario =>{
    let notificacion = document.getElementById("notificacion");
    notificacion.textContent = usuario + " esta escribiendo";   
});

/*****************************************EVENTOS PARA AGREGAR MENSAJES ******************************* */
socket.on('mensajes', datos => {
    enviarMensaje(datos, socket.id);
});

socket.on('mensajes-priv', (datos, receptor) => {
    enviarMensaje(datos, socket.id, receptor);
});

/***************************************EVENTOS DE DESCONEXION ************************************** */

socket.on('substractUsers', (contadorUsuarios, usersData, socketID) =>
{

    /* Cambia el texto que muestra a los usuarios conectados*/
    let usuariosConectados = document.getElementsByClassName('usuariosConectados')[0];
    usuariosConectados.textContent = 'Usuarios conectados: ' + contadorUsuarios; 

    
    for(let i = 0; i < usersData.length; i++)
    {
        if(usersData[i].id === socketID)
        {
            let notificacion = document.getElementById("notificacion");
            notificacion.textContent = usersData[i].nombreUsuario + " se ha desconectado";   
        }
   }

   //borra los datos de los usuarios que se desconectan del chat de usersData[]
   for(let i=0; i< usersData.length; i++){
            
        if(usersData[i].id === socketID){
            idUsuarioDesconectado = socketID;
            usersData.splice(i, 1);//borra al usuario del arreglo de usuarios conectados
        }
        
    }

   //ESTO ELIMINA LOS USUARIOS DEL PANEL LATERAL AL DESCONECTARSE
   renderizaUsuarios(usersData);

});

/***************************************** EMOTICONES ******************************************************** */

//incluye a los emojis del array
emojis.forEach(emoji => {
    let cajaEmoticones = document.querySelector('.box-emoticones');
    let cajaEmoji = document.createElement('div');
    cajaEmoji.classList.add('box-emoji');
    cajaEmoji.appendChild(document.createTextNode(`${emoji}`));
    cajaEmoticones.appendChild(cajaEmoji);
});

//Esto pertmite al usuario incluir emoticones en sus mensajes
let btnEmoticones = document.querySelector('#btn-emoticones');

btnEmoticones.addEventListener('click', () => {
    let cajaTextoMsg = document.querySelector('#inputMensaje');
    let cajaEmoticones = document.querySelector('.box-emoticones');
    
    //oculta la caja de texto
    cajaTextoMsg.setAttribute('hidden', true);

    //hace que aparezca la caja de seleccion de emojis
    cajaEmoticones.removeAttribute('hidden');
    cajaEmoticones.style.display = 'grid';
});

//Esto hace que al seleccionar un emoji se aniada al mensaje y se oculte la caja de emojis
let emojiBtns = document.querySelectorAll('.box-emoji');

emojiBtns.forEach(emoji => {
    emoji.addEventListener('click', () => {
        let cajaTextoMsg = document.querySelector('#inputMensaje');
        let cajaEmoticones = document.querySelector('.box-emoticones');

        //cajaTextoMsg.value += `<span class="emoji">${emoji.textContent.trim()}</span>`;
        cajaTextoMsg.value += `${emoji.textContent.trim()}`;
        cajaTextoMsg.removeAttribute('hidden');

        cajaEmoticones.style.display = 'none';

    });
});

/********************************SUBIR IMAGENES AL SERVIDOR POR SOCKET.IO  ******************************************/
const inputFile = document.querySelector('input[type="file"]');

inputFile.addEventListener('change', (e) => {
    console.log(inputFile.files);

    const reader = new FileReader();

    reader.readAsArrayBuffer(inputFile.files[0]);//codifica la imagen a base64, es decir la vuelve binaria

    reader.onload = () =>
    {
        let decision = confirm('Quieres subir esta imagen?')

        if(decision)
        {
            socket.emit('subir-imagen', {nombre: inputFile.files[0].name, datos: reader.result}, username);//envia los datos en formato base64
        }
    }
});

let pedazosImagen = [];

socket.on('subir-imagen', (pedazo, username) => {
    pedazosImagen.push(pedazo);
    console.log(pedazosImagen);
});

socket.on('cargar-imagen', (usernameIMG) => {

    const listaMensaje = document.getElementsByClassName('mensajes')[0];
    let divMsg = document.createElement('div');
    let divUser = document.createElement('div');
    let divMsgText = document.createElement('div');
    let notificacion = document.getElementById("notificacion");
    notificacion.textContent = "";

    //agrega el cuadro del usuario con su icono
    let usernameP = document.createElement('p');
    usernameP.classList.add('pUsuario');
    usernameP.appendChild(document.createTextNode(usernameIMG));
    
    let userIcon = document.createElement('i');
    userIcon.setAttribute('class', 'fa fa-user');
    
    divUser.appendChild(usernameP);
    divUser.appendChild(userIcon);
    divUser.setAttribute('class', 'usuario');

    //agrega el mensaje 
    let messageImg = document.createElement('img');
    messageImg.classList.add('img-mensaje');
    messageImg.setAttribute('src', 'data:image/jpeg;base64,' + window.btoa(pedazosImagen));
    messageImg.width = '200';
    messageImg.height = '200';
    divMsgText.appendChild(messageImg);


    divMsg.appendChild(divUser);
    divMsg.appendChild(divMsgText);

    listaMensaje.appendChild(divMsg);


    divMsg.classList.add("msg-item","msg-item-enviado");
    divMsgText.setAttribute('class', 'msg-text-e');

    if(usernameIMG === username)
    {
        divMsg.classList.add("msg-item","msg-item-enviado")
        divMsgText.setAttribute('class', 'msg-text-e');
    } else
    {
        divMsg.classList.add("msg-item","msg-item-recibido")
        divMsgText.setAttribute('class', 'msg-text-r');
    }

    pedazosImagen = [];
});