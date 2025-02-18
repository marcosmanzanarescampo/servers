/*********************************************************************************
Exercice 6 : Associer un serveur HTML et un serveur API JSON
💡 Objectif :

Un serveur HTML (port 3000) qui sert les fichiers statiques.
Un serveur API JSON (port 4000) qui lit un fichier database.json et renvoie ses données.
Un script JavaScript qui fetch les données de l'API et les affiche dans le HTML.

💡 Structure :

/mon-projet
│── /public
│   ├── index.html     (Page HTML principale)
│   ├── style.css      (Fichier CSS pour le style)
│   ├── script.js      (Script JS qui récupère les données du JSON via fetch)
│── /server
│   ├── server_html.js  (Serveur qui sert la page HTML)
│   ├── server_api.js   (Serveur API qui lit et envoie le fichier JSON)
│── /data
│   ├── database.json   (Fichier JSON servant de base de données)
│── package.json
│── README.md (Facultatif)


✅ Bonus :

Ajouter une page d'administration pour ajouter des utilisateurs dans le JSON
Gérer un formulaire HTML qui envoie des données à l’API (AJAX avec fetch)
Ajouter une route API pour modifier ou supprimer un utilisateur
Créer un fichier de logs (logs.txt) qui enregistre chaque requête
*/
// *********************************************************************************



// *****************************************************
// global variables:

const PORT_HTML = 3000;
const PATH = '../public/';
const http = require('http'); // Module HTTP  
const fs = require('fs');     // Module pour la gestion des fichiers

// *****************************************************



// functions: ******************************************
  


  // l'extension est une extension image?
  const isImage = function (ext){
    
    return (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp' || ext == 'avif'|| ext == 'ico');
    
  }
  
  
  
  // Récuperation de l'extension du fichier
  const fileExtension = function(file){
    return file.substring(file.lastIndexOf('.') + 1);
  };

  
  const createMIME = function(f){
    
    const fileExt = fileExtension(f);
    let mime = '';
    
    switch(fileExt){
      case 'html':
        
        mime = 'text/html';
        break;
        
        case 'css':
          
            mime = 'text/css';
            break;
            
            case 'js':
              
            mime = 'text/js';
            break;
            
            // Bonus!
            default:

              if (isImage(fileExt)){

                mime = `image/${fileExt}]`;

                
            }else{

              mime = 'text/plain';
              
            }
            break;
            
    }

    return mime;
  }

  // fonction qui fixe le PATH du fichier par rapport à son extension
  const getPATH = function (){

    return PATH;

  }

  // *****************************************************



// Crée un serveur HTTP
const server = http.createServer((req, res) => {
  
let file = req.url;

console.log('file: ' + req.url);


  
  if (file === '/'){

      file = getPATH() + 'index.html';

  }else{

      file = getPATH() + file.substring(file.indexOf('/') + 1);
   
  }
  
  // console.log(`trying to get file: ${file}`);
  
  
  // Lit le fichier HTML
  fs.readFile(file, (err, data) => {
    if (err) {
      
      // Si erreur lors de la lecture du fichier, renvoyer une erreur 500
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erreur de lecture du fichier.');
      return;
      
    }
    


  // Si le fichier est trouvé et lu, renvoie le contenu avec le type MIME HTML



  // appel function createMIME

    const mime = createMIME(file);

    res.writeHead(200, {'Content-Type': `${mime}`});
    res.end(data); // Envoie le contenu du fichier
  });
  

});

// Le serveur écoute sur le port <PORT>
server.listen(PORT_HTML, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT_HTML}`);
});
