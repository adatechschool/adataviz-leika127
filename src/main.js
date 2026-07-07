import { formaterDonnee, filtrerParNom, filtrerParAnnee, formaterDateFr } from './utils.js';

let toutesLesDonnees = [];

function creerCarte(concert) {
  const carte = document.createElement("div");
  carte.classList.add("carte");

  const badge = document.createElement("span");
  badge.classList.add("badge");
  badge.textContent = concert.annee;

  const titre = document.createElement("p");
  titre.classList.add("titre");
  titre.textContent = concert.nom;

  const infoDate = document.createElement("p");
  infoDate.classList.add("info");
  infoDate.textContent = concert.date;

  const infoSalle = document.createElement("p");
  infoSalle.classList.add("info");
  infoSalle.textContent = concert.salle;

  carte.appendChild(badge);
  carte.appendChild(titre);
  carte.appendChild(infoDate);
  carte.appendChild(infoSalle);

  return carte;
}

function afficherCartes(donnees) {
  const conteneurCartes = document.querySelector("#conteneur-cartes");
  conteneurCartes.innerHTML = "";

  donnees.forEach((concert) => {
    const carte = creerCarte(concert);
    conteneurCartes.appendChild(carte);
  });
}

fetch("https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/artistes_concerts_transmusicales/records?limit=20")
  .then(response => response.json())
  .then((data) => {
    toutesLesDonnees = data.results.map(formaterDonnee);
    afficherCartes(toutesLesDonnees);
  });

const inputRecherche = document.querySelector("#recherche-nom");
const selectAnnee = document.querySelector("#filtre-annee");

inputRecherche.addEventListener("input", () => {
  const resultats = filtrerParNom(toutesLesDonnees, inputRecherche.value);
  afficherCartes(resultats);
});

selectAnnee.addEventListener("change", () => {
  const anneeChoisie = selectAnnee.value;
  const resultats = anneeChoisie
    ? filtrerParAnnee(toutesLesDonnees, anneeChoisie)
    : toutesLesDonnees;
  afficherCartes(resultats);
});