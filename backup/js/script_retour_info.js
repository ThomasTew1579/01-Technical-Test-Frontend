//https://api.openbrewerydb.org/breweries?by_country=england&page=1#

// united_states !370 pages et 7926 resultats!!     'Ireland', 'South Korea', 'England', 'France', 'Scotland'

let paysChoisie = "france";

let filtre = "by_country";
let nombrePage = 1;
let reponseApi;
let reponseToutesLesPages = [];
let nombreDeBrasserieParPays;
let nombreDeBrasserieParRegions;
let nombreDeBrasserieParVille;

let compteur = {};
let compteurDeux = {};
let tableauCompteur = [];
let tableauCompteurDepartement = [];
let tableauVille = [];
let max;
let villePrincipal;
let tableauDepartement = [];
let villeIndex;

let infoNombrePays = document.querySelector("#brewberiesNo");

let infoNomDep = document.querySelector("#stateNa");
let infoNombreDep = document.querySelector("#stateNo");

let infoNomVille = document.querySelector("#cityNa");
let infoNombreVille = document.querySelector("#cityNo");

recevoirReponse(paysChoisie, nombrePage);

function nombreDepartement(ville, reponse) {
  for (const indexDepartment in reponse) {
    tableauDepartement.push(reponse[indexDepartment].state);
  } // insertion de toute les departement dans un tableau (tableauDepartement)

  for (var i = 0; i < tableauDepartement.length; i++) {
    let num = tableauDepartement[i];
    compteurDeux[num] = compteurDeux[num] ? compteurDeux[num] + 1 : 1;
  } // compteur de repetition des noms dans le tableau et injecter dans le tableau (compteur)

  for (const indexCompteur in tableauDepartement) {
    tableauCompteurDepartement.push(
      compteurDeux[tableauDepartement[indexCompteur]]
    );
  } // insertion du nombre de repetition de chaque departement dans le tableau (tableauCompteur) avec le meme index que (tableauDepartement)

  let Departement = tableauDepartement[ville];

  if (Departement == null) {
    console.log("Y'a pas de department dans ton pays a la con !");
    infoNomDep.append("No state in this country");
  } else {
    nombreDepartement =
      tableauCompteur[tableauDepartement.indexOf(Departement)];
    infoNomDep.append(Departement);
    infoNombreDep.append(nombreDepartement);

    console.log(nombreDepartement + " en " + Departement);
  }
}

// recherche de la ville avec le plus de brasserie dans le pays rechercher------------------------------------------------------

function definirVillePrincipale(reponse) {
  for (const indexVille in reponse) {
    tableauVille.push(reponse[indexVille].city);
  } // insertion de toute les ville dans un tableau (tableauVille)

  for (var i = 0; i < tableauVille.length; i++) {
    let num = tableauVille[i];
    compteur[num] = compteur[num] ? compteur[num] + 1 : 1;
  } // compteur de repetition des noms dans le tableau et injecter dans la variable (compteur)

  for (const indexCompteur in tableauVille) {
    tableauCompteur.push(compteur[tableauVille[indexCompteur]]);
  } // insertion du nombre de repetition de chaque ville dans le tableau (tableauCompteur) avec le meme index que tableauVille

  max = Math.max(...tableauCompteur);
  // calculer la valeur max dans (tableauCompteur)

  villePrincipal = tableauVille[tableauCompteur.indexOf(max)];

  villeIndex = tableauVille.indexOf(villePrincipal);
  console.log(villeIndex);

  if (villePrincipal == undefined) {
    console.log("pas de biere trouvé dans ton blede de merde"); //si l'API ne repond pas avec pays entré dans la recherche
  } else {
    console.log(max + " brasseries à " + villePrincipal); // valeur a afficher sur le site
    infoNomVille.append(" " + villePrincipal);
    infoNombreVille.append(max);
    nombreDepartement(villeIndex, reponse);
  }
}
//              valeur de sortie = villePrincipal  = la ville qui reviens le plus souvent dans la reponse de l'API
//                                 max             = le nombre de fois qu'elle reviens

