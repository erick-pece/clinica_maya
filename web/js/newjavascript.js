const registroForm = document.querySelector('#registro-form');

registroForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const email = document.querySelector('#registro-email').value;
    const password = document.querySelector('#registro-password').value;

    //console.log(registroEmail, registroPassword)

    auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            //limpia el formulario
            registroForm.reset();
            //cierra el modal
            $('#registroModal').modal('hide')

            console.log("Registrado")
        })

})
