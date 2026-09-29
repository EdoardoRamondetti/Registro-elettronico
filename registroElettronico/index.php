<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard Studente</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="./voti.css">
  <link rel="stylesheet" href="assenze.css">
  <link rel="stylesheet" href="planning.css">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
  <script src="./librerie/axios@1.1.2.min.js"></script>
  <script src="./libreria.js"></script>
  <script src="index.js"></script>
</head>
<body>
  <?php
session_start();
if (!isset($_SESSION["matricola"])) {
    header("Location: login.html");
    die();
}
?>
<!--sezione studenti-->
<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark px-4 d-none" >
  <a class="navbar-brand" href="#">Registro Studente</a>

  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav me-auto">
      <li class="nav-item">
        <a class="nav-link" href="#" id="votiNavBar">Voti</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" id="assenzeNavBar">Assenze</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" id="planningNavBar">Planning</a>
      </li>
    </ul>
    
    <div class="d-flex">
      <button id="logoutBtn" class="btn btn-outline-light">
        <i class="bi bi-box-arrow-right me-1"></i>Logout
      </button>
    </div>
  </div>
</nav>

<div class="main-container" style="display:none;">
  <header class="dashboard-header">
    <h1>Benvenuto, <span id="nomeStudente"></span></h1>
  </header>

  <section class="dashboard-grid">
    <div class="dashboard-card card-voti" id="cardVoti">
      <i class="bi bi-bar-chart-fill text-primary"></i>
      <h4>Voti</h4>
      <p>Visualizza i tuoi voti</p>
    </div>

    <div class="dashboard-card card-assenze" id="cardAssenze">
      <i class="bi bi-calendar-x-fill text-danger"></i>
      <h4>Assenze</h4>
      <p>Visualizza le tue assenze</p>
    </div>

    <div class="dashboard-card card-planning" id="cardPlanning">
      <i class="bi bi-journal-bookmark-fill text-success"></i>
      <h4>Planning</h4>
      <p>Consulta gli argomenti fatti in classe</p>
    </div>
  </section>
</div>

  <div class="votiContainer" style="display: none;">
    <div class="header">
      <p class="student-name">Voti di <span id="studentName"></span></p>
      <p class="avg-grade">
        Media Voti Attuale: 
        <span class="badge" id="averageGrade"></span>
      </p>
    </div>

    <div class="filter-section">
      <label for="materiaFilter" class="form-label mb-3">Filtra per Materia:</label>
      <select id="materiaFilter" class="form-select form-select-lg">
        <option value="">Tutte le Materie</option>
      </select>
    </div>

    <div class="table-responsive-custom">
      <div class="d-flex align-items-center mb-2 mt-2 ms-2" id="selezionNumeroRighe">
      <label style="padding-left:5px;padding-top:5px;padding-bottom:5px"><span>Visualizza</span>
        <select id="rowsPerPage" class="form-select d-inline-block w-auto">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="">Tutti</option>
      </select> per pagina
    </label>
      </div>
      <table id="gradesTable" class="table table-hover table-custom text-white mb-0">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Data</th>
            <th>Voto</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

    <button id="prevPage" class="btn btn-primary me-3 ms-3 mb-3 mt-3">Indietro</button>
    <button id="nextPage" class="btn btn-primary mb-3 mt-3">Avanti</button>

        <div id="msgNoVoti" style="display:none; padding: 1rem; text-align:center; color:#d7d0ff; font-style: italic;">
          Nessun voto disponibile.
      </div>
    </div>
  </div>

