export const formaterDonnee = (item) => {
  const resultat = {};
  resultat.nom = item.artistes;
  resultat.annee = item.annee;
  resultat.salle = item["1ere_salle"];

  if (!resultat.salle) {
    resultat.salle = "Salle inconnue";
  }

  return resultat;
};

export const filtrerParNom = (donnees, recherche) => {
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