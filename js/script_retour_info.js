//https://api.openbrewerydb.org/breweries?by_country=england&page=1#



// united_states !370 pages et 7926 resultats!!
//'Ireland', 'South_Korea', 'England', 'France', 'Scotland'
let infoPhoneT;
let infoDesk;
let beerMap;

let paysChoisie = "france";

recherche(paysChoisie);



  function getValue() {
    let input = document.getElementById("in").value;
    if (input == "" || input == " ") { 
      document.querySelector(".search").style.border = "solid red";
      document.querySelector(".searchButton").style.background = "red";
      document.querySelector(".aviable").style.display = "flex";

      console.log(search);
    } else {
      if (document.querySelector(".search").style.border == "solid red") {
        document.querySelector(".search").style.border = "none";
        document.querySelector(".searchButton").style.background = "#ebe645";
        document.querySelector(".aviable").style.display = "none";
        recherche(input);
      } else {
        clearAll();
        recherche(input);
      }
    }
  }


function clearAll(){
  const divPhone = document.getElementById('infoPhone')
  divPhone.remove();
  infoDesk.remove();
  const divMap = document.getElementById("map");
  divMap.remove();

}

function recherche(pays) {
  //https://waytolearnx.com/2019/07/comment-recuperer-la-valeur-dun-input-texte-en-javascript.html#:~:text=Vous%20pouvez%20simplement%20utiliser,bouton%20%C2%AB%20R%C3%A9cup%C3%A9rer%20la%20valeur%20%C2%BB.

  let filtre = "by_country";
  let nombrePage = 1;
  let reponseApi;
  let reponseToutesLesPages = [];
  var NombreTotalPays = 0;

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

  let refInfoDesk;
  let infoPhoneT;
  let refInfoPhone;

  let nouvelleCard;

  let nouvelleLigne;

  let lat = 0;
  let long = 0;

  let map;

  recevoirReponse(pays);

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
      infoNomDep.textContent = "No state in this country";
      infoNombreDep.textContent = "";
    } else {
      nombreDepartement =
        tableauCompteur[tableauDepartement.indexOf(Departement)];
      infoNomDep.textContent = Departement;
      infoNombreDep.textContent = nombreDepartement;

      console.log(nombreDepartement + " en " + Departement);
    }
  }

  // recherche de la ville avec le plus de brasserie dans le pays rechercher------------------------------------------------------

  function definirVillePrincipale(reponse) {

    refMap = document.getElementById("BeerMap");
    beerMap = document.createElement("div");
    beerMap.id = "map";
    refMap.append(beerMap);


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
    // console.log(villeIndex+" index");

    if (villePrincipal == undefined) {
      console.log("pas de biere trouvé dans ton blede de merde"); //si l'API ne repond pas avec pays entré dans la recherche
    } else {
      console.log(max + " brasseries à " + villePrincipal); // valeur a afficher sur le site
      infoNomVille.textContent = "In " + villePrincipal;
      infoNombreVille.textContent = max;
      nombreDepartement(villeIndex, reponse);

      long = reponse[villeIndex].longitude;
      lat = reponse[villeIndex].latitude;

      // afficher la carte sur la ville principale
      map = L.map("map").setView([lat, long], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© BeerStreetMap",
      }).addTo(map);
    }
  }
  //              valeur de sortie = villePrincipal  = la ville qui reviens le plus souvent dans la reponse de l'API
  //                                 max             = le nombre de fois qu'elle reviens

  //-------------------------------------------------------------------------------------------------------------------------------

  // recuperer les information des brasserie---------------------------------------------------------------------------------------

  function recupererNom(reponse) {

    

    // cree une div contenant chaque carte des info sur telephone
    refInfoPhone = document.getElementById("phone");
    infoPhoneT = document.createElement("div");
    infoPhoneT.id = "infoPhone";
    refInfoPhone.append(infoPhoneT);

    // cree un tableau contenant toutes les info sur ecran
    refInfoDesk = document.getElementById("info");
    infoDesk = document.createElement("table");
    infoDesk.className = "infoDesk";
    infoDesk.innerHTML =
      '<tr><th scope="col">Name</th><th scope="col">Address</th><th scope="col">Phone</th><th scope="col">Website</th></tr>';
    refInfoDesk.append(infoDesk);

    for (const indexNom in reponse) {
      let nom;
      let adresse;
      let telephone;
      let site;
      let latVille = 0;
      let longVille = 0;

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
        site = "No website";
      } else {
        site =
          '<a href="' +
          reponse[indexNom].website_url +
          '">' +
          reponse[indexNom].website_url +
          "</a>";
      }

      // refCard = document.getElementById("infoPhone");
      nouvelleCard = document.createElement("div");

      nouvelleCard.innerHTML = 
        '<table id="dlt"><tr><th>Name</th><td>' +
        nom +
        "</td></tr><tr><th>Address</th><td>" +
        adresse +
        "</td></tr><tr><th>Phone</th><td>" +
        telephone +
        "</td></tr><tr><th>Website</th><td>" +
        site +
        "</td></tr></table>";

      // refCard.append(nouvelleCard);
      infoPhoneT.append(nouvelleCard);


      // Insère une ligne dans la table à l'indice de ligne -1
      nouvelleLigne = infoDesk.insertRow(-1);

      // Insère des cellules d'inforamtion
      nouvelleLigne.innerHTML =
        '<td id="dlt">' +
        nom +
        '</td><td id="dlt">' +
        adresse +
        '</td><td id="dlt">' +
        telephone +
        '</td><td id="dlt">' +
        site +
        "</td>";

      // ajouter les repere sur la carte
      longVille = reponse[indexNom].longitude;
      latVille = reponse[indexNom].latitude;

      if (longVille == null || latVille == null) {
      } else {
        marker = L.marker([latVille, longVille]).addTo(map);
        if(indexNom < 2000){
          marker.bindPopup("<b>"+nom+"</b><br>"+adresse).openPopup();
        }
      }

      //https://developer.mozilla.org/fr/docs/Web/API/HTMLTableElement/insertRow

      console.log(indexNom);
    }
  }
  //               valeur de sortie = nom, adresse, telephone, site web
  //------------------------------------------------------------------------------------------------------------------------------

  // recuperation des information de l'API----------------------------------------------------------------------------------------

  function recevoirReponse(pays) {

    document.querySelector('#waiting').style.display ="block";
    document.querySelector('header').className ='wait';
    document.querySelector('section').className ='wait';


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
              document.querySelector(".search").style.border = "solid red";
              document.querySelector(".searchButton").style.background = "red";
              document.querySelector("#waiting").style.display = "none";
              document.querySelector("header").className = "";
              document.querySelector("section").className = ""; 
            
          } else {
            // si la reponse est viable, on verifie que la reponse contiens plusieurs page
            if (reponseApi.length != 20) {
              for (const indexBrasserie in reponseApi) {
                reponseToutesLesPages.push(reponseApi[indexBrasserie]);
              }
              NombreTotalPays = reponseToutesLesPages.length;
              infoNombrePays.textContent = NombreTotalPays;
              definirVillePrincipale(reponseToutesLesPages);
              console.log("ping");
              recupererNom(reponseToutesLesPages);
              console.log("pong");
              console.log(reponseToutesLesPages.length + " en " + pays);

                  document.querySelector("#waiting").style.display = "none";
                  document.querySelector("header").className = "";
                  document.querySelector("section").className = "";
            } else {
              // si la reponse contiens plusieur page on relance la requette a chaque page pleine ( nombre max de brasserie par page = 20)
              for (const indexBrasserie in reponseApi) {
                reponseToutesLesPages.push(reponseApi[indexBrasserie]);
              }
              // console.log(nombrePage)
              nombrePage++;
              recevoirReponse(pays);
              console.log(nombrePage+"  page")
            }
          }
        } else {
          alert("Un problème est intervenu, merci de revenir plus tard.");
        }
      }
    };
  }
}
//                valeur de sortie = nombre de brasserie dans le pays
//-------------------------------------------------------------------------------------------------------------------------------
