import { describe, it, expect } from "vitest";
import { formaterDonnee, filtrerParNom } from "./utils.js";

describe("formaterDonnee", () => {
  it("extrait nom, annee et salle depuis un item brut", () => {
    const item = {
      artistes: "Philippe Brunel Groupe",
      annee: "1979",
      "1ere_salle": "La Cité",
    };

    const resultat = formaterDonnee(item);

    expect(resultat).toEqual({
      nom: "Philippe Brunel Groupe",
      annee: "1979",
      salle: "La Cité",
    });
  });

  it("remplace une salle manquante par 'Salle inconnue'", () => {
    const item = {
      artistes: "Artiste Test",
      annee: "1980",
      "1ere_salle": null,
    };

    const resultat = formaterDonnee(item);

    expect(resultat.salle).toBe("Salle inconnue");
  });
});

describe("filtrerParNom", () => {
  const donnees = [
    { nom: "Philippe Brunel Groupe", annee: "1979", salle: "La Cité" },
    { nom: "Les Parasites", annee: "1980", salle: "La Cité" },
    { nom: "Mister Mongol", annee: "1980", salle: "La Cité" },
  ];

  it("retourne les éléments dont le nom contient la recherche", () => {
    const resultats = filtrerParNom(donnees, "parasites");

    expect(resultats).toEqual([
      { nom: "Les Parasites", annee: "1980", salle: "La Cité" },
    ]);
  });

  it("est insensible à la casse", () => {
    const resultats = filtrerParNom(donnees, "MONGOL");

    expect(resultats).toEqual([
      { nom: "Mister Mongol", annee: "1980", salle: "La Cité" },
    ]);
  });

  it("retourne un tableau vide si rien ne correspond", () => {
    const resultats = filtrerParNom(donnees, "inexistant");

    expect(resultats).toEqual([]);
  });
});