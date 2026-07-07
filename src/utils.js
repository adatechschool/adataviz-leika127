export const formaterDonnee = (item) => {
  const resultat = {};
  resultat.nom = item.artistes;
  resultat.annee = item.annee;
  resultat.date = item["1ere_date"] ? formaterDateFr(item["1ere_date"]) : "Date inconnue";
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
    if (!item.nom) {
      continue; // on saute cet élément, pas de nom à comparer
    }

    const nomMinuscule = item.nom.toLowerCase();

    if (nomMinuscule.includes(rechercheMinuscule)) {
      resultats.push(item);
    }
  }

  return resultats;
};

export const filtrerParAnnee = (donnees, annee) => {
  const resultats = [];

  for (const item of donnees) {
    if (item.annee === annee) {
      resultats.push(item);
    }
  }

  return resultats;
};

export const formaterDateFr = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
