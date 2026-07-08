export const formaterDonnee = (item) => {
  const resultat = {};
  resultat.nom = item.artistes;
  resultat.annee = item.annee;
  resultat.dateBrute = item["1ere_date"] || null;
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
    // Comparaison en chaîne : item.annee peut être un nombre (API),
    // annee vient toujours d'un <select> donc c'est une chaîne.
    if (String(item.annee) === String(annee)) {
      resultats.push(item);
    }
  }

  return resultats;
};

export const appliquerFiltres = (donnees, recherche, annee) => {
  let resultats = donnees;

  if (recherche) {
    resultats = filtrerParNom(resultats, recherche);
  }

  if (annee) {
    resultats = filtrerParAnnee(resultats, annee);
  }

  return resultats;
};

export const trierParDate = (donnees, ordre = "asc") => {
  const copie = [...donnees];

  copie.sort((a, b) => {
    if (!a.dateBrute) return 1;
    if (!b.dateBrute) return -1;

    const dateA = new Date(a.dateBrute);
    const dateB = new Date(b.dateBrute);

    return ordre === "asc" ? dateA - dateB : dateB - dateA;
  });

  return copie;
};

export const trierParNom = (donnees, ordre = "asc") => {
  const copie = [...donnees];

  copie.sort((a, b) => {
    if (!a.nom) return 1;
    if (!b.nom) return -1;

    const comparaison = a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" });
    return ordre === "asc" ? comparaison : -comparaison;
  });

  return copie;
};

export const formaterDateFr = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
