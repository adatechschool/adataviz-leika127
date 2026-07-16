import { formaterDonnee, appliquerFiltres, trierParDate, trierParNom, calculerParDecennie, calculerTopSalles, formaterDateFr } from './utils.js';
import './style.css';

let toutesLesDonnees = [];

function creerCarte(concert) {
  const carte = document.createElement("div");
  carte.classList.add("carte");

  const titre = document.createElement("p");
  titre.classList.add("titre");
  titre.textContent = concert.nom;

  const infoDate = document.createElement("p");
  infoDate.classList.add("info");
  infoDate.textContent = concert.date;

  const infoSalle = document.createElement("p");
  infoSalle.classList.add("info");
  infoSalle.textContent = concert.salle;

  carte.appendChild(titre);
  carte.appendChild(infoDate);
  carte.appendChild(infoSalle);

  return carte;
}

function afficherCartes(donnees) {
  const conteneurCartes = document.querySelector("#conteneur-cartes");
  conteneurCartes.innerHTML = "";

  if (donnees.length === 0) {
    const messageVide = document.createElement("p");
    messageVide.classList.add("message-vide");
    messageVide.textContent = "Aucun concert ne correspond à ta recherche.";
    conteneurCartes.appendChild(messageVide);
    return;
  }

  const groupes = {};
  donnees.forEach((concert) => {
    if (!groupes[concert.annee]) {
      groupes[concert.annee] = [];
    }
    groupes[concert.annee].push(concert);
  });

  const annees = Object.keys(groupes).sort((a, b) => b - a);

  annees.forEach((annee) => {
    const carteAnnee = document.createElement("div");
    carteAnnee.classList.add("carte-annee");

    const badgeAnnee = document.createElement("span");
    badgeAnnee.classList.add("badge");
    badgeAnnee.textContent = annee;

    const sousConteneur = document.createElement("div");
    sousConteneur.classList.add("sous-cartes");

    groupes[annee].forEach((concert) => {
      sousConteneur.appendChild(creerCarte(concert));
    });

    carteAnnee.appendChild(badgeAnnee);
    carteAnnee.appendChild(sousConteneur);
    conteneurCartes.appendChild(carteAnnee);
  });
}

function afficherStatistiques(donnees) {
  const parDecennie = calculerParDecennie(donnees);
  const conteneurDecennies = document.querySelector("#stats-decennies");
  conteneurDecennies.innerHTML = "";
  const maxDecennie = Math.max(...parDecennie.map((d) => d.total), 1);

  parDecennie.forEach(({ decennie, total }) => {
    const ligne = document.createElement("div");
    ligne.classList.add("stat-ligne");

    const label = document.createElement("span");
    label.classList.add("stat-label");
    label.textContent = `${decennie}s`;

    const barreConteneur = document.createElement("div");
    barreConteneur.classList.add("stat-barre-conteneur");

    const barre = document.createElement("div");
    barre.classList.add("stat-barre", "stat-barre-rose");
    barre.style.width = `${(total / maxDecennie) * 100}%`;

    const valeur = document.createElement("span");
    valeur.classList.add("stat-valeur");
    valeur.textContent = total;

    barreConteneur.appendChild(barre);
    ligne.appendChild(label);
    ligne.appendChild(barreConteneur);
    ligne.appendChild(valeur);
    conteneurDecennies.appendChild(ligne);
  });

  const topSalles = calculerTopSalles(donnees, 5);
  const conteneurSalles = document.querySelector("#stats-salles");
  conteneurSalles.innerHTML = "";
  const maxSalle = Math.max(...topSalles.map((s) => s.total), 1);

  topSalles.forEach(({ salle, total }) => {
    const ligne = document.createElement("div");
    ligne.classList.add("stat-ligne");

    const label = document.createElement("span");
    label.classList.add("stat-label", "stat-label-salle");
    label.textContent = salle;

    const barreConteneur = document.createElement("div");
    barreConteneur.classList.add("stat-barre-conteneur");

    const barre = document.createElement("div");
    barre.classList.add("stat-barre", "stat-barre-sarcelle");
    barre.style.width = `${(total / maxSalle) * 100}%`;

    const valeur = document.createElement("span");
    valeur.classList.add("stat-valeur");
    valeur.textContent = total;

    barreConteneur.appendChild(barre);
    ligne.appendChild(label);
    ligne.appendChild(barreConteneur);
    ligne.appendChild(valeur);
    conteneurSalles.appendChild(ligne);
  });
}

