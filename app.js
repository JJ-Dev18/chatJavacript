const botones = document.getElementById('botones');
const nombreUsuario = document.getElementById('nombreUsuario')
const contenidoProtegido = document.getElementById('contenidoProtegido')
const formulario = document.getElementById('formulario')
const inputChat = document.getElementById('inputChat')
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
    formulario.classList = 'bg-gray-700 p-3 container mx-auto fixed bottom-0'
     cerrarSesion()
    // ...
  } else {
    // User is signed out
    // ...
     botones.innerHTML = /*html*/ ` 
     <button class="bg-green-500 rounded text-white p-3 mr-2 hover:bg-green-600" id='btnAcceder'>Acceder</button>
     `
     nombreUsuario.innerHTML = 'Chat'
     contenidoProtegido.innerHTML = /*html*/`
      <p class="mt-4 text-gray text-center">Debes iniciar Sesion</p>
     `
     formulario.classList = 'bg-gray-700 p-3 container mx-auto fixed bottom-0 hidden'
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
       contenidoProtegido.innerHTML = ''
       query.forEach(doc => {
         if(doc.data().uid === user.uid){
           console.log(doc.data())
           contenidoProtegido.innerHTML += /*html*/ `
           <div class="flex justify-end">
           <span class="rounded bg-blue-200 ">${doc.data().texto}</span>
           </div>`
         }
         else {
           contenidoProtegido.innerHTML +=/*html*/`
            <div class="flex justify-start">
              <span class="rounded bg-gray-200 ">${doc.data().texto}</span>
            </div>
           `
         }
         contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight
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
    var token = credential.accessToken;
    var user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
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