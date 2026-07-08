import { describe, it, expect } from 'vitest';
import {
  formaterDonnee,
  filtrerParNom,
  filtrerParAnnee,
  appliquerFiltres,
  trierParDate,
  trierParNom,
  formaterDateFr,
} from './utils.js';

describe('formaterDonnee', () => {
  it('formate un concert complet', () => {
    const item = {
      artistes: 'Berlin 38',
      annee: 1981,
      '1ere_date': '1981-12-05',
      '1ere_salle': 'La Cité',
    };

    const resultat = formaterDonnee(item);

    expect(resultat.nom).toBe('Berlin 38');
    expect(resultat.annee).toBe(1981);
    expect(resultat.dateBrute).toBe('1981-12-05');
    expect(resultat.date).toBe('5 décembre 1981');
    expect(resultat.salle).toBe('La Cité');
  });

  it('renvoie "Date inconnue" et dateBrute null si la date est absente', () => {
    const item = { artistes: 'Donald', annee: 1981, '1ere_salle': 'Liberté' };

    const resultat = formaterDonnee(item);

    expect(resultat.date).toBe('Date inconnue');
    expect(resultat.dateBrute).toBeNull();
  });

  it('renvoie "Salle inconnue" si la salle est absente', () => {
    const item = { artistes: 'Fracture', annee: 1979, '1ere_date': '1979-06-15' };

    const resultat = formaterDonnee(item);

    expect(resultat.salle).toBe('Salle inconnue');
  });
});

describe('filtrerParNom', () => {
  const donnees = [
    { nom: 'Berlin 38', annee: 1981 },
    { nom: 'Donald', annee: 1981 },
    { nom: 'France-Angleterre', annee: 1981 },
    { nom: null, annee: 1980 },
  ];

  it('filtre en ignorant la casse', () => {
    const resultats = filtrerParNom(donnees, 'berlin');
    expect(resultats).toEqual([{ nom: 'Berlin 38', annee: 1981 }]);
  });

  it('trouve une correspondance partielle', () => {
    const resultats = filtrerParNom(donnees, 'don');
    expect(resultats).toEqual([{ nom: 'Donald', annee: 1981 }]);
  });

  it('ignore les éléments sans nom sans planter', () => {
    const resultats = filtrerParNom(donnees, '');
    expect(resultats).toHaveLength(3);
  });

  it('renvoie un tableau vide si rien ne correspond', () => {
    const resultats = filtrerParNom(donnees, 'zzz');
    expect(resultats).toEqual([]);
  });
});

describe('filtrerParAnnee', () => {
  const donnees = [
    { nom: 'Berlin 38', annee: 1981 },
    { nom: 'Les Parasites', annee: 1980 },
  ];

  it('filtre correctement même si annee est une chaine (valeur de select)', () => {
    const resultats = filtrerParAnnee(donnees, '1981');
    expect(resultats).toEqual([{ nom: 'Berlin 38', annee: 1981 }]);
  });

  it('filtre correctement si annee est un nombre', () => {
    const resultats = filtrerParAnnee(donnees, 1980);
    expect(resultats).toEqual([{ nom: 'Les Parasites', annee: 1980 }]);
  });

  it('renvoie un tableau vide si aucune correspondance', () => {
    const resultats = filtrerParAnnee(donnees, '1999');
    expect(resultats).toEqual([]);
  });
});

describe('appliquerFiltres', () => {
  const donnees = [
    { nom: 'Berlin 38', annee: 1981 },
    { nom: 'Donald', annee: 1981 },
    { nom: 'Les Parasites', annee: 1980 },
  ];

  it('combine recherche et annee', () => {
    const resultats = appliquerFiltres(donnees, 'do', '1981');
    expect(resultats).toEqual([{ nom: 'Donald', annee: 1981 }]);
  });

  it('applique seulement la recherche si annee est vide', () => {
    const resultats = appliquerFiltres(donnees, 'berlin', '');
    expect(resultats).toEqual([{ nom: 'Berlin 38', annee: 1981 }]);
  });

  it('applique seulement le filtre annee si recherche est vide', () => {
    const resultats = appliquerFiltres(donnees, '', '1980');
    expect(resultats).toEqual([{ nom: 'Les Parasites', annee: 1980 }]);
  });

  it('renvoie tout si aucun filtre actif', () => {
    const resultats = appliquerFiltres(donnees, '', '');
    expect(resultats).toHaveLength(3);
  });
});

describe('trierParDate', () => {
  const donnees = [
    { nom: 'B', dateBrute: '1981-12-05' },
    { nom: 'A', dateBrute: '1980-06-15' },
    { nom: 'C', dateBrute: '1981-06-12' },
  ];

  it('trie du plus ancien au plus récent par défaut', () => {
    const resultats = trierParDate(donnees);
    expect(resultats.map(c => c.nom)).toEqual(['A', 'C', 'B']);
  });

  it('trie du plus récent au plus ancien avec "desc"', () => {
    const resultats = trierParDate(donnees, 'desc');
    expect(resultats.map(c => c.nom)).toEqual(['B', 'C', 'A']);
  });

  it('place les dates manquantes a la fin', () => {
    const avecDateManquante = [...donnees, { nom: 'D', dateBrute: null }];
    const resultats = trierParDate(avecDateManquante);
    expect(resultats.at(-1).nom).toBe('D');
  });

  it('ne modifie pas le tableau original', () => {
    const copieOriginale = [...donnees];
    trierParDate(donnees);
    expect(donnees).toEqual(copieOriginale);
  });
});

describe('trierParNom', () => {
  const donnees = [
    { nom: 'Fracture' },
    { nom: 'Berlin 38' },
    { nom: 'Donald' },
  ];

  it('trie de A a Z par defaut', () => {
    const resultats = trierParNom(donnees);
    expect(resultats.map(c => c.nom)).toEqual(['Berlin 38', 'Donald', 'Fracture']);
  });

  it('trie de Z a A avec "desc"', () => {
    const resultats = trierParNom(donnees, 'desc');
    expect(resultats.map(c => c.nom)).toEqual(['Fracture', 'Donald', 'Berlin 38']);
  });

  it('place les noms manquants a la fin', () => {
    const avecNomManquant = [...donnees, { nom: null }];
    const resultats = trierParNom(avecNomManquant);
    expect(resultats.at(-1).nom).toBeNull();
  });
});

describe('formaterDateFr', () => {
  it('formate une date ISO en francais', () => {
    expect(formaterDateFr('1981-12-05')).toBe('5 décembre 1981');
  });

  it('formate une autre date correctement', () => {
    expect(formaterDateFr('2024-01-01')).toBe('1 janvier 2024');
  });
});