<div class="assenzeContainer" style="display: none;">
  <div class="header">
    <p class="student-name">Assenze di <span id="studentNameAssenze"></span></p>
    <p class="avg-grade">
      Totale Assenze: 
      <span class="badge" id="totalAssenze"></span>
    </p>
  </div>

  <div class="filter-calendar-container">
      <div class="filter-section-assenze">
      <button class="filter-btn active" data-filter="all">
        <i class="bi bi-list-ul me-2"></i>Tutte
      </button>
      <button class="filter-btn" data-filter="giustificate">
        <i class="bi bi-check-circle me-2"></i>Giustificate
      </button>
      <button class="filter-btn" data-filter="non-giustificate">
        <i class="bi bi-exclamation-circle me-2"></i>Non Giustificate
      </button>
    </div>

    <div class="calendar-section">
      <label for="dateInput">Seleziona una data</label>
      <input type="date" id="dateInput">
    </div>

    <div class="d-flex align-items-center mb-2 mt-2 ms-2" id="selezionaNumeroRigheAssenze">
      <label style="padding-left:5px;padding-top:5px;padding-bottom:5px; color:white;"><span>Visualizza</span>
        <select id="rowsPerPageAssenze" class="form-select d-inline-block w-auto">
        <option value="5">5</option>
        <option value="10" selected>10</option>
        <option value="">Tutti</option>
      </select> per pagina
    </label>
      </div>
  </div>

  <div class="table-responsive-custom">
    <table id="assenzeTable" class="table table-hover table-custom text-white">
      <thead>
        <tr>
          <th>Data</th>
          <th>Giustificato</th>
        </tr>
      </thead>
      <tbody id="assenzeTableBody">
      </tbody>
    </table>

    <button id="prevPageAssenze" class="btn btn-primary mt-3 mb-3 me-3 ms-3" disabled>Indietro</button>
    <button id="nextPageAssenze" class="btn btn-primary mt-3 mb-3">Avanti</button>

      <h1 class="d-none mt-4 mb-4" id="nessunaClasseTrovatatext" style="text-align:center">Nessuna assenza trovata</h1>
  </div>
</div>

<div class="planningContainer" style="display: none;">
  <div class="header">
    <p class="student-name">Planning classe <span id="classNamePlanning"></span></p>
  </div>

  <div class="filter-section-forPlanning">
    <label for="materiaFilterPlanning" class="form-label mb-3 text-light">Filtra per Materia:</label>
    <select id="materiaFilterPlanning" class="form-select form-select-lg">
      <option value="">Tutte le Materie</option>
    </select>
  </div>

    <div class="calendar-section calendar-section-planning">
      <label for="dateInputPlanning">Seleziona una data</label>
      <input type="date" id="dateInputPlanning">
    </div>

    <div class="d-flex align-items-center mb-2 mt-2 ms-2" id="selezionaNumeroRighePlanning">
      <label style="padding-left:5px;padding-top:5px;padding-bottom:5px; margin:0 auto; color:white;"><span>Visualizza</span>
        <select id="rowsPerPagePlanning" class="form-select d-inline-block w-auto">
        <option value="5">5</option>
        <option value="10" selected="">10</option>
        <option value="">Tutti</option>
      </select> per pagina
    </label>
      </div>

  <div class="table-responsive-custom">
    <table id="planningTable" class="table table-hover table-custom text-white">
      <thead>
        <tr>
          <th>Data</th>
          <th>Materia</th>
          <th>Argomento</th>
        </tr>
      </thead>
      <tbody id="planningTableBody"></tbody>
    </table>

    <button id="prevPagePlanning" class="btn btn-primary mt-3 mb-3 me-3 ms-3" disabled="">Indietro</button>
    <button id="nextPagePlanning" class="btn btn-primary mt-3 mb-3">Avanti</button>

    <h1 id="msgNoPlanning" class="mt-4 mb-4" style="display:none; padding: 1rem; text-align:center;">
      Nessun argomento pianificato.
    </h1>
  </div>
</div>

<!--sezione docenti-->
<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark px-4 d-none" id="navbarDocente">
  <div class="container-fluid">
    <a class="navbar-brand" href="#" id="homeDocente">Registro Docente</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDocenteContent" aria-controls="navbarDocenteContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse" id="navbarDocenteContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="#" id="navGestioneAssenze">Gestione Assenze</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" id="navAssegnaVoti">Assegna Voti</a>
        </li>
      </ul>
      <button class="btn btn-outline-light" id="logoutDocenteBtn">
      <i class="bi bi-box-arrow-right me-1"></i>Logout
    </button>
    </div>
  </div>
</nav>

<div class="main-container-docenti" style="display:none;">
  <header class="dashboard-header">
    <h1>Benvenuto, <span id="nomeDocente"></span></h1>
  </header>

  <section class="dashboard-grid">
    <div class="dashboard-card card-assenze" id="cardAssenzeDocenti">
      <i class="bi bi-person-x-fill text-danger"></i>
      <h4>Gestione Assenze</h4>
      <p>Visualizza gli studenti e registra le assenze di oggi</p>
    </div>

    <div class="dashboard-card card-voti-docente" id="cardVotiDocente">
      <i class="bi bi-pencil-square text-success"></i>
      <h4>Assegna Voti</h4>
      <p>Visualizza gli studenti e assegna voti per oggi</p>
    </div>
  </section>
</div>