//-------------------------------------------------------------------------------------------------------------------------------

// recuperer les information des brasserie---------------------------------------------------------------------------------------

function recupererNom(reponse) {
  for (const indexNom in reponse) {
    let nom;
    let adresse;
    let telephone;
    let site;
    if (reponse[indexNom].name == null) {
      nom = "";
    } else {
      nom = reponse[indexNom].name;
    }

    if (reponse[indexNom].street == null) {
      adresse = "no street";
    } else {
      adresse = reponse[indexNom].street;
    }

    if (reponse[indexNom].phone == null) {
      telephone = "no phone";
    } else {
      telephone = reponse[indexNom].phone;
    }

    if (reponse[indexNom].website_url == null) {
      site = "no website";
    } else {
      site = reponse[indexNom].website_url;
    }

    let refCard = document.getElementById("infoPhone");
    let nouvelleCard = document.createElement("div");

    nouvelleCard.innerHTML =
      "<table><tr><th>Name</th><td>" +
      nom +
      "</td></tr><tr><th>Address</th><td>" +
      adresse +
      "</td></tr><tr><th>Phone</th><td>" +
      telephone +
      "</td></tr><tr><th>Website</th><td>" +
      site +
      "</td></tr></table>";

    refCard.append(nouvelleCard);

    // Récupération d'une référence à la table
    let refTable = document.getElementById("infoDesk");

    // Insère une ligne dans la table à l'indice de ligne -1
    let nouvelleLigne = refTable.insertRow(-1);

    // Insère des cellules d'inforamtion
    nouvelleLigne.innerHTML =
      "<td>" +
      nom +
      "</td><td>" +
      adresse +
      "</td><td>" +
      telephone +
      "</td><td>" +
      site +
      "</td>";

    //https://developer.mozilla.org/fr/docs/Web/API/HTMLTableElement/insertRow

    console.log(nom + " , " + adresse + " , " + telephone + " , " + site);
  }
}
//               valeur de sortie = nom, adresse, telephone, site web
//------------------------------------------------------------------------------------------------------------------------------

// recuperation des information de l'API----------------------------------------------------------------------------------------

function recevoirReponse(pays) {
  const url =
    "https://api.openbrewerydb.org/breweries?" +
    filtre +
    "=" +
    pays +
    "&page=" +
    nombrePage +
    "#";
  let requete = new XMLHttpRequest();
  requete.open("GET", url);
  requete.responseType = "json";
  requete.send();
  requete.onload = function () {
    // verification d'une réponse de l'API
    if (requete.readyState === XMLHttpRequest.DONE) {
      // verification du code de succes de la requete
      if (requete.status === 200) {
        reponseApi = requete.response;
        // verification de la viabilité de la recherche
        if (reponseApi.length == 0 && nombrePage == 1) {
          console.log("rien sur la premiere page");
        } else {
          // si la reponse est viable, on verifie que la reponse contiens plusieurs page
          if (reponseApi.length != 20) {
            for (const indexBrasserie in reponseApi) {
              reponseToutesLesPages.push(reponseApi[indexBrasserie]);
            }
            definirVillePrincipale(reponseToutesLesPages);
            recupererNom(reponseToutesLesPages);
            console.log(reponseToutesLesPages.length + " en " + pays);
            infoNombrePays.append(reponseToutesLesPages.length);
          } else {
            // si la reponse contiens plusieur page on relance la requette a chaque page pleine ( nombre max de brasserie par page = 20)
            for (const indexBrasserie in reponseApi) {
              reponseToutesLesPages.push(reponseApi[indexBrasserie]);
            }
            nombrePage++;
            recevoirReponse(pays);
          }
        }
      } else {
        alert("Un problème est intervenu, merci de revenir plus tard.");
      }
    }
  };
}

//                valeur de sortie = nombre de brasserie dans le pays
//-------------------------------------------------------------------------------------------------------------------------------
