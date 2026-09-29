"use strict"

window.onload=function(){
    const navbarStudenti = document.getElementsByTagName("nav")[0]
    const mainContainer = document.getElementsByClassName("main-container")[0]
    const mainContainerDocenti = document.getElementsByClassName("main-container-docenti")[0]
    const votiContainer = document.getElementsByClassName("votiContainer")[0]
    const assenzeContainer = document.getElementsByClassName("assenzeContainer")[0]
    const planningContainer = document.getElementsByClassName("planningContainer")[0]
    const table = document.getElementsByTagName("table")[0]
    const tBody = votiContainer.getElementsByTagName("tbody")[0]
    const tBodyAssenze = assenzeContainer.getElementsByTagName("tbody")[0]
    const tBodyPlanning = planningContainer.getElementsByTagName("tbody")[0]
    const goHomePage = document.getElementsByClassName("navbar-brand")[0]
    const btnsFilter = this.document.getElementsByClassName("filter-btn")

    let studente
    let elencoMaterie = {}
    let materia=""
    let righePerpagina = 10
    let indiceIniziale = 0
    let indiceFinale = righePerpagina+indiceIniziale
    let righePerpaginaAssenze = 10
    let indiceInizialeaAssenze = 0
    let indiceFinaleAssenze = righePerpaginaAssenze+indiceInizialeaAssenze
    let indiceInizialeaPlanning = 0
    let indiceFinalePlannning
    let lunghezzaVoti
    let assenze
    let numeroAssenzeVisualizzate
    let votiForModale
    let currentPageModal = 0

    let request = inviaRichiesta("GET","server/controllaSessione.php")
    request.catch(errore)
    request.then(function(httpResponse){
        let rq = inviaRichiesta("GET","server/getStudente.php")
        rq.catch(errore)
        rq.then(function(httpResponse){
            studente = httpResponse.data[0]
            if(studente.docente == 1){
                navbarStudenti.classList.add("d-none")
                mainContainer.style.display = "none"
                mainContainerDocenti.style.display = "block"
                navbarDocente.classList.remove("d-none")

                let docente = studente
                nomeDocente.textContent = docente.nome

                cardAssenzeDocenti.addEventListener("click",mostraSezioneAssenzeDocenti)
   
    function mostraSezioneAssenzeDocenti(){
        classeSelectDocente.selectedIndex = -1
        mainContainerDocenti.style.display = "none"
        registrazioneAssenzeContainer.classList.remove("d-none")
        studentiBodyAssenze.innerHTML = ""
        riempiselectClassi(classeSelectDocente)
    }

    classeSelectDocente.addEventListener("change",function(){
        let classe = this.value
        studentiBodyAssenze.innerHTML = ""
        registrazioneAssenzeContainer.style.paddingBottom = "0"
        let request = inviaRichiesta("GET","server/getStudenti.php",{classe})
        request.catch(errore)
        request.then(async function(httpResponse){
            let studenti = httpResponse.data

            for (const studente of studenti) {
                const tr = document.createElement("tr")
                studentiBodyAssenze.appendChild(tr)

                let td = document.createElement("td")
                td.textContent = studente.nome
                tr.appendChild(td)

                td = document.createElement("td")
                td.textContent = studente.cognome
                tr.appendChild(td)

                td = document.createElement("td")
                const btn = document.createElement("button")
                btn.classList.add("btn","btn-primary","mt-3")
                btn.matricola = studente.matricola
                btn.id = "salvaAssenzebtn"+studente.matricola
                btn.classList.add("salvaAssenzebtn"+studente.matricola)
                td.appendChild(btn)
                tr.appendChild(td)
            }

            //controllo se studente è assente o no
            for (const studente of studenti) {
            const btn = document.querySelector(".salvaAssenzebtn" + studente.matricola);
            const dataOggi = new Date().toISOString().substring(0,10);

            // Un solo listener fisso
            btn.onclick = () => toggleAssenza(studente.matricola, dataOggi);

            // Controllo stato iniziale
            inviaRichiesta("GET", "server/assenteONonAssente.php", {
                matricola: studente.matricola,
                data: dataOggi
            }).then(httpResponse => {
                if (httpResponse.data.length >= 1) {
                    btn.textContent = "assente (clicca per rimuovere l'assenza)";
                    btn.dataset.stato = "assente";
                } else {
                    btn.textContent = "Segna assente";
                    btn.dataset.stato = "presente";
                }
            }).catch(errore);
        }
        })
    })

    function toggleAssenza(matricola, dataOggi) {
    const btn = document.querySelector(".salvaAssenzebtn" + matricola);

    if (btn.dataset.stato === "assente") {
        rimuoviAssenza(matricola, dataOggi);
    } else {
        segnaAssente(matricola, dataOggi);
    }
}

function segnaAssente(matricola, dataOggi) {
    const btn = document.querySelector(".salvaAssenzebtn" + matricola);

    inviaRichiesta("POST", "server/segnaAssenza.php", {
        matricola, data: dataOggi
    })
    .then(() => {
        btn.textContent = "assente (clicca per rimuovere l'assenza)";
        btn.dataset.stato = "assente";
    })
    .catch(errore);
}

function rimuoviAssenza(matricola, dataOggi) {
    const btn = document.querySelector(".salvaAssenzebtn" + matricola);

    console.log(matricola + ", " + dataOggi)
    let request = inviaRichiesta("POST", "server/rimuoviAssenza.php", {
        matricola, "data": dataOggi
    })
    request.then(function(httpResponse) {
        console.log(httpResponse.data)
        btn.textContent = "Segna assente";
        btn.dataset.stato = "presente";
    })
    request.catch(errore);
}


    classeSelectDocenteVoti.addEventListener("change",function(){
        let classe = this.value
        studentiBodyVoti.innerHTML = ""
        registrazioneVotiContainer.style.paddingBottom = "0"
        rowsPerPageModal.value = "10"
        let request = inviaRichiesta("GET","server/getStudenti.php",{classe})
        request.catch(errore)
        request.then(function(httpResponse){
            console.log(httpResponse.data)
            let studenti = httpResponse.data

            for (const studente of studenti) {
                const tr = document.createElement("tr")
                studentiBodyVoti.appendChild(tr)

                let td = document.createElement("td")
                td.textContent = studente.nome
                tr.appendChild(td)

                td = document.createElement("td")
                td.textContent = studente.cognome
                tr.appendChild(td)

                td = document.createElement("td")
                let btn = document.createElement("button")
                btn.textContent = "Segna voto"
                btn.classList.add("btn","btn-primary","mt-3",)
                btn.matricola = studente.matricola
                btn.setAttribute("data-bs-toggle", "modal");
                btn.setAttribute("data-bs-target", "#modaleAssegnaVoto");
                btn.addEventListener("click",function(){
                    let dataOggi = new Date().toISOString().substring(0,10)
                    let classe = studente.classe
                    selectMateria.innerHTML = ""
                    invalidMateria.style.display = "none"
                    invalidVoto.style.display = "none"

                    let request = inviaRichiesta("GET","server/getMaterie.php",{classe})
                    request.catch(errore)
                    request.then(function(httpResponse){
                        console.log(httpResponse.data)
                        let materie = httpResponse.data
                        for (const materia of materie) {
                            const option = document.createElement("option")
                            option.textContent = materia.materia
                            option.value = materia.id
                            selectMateria.appendChild(option)
                        }
                        selectMateria.selectedIndex = -1

                        btnSalvaVoto.addEventListener("click",function(){
                            invalidMateria.style.display = "none"
                            invalidVoto.style.display = "none"

                            if(selectMateria.value == ""){
                                invalidMateria.style.display = "block"
                            }
                            if(inputVoto.value == "" || inputVoto.value >10 || inputVoto.value<1){
                                invalidVoto.style.display = "block"
                                return
                            }
                            invalidMateria.style.display = "none"
                            invalidVoto.style.display = "none"

                            let request = inviaRichiesta("POST","server/inserisciVoto.php",{"matricola":studente.matricola,"data":
                                dataOggi,"voto":inputVoto.value,"materia":selectMateria.value
                            })
                            request.catch(errore)
                            request.then(function(httpResponse){
                        const modal = bootstrap.Modal.getInstance(document.getElementById('modaleAssegnaVoto'))
                        modal.hide()
                            })
                        })
                    })
                })
                td.appendChild(btn)

                selectMateriaModal.addEventListener("change",function(){
                    const request = inviaRichiesta("GET","server/getVoti.php",{"matricola":studente.matricola,"materia":this.value})
                    request.catch(errore)
                    request.then(function(httpResponse){
                        if(httpResponse.data.length <= parseInt(rowsPerPageModal.value))
                            nextPageModal.disabled = true
                        else
                            nextPageModal.disabled = false
                        console.log(httpResponse.data)
                        votiForModale = httpResponse.data
                        visualizzaVoti(httpResponse.data,rowsPerPageModal.value)
                    })
                })

                rowsPerPageModal.addEventListener("change",function(){
                const request = inviaRichiesta("GET","server/getVoti.php",{"matricola":studente.matricola,"materia":selectMateriaModal.value})
                request.catch(errore)
                request.then(function(httpResponse){
                    console.log(httpResponse.data)
                    indiceInizialeVotiModal = 0
                    prevPageModal.disabled = true
                    nextPageModal.disabled = false
                    votiForModale = httpResponse.data
                    visualizzaVoti(httpResponse.data,rowsPerPageModal.value)
                })
            })

                btn = document.createElement("button")
                btn.classList.add("btn","btn-primary","mt-3","ms-3")
                btn.textContent = "Visualizza voti"
                btn.matricola = studente.matricola
                btn.setAttribute("data-bs-toggle", "modal");
                btn.setAttribute("data-bs-target", "#modaleVisualizzaVoti");
                btn.addEventListener("click",function(){
                    rowsPerPageModal.value = "10"
                    selectMateriaModal.innerHTML = "<option value=''>Tutte</option>"
                    const request = inviaRichiesta("GET","server/getVoti.php",{"matricola":btn.matricola,"materia":""})
                    request.then(function(httpResponse){
                        const voti = httpResponse.data
                        votiForModale = voti
                        console.log(voti)
                            let request = inviaRichiesta("GET","server/getMaterie.php",{"classe":classe})
                            request.catch(errore)
                            request.then(function(httpResponse){
                                for (const jsMateria of httpResponse.data) {
                                    elencoMaterie[jsMateria.id] = jsMateria.materia
                                    }
                                    console.log(elencoMaterie)

                            riempiSelectMaterieModal()
                            prevPageModal.disabled = true
                            nextPageModal.disabled = false
                            visualizzaVoti(voti,rowsPerPageModal.value)
                                })
                    })
                    request.catch(errore)
                })
                td.appendChild(btn)
                tr.appendChild(td)
            }
        })
    })

    nextPageModal.addEventListener("click", () => {
    currentPageModal++;
    visualizzaVoti(votiForModale,rowsPerPageModal.value);
        });

        prevPageModal.addEventListener("click", () => {
            currentPageModal--;
            visualizzaVoti(votiForModale,rowsPerPageModal.value);
        });

    homeDocente.addEventListener("click",function(){
        mainContainerDocenti.style.display = "block"
        registrazioneAssenzeContainer.classList.add("d-none")
        registrazioneVotiContainer.classList.add("d-none")
    })

    navGestioneAssenze.addEventListener("click",function(){
        mainContainerDocenti.style.display = "none"
        registrazioneAssenzeContainer.classList.remove("d-none")
        registrazioneVotiContainer.classList.add("d-none")
        studentiBodyAssenze.innerHTML = ""
        mostraSezioneAssenzeDocenti()
    })

    cardVotiDocente.addEventListener("click",mostraSezioneVoti)

    function visualizzaVoti(voti,rowsPerPage){
    const rows = parseInt(rowsPerPageModal.value) || votiForModale.length;
    const total = votiForModale.length;

    const totalPages = Math.ceil(total / rows);
    if (currentPageModal >= totalPages) currentPageModal = totalPages - 1;
    if (currentPageModal < 0) currentPageModal = 0;

    const start = currentPageModal * rows;
    const end = start + rows;

    const tbody = document.querySelector(".modal-table-tbody");
    tbody.innerHTML = "";

    let somma = 0;

    votiForModale.slice(start, end).forEach(voto => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${elencoMaterie[voto.materia]}</td>
            <td>${voto.data}</td>
            <td style="color:${voto.voto < 6 ? 'red' : 'green'}">${voto.voto}</td>
        `;

        tbody.appendChild(tr);
    });

    // Calcolo media
    votiForModale.forEach(v => somma += parseInt(v.voto));
    const media = (somma / total).toFixed(1);

    spanMediaVotiStudenteModal.textContent = media;
    spanMediaVotiStudenteModal.style.color = media < 6 ? "red" : "green";

    // gestione bottoni
    prevPageModal.disabled = currentPageModal === 0;
    nextPageModal.disabled = currentPageModal >= totalPages - 1;
    }

    function mostraSezioneVoti(){
        classeSelectDocenteVoti.selectedIndex = -1
        mainContainerDocenti.style.display = "none"
        registrazioneVotiContainer.classList.remove("d-none")
        riempiselectClassi(classeSelectDocenteVoti)
        classeSelectDocente.selectedIndex = -1
        studentiBodyVoti.innerHTML = ""
    }

    function riempiselectClassi(select){
        let request = inviaRichiesta("GET","server/getClassi.php")
        request.catch(errore)
        request.then(function(httpResponse){
            let classi = httpResponse.data

            select.innerHTML = ""
            for (const classe of classi) {
                let request = inviaRichiesta("GET","server/getStudenti.php",{"classe":classe.nome})
                request.catch(errore)
                request.then(function(httpResponse){
                if(httpResponse.data.length!=0){
                    const option = document.createElement("option")
                    option.textContent = classe.nome
                    option.value = classe.nome
                    select.appendChild(option)
                    select.selectedIndex = -1  
                }
                })
            }
        })
    }

    navAssegnaVoti.addEventListener("click",function(){
        mainContainerDocenti.style.display = "none"
        registrazioneAssenzeContainer.classList.add("d-none")
        registrazioneVotiContainer.classList.remove("d-none")
        studentiBodyVoti.innerHTML = ""
        mostraSezioneVoti()
    })

    logoutDocenteBtn.addEventListener("click",eseguiLogout)

            }
            else{
                navbarStudenti.classList.remove("d-none")
                mainContainer.style.display = "block"
                nomeStudente.textContent = studente.nome
                getMaterie(studente.classe)

                 cardVoti.addEventListener("click",mostraSezioneVoti)

                function caricaVoti(){
                    let numero
                    let somma=0

                        let request = inviaRichiesta("GET","server/getVoti.php",{"matricola":studente.matricola,materia})
                        request.catch(errore)
                        request.then(function(httpResponse){
                            let  votiDaMostrare
                            tBody.innerHTML = ""
                            let voti = httpResponse.data
                            lunghezzaVoti=voti.length
                            somma = voti.reduce((acc, curr) => acc + parseFloat(curr.voto), 0)

                            numero=voti.length
                            if(numero>0){
                            table.style.display = ""
                            msgNoVoti.style.display = "none"
                            selezionNumeroRighe.classList.remove("d-none")
                            prevPage.style.display = ""
                            nextPage.style.display = ""

                            indiceFinale=indiceIniziale+righePerpagina
                            votiDaMostrare = righePerpagina == "" ? voti:voti.slice(indiceIniziale, indiceFinale)

                            if(indiceFinale >= lunghezzaVoti){
                                nextPage.disabled = true
                            }
                            
                            for (const voto of votiDaMostrare) {
                                const tr = document.createElement("tr")
                                tBody.appendChild(tr)

                                let td = document.createElement("td")
                                td.textContent = elencoMaterie[voto.materia]
                                tr.appendChild(td)

                                td = document.createElement("td")
                                td.textContent = voto.data
                                tr.appendChild(td)

                                td = document.createElement("td")
                                td.textContent = voto.voto
                                if(voto.voto >= 6)
                                    td.style.color = "green"
                                else
                                    td.style.color = "red"
                                tr.appendChild(td)
                            }

                            averageGrade.textContent = (somma/numero).toFixed(2)
                            if(averageGrade.textContent >= 6)
                                averageGrade.style.color = "green"
                            else
                                averageGrade.style.color = "red"
                            }

                            else{
                                table.style.display = "none"
                                msgNoVoti.style.display = "block"
                                averageGrade.textContent = ""
                                nextPage.style.display = "none"
                                prevPage.style.display = "none"
                                selezionNumeroRighe.classList.add("d-none")
                            }

                        })
                }

                rowsPerPage.addEventListener("change",function(){
                    indiceIniziale = 0
                    nextPage.disabled = false
                    prevPage.disabled = true
                    if(this.value == ""){
                        righePerpagina=lunghezzaVoti
                        nextPage.disabled = true
                    }
                    else{
                        righePerpagina = parseInt(this.value)
                    }
                    caricaVoti()
                })
    
    goHomePage.addEventListener("click",function(){
        mainContainer.style.display = "block"
        votiContainer.style.display = "none"
        assenzeContainer.style.display = "none"
        planningContainer.style.display = "none"
    })

        function getMaterie(classe){
    let request = inviaRichiesta("GET","server/getMaterie.php",{"classe":classe})
    request.catch(errore)
    request.then(function(httpResponse){
        for (const jsMateria of httpResponse.data) {
            elencoMaterie[jsMateria.id] = jsMateria.materia
            }
            console.log(elencoMaterie)
        })
    }

    //assenze page
    logoutBtn.addEventListener("click",eseguiLogout)

    nextPage.addEventListener("click",function(){
        prevPage.disabled = false
        indiceIniziale+=righePerpagina
        if(indiceFinale+righePerpagina >= lunghezzaVoti){
            nextPage.disabled = true
        } 
        caricaVoti()
    })

    prevPage.addEventListener("click",function(){
        nextPage.disabled = false
        indiceIniziale-=righePerpagina
        if(indiceIniziale == 0){
            prevPage.disabled = true
        }
        caricaVoti()
    })

    cardAssenze.addEventListener("click",mostraSezioneAssenze)

    rowsPerPageAssenze.addEventListener("change",function(){
        indiceInizialeaAssenze = 0
        indiceFinaleAssenze = parseInt(rowsPerPageAssenze.value) + indiceInizialeaAssenze
        prevPageAssenze.disabled = true
        nextPageAssenze.disabled = false
        richiediAssenze(assenzeContainer.querySelector(".active").dataset.filter,rowsPerPageAssenze.value)
    })

    prevPageAssenze.addEventListener("click",function(){
        indiceInizialeaAssenze-=parseInt(rowsPerPageAssenze.value)
        nextPageAssenze.disabled = false
        indiceFinaleAssenze -= numeroAssenzeVisualizzate
        if(indiceInizialeaAssenze == 0)
            prevPageAssenze.disabled = true
        caricaAssenze(assenze,rowsPerPageAssenze.value)
    })

    nextPageAssenze.addEventListener("click",function(){
        indiceInizialeaAssenze+=parseInt(rowsPerPageAssenze.value)
        prevPageAssenze.disabled = false
        indiceFinaleAssenze = parseInt(rowsPerPageAssenze.value) + indiceInizialeaAssenze
        if(indiceInizialeaAssenze>= indiceFinaleAssenze)
            nextPageAssenze.disabled = true
        caricaAssenze(assenze,rowsPerPageAssenze.value)
    })

    function caricaAssenze(assenze,righePerpaginaAssenze){
    tBodyAssenze.innerHTML = ""
    nextPageAssenze.style.display = "inline"
    prevPageAssenze.style.display = "inline"
    indiceFinaleAssenze = assenze.length
    if(indiceFinaleAssenze>assenze.length)
        nextPageAssenze.disabled = true
    indiceFinaleAssenze = indiceFinaleAssenze > assenze.length ? assenze.length : indiceFinaleAssenze
    const numeroAssenzeDaMostrare = righePerpaginaAssenze == "" ? assenze : assenze.slice(indiceInizialeaAssenze,indiceFinaleAssenze)
    numeroAssenzeVisualizzate = numeroAssenzeDaMostrare.length
    if(assenze.length == numeroAssenzeDaMostrare.length)
        nextPageAssenze.disabled = true
     for (const assenza of numeroAssenzeDaMostrare) {
        const tr = document.createElement("tr")
        tBodyAssenze.appendChild(tr)

        let td = document.createElement("td")
        td.textContent = assenza.data
        tr.appendChild(td)

        td = document.createElement("td")
        const btn = document.createElement("button")
        if(assenza.giustificato == 1){
            btn.textContent="Assenza giustificata"
            btn.classList.add("btnAssenzaGiustificata")
        }
        else{
            btn.textContent="Giustifica assenza"
            btn.classList.add("btnAssenzaNonGiustificata")
            btn.addEventListener("click",function(){
                const request = inviaRichiesta("POST","server/giustificaAssenza.php",{"idAssenza":assenza.id})
                request.catch(errore)
                request.then(function(){
                    const tipoAssenza = assenzeContainer.querySelector(".active").dataset.filter
                    richiediAssenze(tipoAssenza,rowsPerPageAssenze.value)
                })
            })
        }
        td.appendChild(btn)
        tr.appendChild(td)
        }   
    }

        function mostraSezioneVoti(){
        mainContainer.style.display = "none"
        votiContainer.style.display = "block"
        planningContainer.style.display = "none"
        assenzeContainer.style.display = "none"

        materiaFilter.innerHTML = "<option value=''>Tutte le Materie</option>"

        prevPage.disabled = true
        studentName.textContent = studente.nome

        for (const jsMateria in elencoMaterie) {
            let option = document.createElement("option")
            option.textContent = elencoMaterie[jsMateria]
            option.value = jsMateria
            materiaFilter.appendChild(option)
        }

        caricaVoti()
        materiaFilter.addEventListener("change",function(){
         materia = this.value
        prevPage.disabled = true
        nextPage.disabled = false
        indiceIniziale=0
        caricaVoti()
            })
    }

    function mostraSezioneAssenze(){
        mainContainer.style.display = "none"
        votiContainer.style.display = "none"
        assenzeContainer.style.display = "block"
        planningContainer.style.display = "none"

        dateInput.value = ""
        rimuoviActiveFilterBtns()
        btnsFilter[0].classList.add("active")
        studentNameAssenze.textContent = studente.nome

        dateInput.addEventListener("change",eventoCalendario)

        richiediAssenze("all",rowsPerPageAssenze.value)

        for (const filterBtn of btnsFilter) {
            filterBtn.addEventListener("click",function(){
                indiceInizialeaAssenze=0
                prevPageAssenze.disabled = true
                nextPageAssenze.disabled = false
                dateInput.value = ""
                if(!this.classList.contains("active"))
                    richiediAssenze(this.dataset.filter,rowsPerPageAssenze.value)
                rimuoviActiveFilterBtns()
                this.classList.add("active")
            })
        }
    }

    function eventoCalendario(){
        let dateValue = dateInput.value
        assenzeTableBody.innerHTML = ""
        nextPageAssenze.style.display = "inline"
        prevPageAssenze.style.display = "inline"
        const div = assenzeContainer.getElementsByClassName("active")[0]
        const tipoAssenza = div.dataset.filter
        nessunaClasseTrovatatext.classList.add("d-none")
        if(dateInput.value == "")  dateValue = "all"

        let request = inviaRichiesta("GET","server/getAssenze.php",{"matricola":studente.matricola,tipoAssenza,"data":dateValue})
        request.catch(errore)
        request.then(function(httpResponse){
            if(httpResponse.data.length == 0){
                assenzeTableBody.innerHTML = ""
                nessunaClasseTrovatatext.classList.remove("d-none")
                nextPageAssenze.style.display = "none"
                prevPageAssenze.style.display = "none"
                return
            }
            caricaAssenze(httpResponse.data,rowsPerPageAssenze.value)
        })
    }

    function richiediAssenze(tipoAssenza,righePerpaginaAssenze){
        nessunaClasseTrovatatext.classList.add("d-none")
        assenzeTableBody.innerHTML = ""
        nextPageAssenze.style.display = "inline"
        prevPageAssenze.style.display = "inline"
        let request = inviaRichiesta("GET","server/getAssenze.php",{"matricola":studente.matricola,tipoAssenza,"data":"all"})
        request.catch(errore)
        request.then(function(httpResponse){
            assenze = httpResponse.data
            totalAssenze.textContent = assenze.length
            if(assenze.length == 0){
                assenzeContainer.style.marginBottom = "500px"
                nextPageAssenze.style.display = "none"
                prevPageAssenze.style.display = "none"
            }
            else{
                caricaAssenze(assenze,rowsPerPageAssenze.value)
            }
        })
}

    //sezione planning
    materiaFilterPlanning.addEventListener("change",function(){
        getArgomenti(rowsPerPagePlanning.value,this.value,dateInputPlanning.value)
    })

    dateInputPlanning.addEventListener("change",function(){
        getArgomenti(rowsPerPagePlanning.value,materiaFilterPlanning.value,this.value)
    })

    rowsPerPagePlanning.addEventListener("change",function(){
        indiceInizialeaPlanning = 0
        prevPagePlanning.disabled = true
        getArgomenti(this.value,materiaFilterPlanning.value,dateInputPlanning.value)
    })

    cardPlanning.addEventListener("click",mostraSezionePlanning)

    votiNavBar.addEventListener("click",mostraSezioneVoti)

    assenzeNavBar.addEventListener("click",mostraSezioneAssenze)

    planningNavBar.addEventListener("click",mostraSezionePlanning)

    nextPagePlanning.addEventListener("click",function(){
        prevPagePlanning.disabled = false
        indiceInizialeaPlanning+=10
        if(indiceInizialeaPlanning>= (indiceFinalePlannning - parseInt(rowsPerPagePlanning.value)))
            nextPagePlanning.disabled = true
           
        getArgomenti(rowsPerPagePlanning.value,materiaFilterPlanning.value,dateInputPlanning.value)
    })

    prevPagePlanning.addEventListener("click",function(){
        indiceInizialeaPlanning-=10
        nextPagePlanning.disabled = false
        if(indiceInizialeaPlanning == 0)
            prevPagePlanning.disabled = true
            
        getArgomenti(rowsPerPagePlanning.value,materiaFilterPlanning.value,dateInputPlanning.value)
    })

    function mostraSezionePlanning(){
        mainContainer.style.display = "none"
        votiContainer.style.display = "none"
        assenzeContainer.style.display = "none"
        planningContainer.style.display = "block"
        rowsPerPagePlanning.value = "10"

        classNamePlanning.textContent = studente.classe
        materiaFilterPlanning.innerHTML = "<option value=''>Tutte le Materie</option>"
        dateInputPlanning.value = ""

        for (const materia in elencoMaterie) {
            const option = document.createElement("option")
            option.textContent = elencoMaterie[materia]
            option.value = materia
            materiaFilterPlanning.appendChild(option)
        }

        getArgomenti(rowsPerPagePlanning.value,materiaFilterPlanning.value,dateInputPlanning.value)
    }
            }
        })
    })

    function getArgomenti(numeroArgomenti,materia,data){
        let request = inviaRichiesta("GET","server/getArgomenti.php",{"classe":studente.classe,materia,data})
        request.catch(errore)
        request.then(function(httpResponse){
            console.log(httpResponse.data)
            indiceFinalePlannning = httpResponse.data.length-1
            caricaArgomenti(httpResponse.data,numeroArgomenti)
        })
    }

    function caricaArgomenti(argomenti,numeroArgomenti){
        msgNoPlanning.style.display = "none"
        prevPagePlanning.style.display = "inline"
        nextPagePlanning.style.display = "inline"
        tBodyPlanning.innerHTML = ""
        if(argomenti.length == 0){
            msgNoPlanning.style.display = "block"
            prevPagePlanning.style.display = "none"
            nextPagePlanning.style.display = "none"
            return
        }
        const numeroArgomentiDaMostrare = rowsPerPagePlanning.value == "" ? argomenti : 
        argomenti.slice(indiceInizialeaPlanning,indiceInizialeaPlanning+parseInt(numeroArgomenti))
        for (const argomento of numeroArgomentiDaMostrare) {
            const tr = document.createElement("tr")
            tBodyPlanning.appendChild(tr)

            let td = document.createElement("td")
            td.textContent = argomento.data
            tr.appendChild(td)

            td = document.createElement("td")
            td.textContent = elencoMaterie[argomento.materia]
            tr.appendChild(td)

            td = document.createElement("td")
            td.textContent = argomento.argomento
            tr.appendChild(td)
        }
    }

    function eseguiLogout(){
        let request = inviaRichiesta("GET", "server/logout.php")
		request.catch(errore);
		request.then(function(){
			window.location.href="login.html"
		})
    }
        
    function rimuoviActiveFilterBtns(){
        for (const filterBtn of btnsFilter) {
            filterBtn.classList.remove("active")
        }
    }

    function riempiSelectMaterieModal(){
            for (const key in elencoMaterie) {
                const option = document.createElement("option")
                option.textContent = elencoMaterie[key]
                option.value = key
                selectMateriaModal.appendChild(option)
            }
    }
}