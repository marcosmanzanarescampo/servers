const ROUTE = '/data'
const JSONSERVERPORT = 4000;

//Tu n'es pas autorisé a acceder a cette url
const url = `http://localhost:${JSONSERVERPORT}${ROUTE}`;
// Formulaire.js

const formulaire = document.querySelector('#formulaire');
const submit = document.querySelector('#submit');

formulaire.addEventListener('submit', function(event){

    // empêche le rechargemante de la page
    event.preventDefault();

    // Récuperer les données du formulaire
    const formData = {
        id:0, 
        name: document.querySelector('#name').value,
        description: document.querySelector('#description').value 
    }

    // ok
    console.log(JSON.stringify(formData));
    console.log(url);


    // Réalisation de la requête POST
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then((result) => {
        console.log('Résponse', result);
    })
    .catch((error) =>{
        console.error('Erreur', error);
    });
});  