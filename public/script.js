const ROUTE = '/data'
const JSONSERVERPORT = 4000;


// gestion elements DOM
let cards = [];

let clickedCard = null;


// handler pour l'évenement click des cartes
const clickHandler = function(){

  const operationMenu = document.querySelector('#operationMenu');

  operationMenu.style.display = 'block';
  clickedCard = event.target.parentElement.id;
}

// handler pour le boutton "MODIFIER"
const editHandler = () =>{

  document.querySelector('#id').value = cards[clickedCard].id;

  document.querySelector('#containerFormulaireModification').style.display = 'block';
  document.querySelector('#containerFormulaireSuppresion').style.display = 'none';

  // remplir le formulaire avec nos données

  document.querySelector('#name').value = cards[clickedCard].name;
  document.querySelector('#description').value = cards[clickedCard].description;

}


// handler pour le boutton "EFFACER"
const deleteHandler = ()=>{
  document.querySelector('#id').value = cards[clickedCard].id;

  document.querySelector('#containerFormulaireModification').style.display = 'none';
  document.querySelector('#containerFormulaireSuppresion').style.display = 'block';

  // remplir le formulaire avec nos données

  document.querySelector('#nameEffacer').value = cards[clickedCard].name;  
  document.querySelector('#descriptionEffacer').value = cards[clickedCard].description;

  document.querySelector('#nameEffacer').disabled = true;
  document.querySelector('#descriptionEffacer').disabled = true;
}



const optionEdit = document.querySelector('#edit');
optionEdit.addEventListener('click', editHandler);

const optionDelete = document.querySelector('#delete');
optionDelete.addEventListener('click', deleteHandler);


const url = `http://localhost:${JSONSERVERPORT}${ROUTE}`;

try{


  // Récuperation des données qu'on va présenter sous forme de cartes à l'écran
  fetch(url)
  .then(response => response.json())  // Convertit la réponse en JSON
  .then(data => {

    const container = document.querySelector('#container'); 
    
    container.innerHTML = '';
    
    data.forEach((elem, index) =>{
        const card = document.createElement('div');
        card.className = 'card';
        card.id = index;

        card.addEventListener('click', clickHandler);

        const name = document.createElement('p');        
        const description = document.createElement('p');

        name.className = 'name';        
        description.className = 'description';

        name.textContent = elem.name;
        description.textContent = elem.description;

        cards.push(elem);

        card.append(name, description);
        container.appendChild(card);
      });

  });
  
}catch(error){
    console.error('Erreur de récupération du fichier JSON:', error);
  };


  // Configuration du formulaires des operation 'MODICATION  d'une carte
const formulaireModif = document.querySelector('#formulaireModification');
  
formulaireModif.addEventListener('submit', function(event){
    
    //     // empêche le rechargemante de la page
         event.preventDefault();
        
    // //     // Récuperer les données du formulaire

      const formData = new FormData(formulaireModif);

     
        
      console.log("Envoi de la requête PUT au serveur API avec la donnée:");

      const bodyduPUT = {
        id: parseInt(formData.get('idEffacer')) - 1,
        name:  formData.get('name'),
        description: formData.get('description')
      }
      
     
        //Réalisation de la requête POST
        fetch(url, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: bodyduPUT.id,
              name: bodyduPUT.name,
              description: bodyduPUT.description
            })
        })
        .then(response => {
          if (!response.ok){
            throw new Error(`Erreur HTTP: Statut: ${response.status}`);
          }
          window.location.reload();
          return response.json();

        })
        .then(data => {
            console.log('Résponse du serveur: ', data);
        })
        .catch((error) =>{
            console.error('Erreur', error);
        });
    });





     // Configuration du formulaires des operation 'ELIMINATION' d'une carte
const formulaireSup = document.querySelector('#formulaireSuppresion');
  
formulaireSup.addEventListener('submit', function(event){
    
    //     // empêche le rechargemante de la page
         event.preventDefault();
        
    // //     // Récuperer les données du formulaire

      const formData = new FormData(formulaireSup);

     
        
      console.log("Envoi de la requête DELETE au serveur API avec la donnée:");
      console.log(parseInt(formData.get('id')));
      

      const bodyduDELETE = {
        id: parseInt(formData.get('id')) - 1,
        name:  formData.get('name'),
        description: formData.get('description')
      }

      console.log("ready to delete element: " + bodyduDELETE[id]);
      console.log("*****************************************");
      
     
        //Réalisation de la requête POST
        fetch(url, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: bodyduDELETE.id,
              name: bodyduDELETE.name,
              description: bodyduDELETE.description
            })
        })
        .then(response => {
          if (!response.ok){
            throw new Error(`Erreur HTTP: Statut: ${response.status}`);
          }
          window.location.reload();
          return response.json();

        })
        .then(data => {
            console.log('Résponse du serveur: ', data);
        })
        .catch((error) =>{
            console.error('Erreur', error);
        });
    });  