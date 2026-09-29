"use strict"

window.onload=function(){
    const btnPsw = document.getElementsByName("togglePassword")

    for (const btn of btnPsw) {
        btn.addEventListener("click",togglePassword)
    }

    btnChangePsw.addEventListener("click",cambiaPsw)

     document.addEventListener('keydown', function (event) {
        if (event.key == "Enter")
			cambiaPsw()
	});

    function cambiaPsw(){
        psw.classList.remove("nonValid")
        confermaPsw.classList.remove("nonValid")
        loginError.classList.add("d-none")
        loginErrorPswAttuale.classList.add("d-none")

        if(pswAttuale.value == ""){
            pswAttuale.classList.add("nonValid")
            return
        }
        if(psw.value == "")
		{
          psw.classList.add("nonValid")
          return
		}
        if(confermaPsw.value == ""){
            confermaPsw.classList.add("nonValid")
            return
        }
        if(psw.value != confermaPsw.value){
            loginError.classList.remove("d-none")
            return
        }
        let request = inviaRichiesta("POST","server/cambiaPassword.php",{"passwordAttuale":pswAttuale.value,"password":psw.value})
        request.catch(function(err){
            if (err.response && err.response.status == 401) {
                loginErrorPswAttuale.classList.remove("d-none")
            }
            else
                errore(err)
        })
        request.then(function(httpResponse){
            console.log(httpResponse.data)
            window.location.href = "login.html"
        })
    }

    function togglePassword(){
        const txtPsw = this.previousSibling.previousSibling
        const eyeIcon = this.firstElementChild

        if(txtPsw.type == "password"){
            txtPsw.type = "text"
            eyeIcon.classList.remove("bi-eye")
            eyeIcon.classList.add("bi-eye-slash")
        }
        else{
            txtPsw.type = "password"
            eyeIcon.classList.remove("bi-eye-slash")
            eyeIcon.classList.add("bi-eye")
        }
    }
}