function afficherCompteur(nombre) {
  const total = document.querySelector("#total");
  if (nombre === 0) {
    total.textContent = "";
    return;
  }
  const suffixe = nombre > 1 ? "s" : "";
  total.textContent = `${nombre} concert${suffixe} trouvé${suffixe}`;
}

function trier(donnees, cle) {
  switch (cle) {
    case "date-asc":
      return trierParDate(donnees, "asc");
    case "date-desc":
      return trierParDate(donnees, "desc");
    case "nom-asc":
      return trierParNom(donnees, "asc");
    case "nom-desc":
      return trierParNom(donnees, "desc");
    default:
      return donnees;
  }
}

function remplirFiltreAnnees(donnees) {
  const selectAnnee = document.querySelector("#filtre-annee");
  const annees = [...new Set(donnees.map(concert => concert.annee))];
  annees.sort((a, b) => b - a);
  annees.forEach((annee) => {
    const option = document.createElement("option");
    option.value = annee;
    option.textContent = annee;
    selectAnnee.appendChild(option);
  });
}

const inputRecherche = document.querySelector("#recherche-nom");
const selectAnnee = document.querySelector("#filtre-annee");
const selectTri = document.querySelector("#tri-concerts");

function mettreAJourAffichage() {
  const recherche = inputRecherche.value;
  const annee = selectAnnee.value;
  const cleTri = selectTri.value;

  const filtres = appliquerFiltres(toutesLesDonnees, recherche, annee);
  const resultats = trier(filtres, cleTri);

  afficherCartes(resultats);
  afficherCompteur(resultats.length);
}

function afficherEtat(message, type = "info") {
  const etat = document.querySelector("#etat");
  etat.textContent = message;
  etat.classList.remove("etat-erreur", "etat-chargement");
  if (message) {
    etat.classList.add(type === "erreur" ? "etat-erreur" : "etat-chargement");
  }
}

const fetchData = async () => {
  const url = "https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/artistes_concerts_transmusicales/records";
  const limit = 100;

  afficherEtat("Chargement des concerts...", "info");

  try {
    const premiereReponse = await fetch(`${url}?limit=1`);
    if (!premiereReponse.ok) {
      throw new Error(`Erreur ${premiereReponse.status}`);
    }
    const premiereDonnee = await premiereReponse.json();
    const totalEnregistrements = premiereDonnee.total_count;

    const nombreDePages = Math.ceil(totalEnregistrements / limit);

    const promesses = [];
    for (let i = 0; i < nombreDePages; i++) {
      const offset = i * limit;
      promesses.push(
        fetch(`${url}?limit=${limit}&offset=${offset}`).then((reponse) => {
          if (!reponse.ok) {
            throw new Error(`Erreur ${reponse.status}`);
          }
          return reponse.json();
        })
      );
    }

    const toutesLesReponses = await Promise.all(promesses);
    const tousLesResultats = toutesLesReponses.flatMap(reponse => reponse.results);

    // Pas de "const" ici : on remplit la variable globale existante
    toutesLesDonnees = tousLesResultats.map(formaterDonnee);
    remplirFiltreAnnees(toutesLesDonnees);

    // Ordre d'affichage au chargement initial : cartes → statistiques → compteur → état
    const donneesTriees = trier(toutesLesDonnees, selectTri.value);
    afficherCartes(donneesTriees);
    afficherStatistiques(toutesLesDonnees);
    afficherCompteur(donneesTriees.length);
    afficherEtat("");
  } catch (error) {
    console.error("erreur de donnée", error.message);
    afficherEtat(
      "Impossible de charger les concerts. Vérifie ta connexion et réessaie.",
      "erreur"
    );
  }
};

// Ne pas oublier d'appeler la fonction !
fetchData();

inputRecherche.addEventListener("input", mettreAJourAffichage);
selectAnnee.addEventListener("change", mettreAJourAffichage);
selectTri.addEventListener("change", mettreAJourAffichage);

const boutonCarte = document.querySelector("#toggle-carte");
const carteRennes = document.querySelector("#carte_de_Rennes");
const boutonFermerCarte = document.querySelector("#fermer-carte");

function ouvrirCarte() {
  carteRennes.hidden = false;
}

function fermerCarte() {
  carteRennes.hidden = true;
}

boutonCarte.addEventListener("click", ouvrirCarte);
boutonFermerCarte.addEventListener("click", fermerCarte);

carteRennes.addEventListener("click", (evenement) => {
  if (evenement.target === carteRennes) {
    fermerCarte();
  }
});