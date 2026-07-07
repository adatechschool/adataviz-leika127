import './style.css'
import { formaterDonnee } from './utils.js'

const URL_API = 'https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/artistes_concerts_transmusicales/records?limit=20';

document.querySelector('#app').innerHTML = `
  <h1>Trans Musicales — Rennes</h1>
  <p id="total"></p>
  <div id="conteneur-cartes"></div>
`

import { formaterDonnee, filtrerParNom } from "./utils.js";

const chargerDonnees = async () => {
  /**
 * Récupère la totalité des enregistrements du dataset via pagination.
 * @returns {Promise<Array>} Le tableau complet des enregistrements bruts.
 */
  const url = "https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/artistes_concerts_transmusicales/records";
  const limite = 100;
  let offset = 0;
  let totalCount = 0;
  const toutesLesDonnees = [];

  while (true) {
    try {
      const reponse = await fetch(`${url}?limit=${limite}&offset=${offset}`);
      const donneesJson = await reponse.json();

      totalCount = donneesJson.total_count;

      for (const item of donneesJson.results) {
        toutesLesDonnees.push(item);
      }

      offset += limite;

      if (offset >= totalCount) {
        break;
      }
    } catch (erreur) {
      console.error("Erreur lors du chargement des données :", erreur);
      return toutesLesDonnees;
    }
  }

  return toutesLesDonnees;
};

/**
 * Formate un enregistrement brut de l'API en un objet simplifié.
 * @param {Object} item - L'enregistrement brut.
 * @returns {{nom: string, annee: string, salle: string}}
 */
const formaterDonnee = (item) => {
  const resultat = {};
  resultat.nom = item.artistes;
  resultat.annee = item.annee;
  resultat.salle = item["1ere_salle"];

  if (!resultat.salle) {
    resultat.salle = "Salle inconnue";
  }

  return resultat;
};

/**
 * Filtre les données formatées par nom d'artiste (insensible à la casse).
 * @param {Array} donnees - Les données déjà formatées.
 * @param {string} recherche - Le terme recherché.
 * @returns {Array} Les éléments dont le nom contient la recherche.
 */
const filtrerParNom = (donnees, recherche) => {
  const resultats = [];
  const rechercheMinuscule = recherche.toLowerCase();

  for (const item of donnees) {
    const nomMinuscule = item.nom.toLowerCase();

    if (nomMinuscule.includes(rechercheMinuscule)) {
      resultats.push(item);
    }
  }

  return resultats;
};


// Récupère les données brutes de l'API et les transforme avec formaterDonnee
const recupererDonnees = async () => {
  const reponse = await fetch(URL_API);
  const donneesBrutes = await reponse.json();

  const donneesFormatees = donneesBrutes.results.map((item) => formaterDonnee(item));

  return donneesFormatees;
};

// Affiche le nombre total de résultats trouvés dans le DOM
const afficherTotal = (nombre) => {
  const elementTotal = document.querySelector('#total');
  elementTotal.textContent = `${nombre} concerts`;
};

// Construit et insère une carte par concert dans le DOM
const afficherCartes = (donnees) => {
  const conteneur = document.querySelector('#conteneur-cartes');

  const html = donnees
    .map(
      (donnee) => `
      <div class="carte">
        <h2>${donnee.artiste}</h2>
        <p>Année : ${donnee.annee}</p>
        <p>Salle : ${donnee.salle}</p>
      </div>
    `
    )
    .join('');

  conteneur.innerHTML = html;
};

// Point d'entrée : orchestre récupération + affichage
const init = async () => {
  const donnees = await recupererDonnees();
  afficherTotal(donnees.length);
  afficherCartes(donnees);
};

init();