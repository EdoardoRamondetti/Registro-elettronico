"use strict"

window.onload=function(){

    btnRecover.addEventListener("click",inviaMail)

     document.addEventListener('keydown', function (event) {
        if (event.key == "Enter")
			inviaMail()
	});

    function inviaMail(){
        email.classList.remove("nonValid")
        user.classList.remove("nonValid")
        if(user.value == "")
          user.classList.add("nonValid")   
        else if(email.value == "" || !email.value.includes('@'))
            email.classList.add("nonValid")
        else{
            loadingSpinner.classList.remove("d-none")
            let request = inviaRichiesta("POST","server/inviaMail.php",{"destinatario":email.value,"utente":user.value})
            request.catch(errore)
            request.then(function(httpResponse){
                window.location.href = "nuovaPassword.html"
                loadingSpinner.classList.add("d-none")
            })
        }
    }
}