<div class="container mt-4 d-none gestioneAssenze" id="registrazioneAssenzeContainer">
  <h2 class="mb-4">Gestione Assenze</h2>
  <div class="table-responsive-custom">
    <div class="d-flex align-items-center mb-2 mt-2 ms-2" id="selezionNumeroRigheAssenze">
      <label for="classeSelectDocente" class="form-label">Seleziona Classe</label>
      <select class="form-select" id="classeSelectDocente">
        <option selected>Scegli una classe</option>
      </select>
    </div>
    <table id="tabellaStudentiAssenze" class="table table-hover table-custom text-white">
      <thead class="table-light">
        <tr>
          <th>Nome</th>
          <th>Cognome</th>
          <th>Segna assenza</th>
        </tr>
      </thead>
      <tbody id="studentiBodyAssenze">
      </tbody>
    </table>
  </div>
</div>

<div class="container mt-4 d-none gestioneVoti" id="registrazioneVotiContainer">
  <h2 class="mb-4" style="margin-top:50px;">Assegna Voti</h2>
  <div class="table-responsive-custom">
    <div class="d-flex align-items-center mb-2 mt-2 ms-2" id="selezionNumeroRigheVoti">
      <label for="classeSelectDocenteVoti" class="form-label">Seleziona Classe</label>
      <select class="form-select" id="classeSelectDocenteVoti">
        <option selected>Scegli una classe</option>
      </select>
    </div>
    <table id="tabellaStudentiVoti" class="table table-hover table-custom text-white">
      <thead class="table-light">
        <tr>
          <th>Nome</th>
          <th>Cognome</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody id="studentiBodyVoti">
      </tbody>
    </table>

<div class="modal fade" id="modaleAssegnaVoto" tabindex="-1" aria-labelledby="modalVotoLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-md">
    <div class="modal-content shadow-lg rounded-4 border-0">

      <div class="modal-header bg-primary text-white rounded-top px-4 py-3">
        <h5 class="modal-title" id="modalVotoLabel">Assegna Voto</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Chiudi"></button>
      </div>

      <div class="modal-body px-4 py-4 bg-light">
        <form id="formVoto" novalidate>
          <div class="mb-4">
            <label for="selectMateria" class="form-label fw-semibold" style="color:#2c3e50;">Materia</label>
            <select class="form-select" id="selectMateria" required style="color:#34495e; background-color:#f0f4f8;">
            </select>
            <div style="display:none; color:red;" id="invalidMateria">Scegli una materia</div>
          </div>

          <div class="mb-4">
            <label for="inputVoto" class="form-label fw-semibold" style="color:#2c3e50;">Voto</label>
            <input type="number" class="form-control" id="inputVoto" min="1" max="10" placeholder="Inserisci un voto da 1 a 10" required style="color:#34495e;">
            <div style="display:none; color:red;" id="invalidVoto">Inserisci un voto valido</div>
          </div>
        </form>
      </div>

      <div class="modal-footer bg-light border-0 px-4 py-3">
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Annulla</button>
        <button type="button" form="formVoto" class="btn btn-primary rounded-pill px-4" id="btnSalvaVoto">Salva</button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="modaleVisualizzaVoti" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content" style="color:black;">

      <div class="modal-header">
        <h5 class="modal-title" id="modalVotoLabel">Elenco voti</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <div class="table-responsive-custom">
          <div class="d-flex align-items-center gap-3 mb-2">
            <h3 class="text-black ms-3 mt-3">Media voti studente: <span id="spanMediaVotiStudenteModal"></span></h3>
            <div>
             <label for="selectMateriaModal" class="fw-semibold text-dark">Materia</label>
            <select class="form-select" id="selectMateriaModal" required style="color:#34495e; background-color:#f0f4f8;">
              <option value="">Tutte</option>
            </select>
            </div>
            <div class="d-flex flex-column">
              <label class="text-dark fw-semibold"><span>Visualizza</span></label>
              <select id="rowsPerPageModal" class="form-select d-inline-block w-auto" style="color:#34495e; background-color:#f0f4f8;">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="">Tutti</option>
              </select>
            </div>
          </div>
        <table class="modal-table table table-hover table-custom text-black mb-0">
            <thead>
              <th>Materia</th>
              <th>Data</th>
              <th>Voto</th>
            </thead>
            <tbody class="modal-table-tbody">
            </tbody>
        </table>

          <div class="d-flex justify-content-center">
            <button id="prevPageModal" class="btn btn-primary me-3 ms-3 mb-3 mt-3">Indietro</button>
            <button id="nextPageModal" class="btn btn-primary mb-3 mt-3">Avanti</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

</div>
</div>

</body>
</html>