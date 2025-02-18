const ROUTE = '/data'
const JSONSERVERPORT = 4000;

//Tu n'es pas autorisé a acceder a cette url
const url = `http://localhost:${JSONSERVERPORT}${ROUTE}`;

try{

  fetch(url)
  .then(response => response.json())  // Convertit la réponse en JSON
  .then(data => {

    console.log('data bien reçus!', data);
    
    const container = document.querySelector('#container'); 
    
    container.innerHTML = '';
    
    data.forEach(elem =>{
        const card = document.createElement('div');
        card.className = 'card';
        const name = document.createElement('p');        
        const description = document.createElement('p');

        name.className = 'name';
        description.className = 'description';

        name.textContent = elem.name;
        description.textContent = elem.description;

        card.append(name, description);
        container.appendChild(card);
      });

  });
  
}catch(error){
    console.error('Erreur de récupération du fichier JSON:', error);
  };
