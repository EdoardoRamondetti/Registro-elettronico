"use strict"

window.onload=function(){
    const txtPsw = document.getElementById("password")
    const eyeIcon = togglePassword.firstElementChild
	const bntPswDimenticata = btnLogin.nextElementSibling.firstElementChild
    
    togglePassword.addEventListener("click",function(){

        if(txtPsw.type=="password"){
            txtPsw.type = "text"
            eyeIcon.classList.remove("bi-eye")
            eyeIcon.classList.add("bi-eye-slash")
        }
        else{
            txtPsw.type = "password"
            eyeIcon.classList.remove("bi-eye-slash")
            eyeIcon.classList.add("bi-eye")
        }
    })

    btnLogin.addEventListener("click",controllaLogin)

    document.addEventListener('keydown', function (event) {
        if (event.key == "Enter")
			controllaLogin();
	});

	bntPswDimenticata.addEventListener("click",function(){
		window.location.href = "passwordDimenticata.html"
	})

    	function controllaLogin() {
		loginError.classList.add("d-none")
		username.classList.remove("nonValid");
		username.previousElementSibling.classList.remove("red-text");
		password.classList.remove("nonValid");
		lblPsw.classList.remove("red-text");

		if(username.value == "" || password.value==""){
			if (username.value == "") {
			username.classList.add("nonValid");
			username.previousElementSibling.classList.add("icona-rossa");
			}
			if (password.value == "") {
				password.classList.add("nonValid");
				lblPsw.classList.add("icona-rossa");
			}
		}
		
		else {
			let user = username.value;
			let pass = CryptoJS.MD5(password.value).toString();
			let rq = inviaRichiesta("POST", "server/login.php", { user, pass })
			rq.then(function (response) {
				window.location.href = "index.php"
			});
			rq.catch(function (err) {
				if (err.response && err.response.status == 401) {
					loginError.classList.remove("d-none")
				}
				else
					errore(err)
			});
		}
	}
}