const botones = document.getElementById('botones');
const nombreUsuario = document.getElementById('nombreUsuario')
const contenidoProtegido = document.getElementById('contenidoProtegido')
const formulario = document.getElementById('formulario')
const inputChat = document.getElementById('inputChat')
const img = document.getElementById('img')
const contentChat = document.getElementById('contentChat')
firebase.auth().onAuthStateChanged((user) => {
 
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    botones.innerHTML = /*html*/`
       <button class="bg-red-500 rounded text-white p-3 hover:bg-red-600" id='btnCerrarSesion'  >Cerrar sesion</button>
      </div>
    `
    nombreUsuario.innerHTML  = user.displayName;
    contenidoChat(user)
    formulario.classList = "p-1.5 flex w-full";
    img.classList = 'rounded-full w-10'
    img.src = user.photoURL
    
     cerrarSesion()
    // ...
  } else {
    // User is signed out
    // ...
     botones.innerHTML = /*html*/ ` 
     <button class="bg-green-500 rounded text-white p-3 mr-2 hover:bg-green-600" id='btnAcceder'>Acceder</button>
     `
     nombreUsuario.innerHTML = 'Chat'
     img.classList = "w-16";
     img.src = 'img/logo.png'
     contentChat.innerHTML = /*html*/`
      <p class="mt-4 text-gray text-center">Debes iniciar Sesion</p>
     `
     formulario.classList = 'bg-gray-700 p-3 container mx-auto fixed bottom-0 hidden'
    //  img.classList = "hidden";
     iniciarSesion()
  }
});
const contenidoChat = (user)=> {

     formulario.addEventListener('submit', (e)=> {
     e.preventDefault()
     if(!inputChat.value.trim()){
       console.log('input vacio')
       return
     }
     firebase.firestore().collection('chat').add({
       texto : inputChat.value ,
       uid : user.uid ,
       fecha : Date.now()
     })
     .then(res => console.log('mensaje guardado'))
     .catch(e => console.log(e))
     
     inputChat.value = ' '
     })

     firebase.firestore().collection('chat').orderBy('fecha')
     .onSnapshot(query => {
       contentChat.innerHTML = ''
       query.forEach(doc => {
         if(doc.data().uid === user.uid){
           console.log(doc.data())
           contentChat.innerHTML += /*html*/ `
           <div class="flex justify-end mensajes ">
           <span class="rounded-lg mb-0.5" id='mensajeStart'>${
             doc.data().texto
           }</span>
           </div>`;
         }
         else {
           contentChat.innerHTML += /*html*/ `
            <div class="flex justify-start " >
              <span class="rounded-lg  " id="mensajeFinal">${
                doc.data().texto
              }</span>
            </div>
           `;
         }
         contentChat.scrollTop = contentChat.scrollHeight
       })
     })
}

const iniciarSesion =() => {
   const btnAcceder = document.getElementById('btnAcceder')
   btnAcceder.addEventListener('click' , async () => { 
     console.log('accediendo')
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
    
    var credential = result.credential;
    // ...
  }).catch((error) => {
    console.log(error)
  });
    } catch (error) {
      console.log(error)
    }
   })
}
const cerrarSesion = () => {
  const btnCerrarSesion = document.getElementById('btnCerrarSesion')
  btnCerrarSesion.addEventListener('click' , () => {

     firebase.auth().signOut();
  })
}