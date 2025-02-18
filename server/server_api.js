const http = require('http'); // Le module http de Node.js
const url = require('url'); // Le module url pour analyser les requêtes


const fs = require('fs');
const path = require('path');
const hostname = "127.0.0.1";
const filePath = path.join(__dirname, "../data.json");
const PORT_JSON = 4000;
const ROUTE = '/data';

// // Exemple de données

// try {
//   // Lire le contenu du fichier
//   const dataBuffer = fs.readFileSync(path.join(__dirname, 'data.json'));

//   // Convertir le buffer en chaîne de caractères
//   const dataString = dataBuffer.toString();

//   // Parser la chaîne de caractères en objet JavaScript
//   const data = JSON.parse(dataString);

//   console.log(data);
// } catch (err) {
//   console.error('Erreur lors de la lecture du fichier:', err);
// }




console.log("FILE PATH:",filePath);

// Créer le serveur
const server = http.createServer((req, res) => {
    // Configurer les en-têtes pour CORS
      // Gérer les requêtes OPTIONS (pré-vérification CORS)
      if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*", // Autoriser seulement ton frontend
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }

    // Ajouter les en-têtes CORS pour toutes les autres requêtes
    res.setHeader("Access-Control-Allow-Origin", "*"); // Remplace par '*'0+36++++++++++++++++++++ pour autoriser tout le monde
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // Si c'est une requête GET
    if (req.method === "GET" && req.url === ROUTE) {
        console.log(req.url);

        // Lire le fichier JSON
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                
                
                res.statusCode = 500;
                res.end(
                    JSON.stringify({
                        error: "Erreur lors de la lecture du fichier JSON",
                    }),
                );
                return;
            } else {
                res.status=200;           
                res.setHeader("Content-Type", "application/json");
                res.end(data || "[]");
                console.log("Contenu JSON brut :", data);
            }
        })}
        else if (req.method === 'POST' && req.url === ROUTE) {
            let body = '';
        
            // Collecter les données envoyées
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
        
            // Lorsque toutes les données sont reçues
            req.on('end', () => {
                try {
                    const formData = JSON.parse(body); // Convertir en objet JS
        
                    // Lire le fichier JSON existant
                    fs.readFile(filePath, "utf8", (err, data) => {
                        let articles = [];
        
                        if (!err && data) {
                            try {
                                articles = JSON.parse(data); // Parser le fichier existant
                                if (!Array.isArray(articles)) {
                                    articles = []; // S'assurer que c'est un tableau
                                }
                            } catch (parseError) {
                                console.error("Erreur de parsing JSON:", parseError);
                                articles = [];
                            }
                        }

                        // ajouter un ID automatiquement!

                        formData.id = articles.length + 1;

        
                        // Ajouter les nouvelles données
                        articles.push(formData);
        
                        // Réécrire le fichier JSON avec les nouvelles données
                        fs.writeFile(filePath, JSON.stringify(articles, null, 2), (writeErr) => {
                            if (writeErr) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: "Erreur lors de l'enregistrement des données" }));
                                return;
                            }
        
                            // Répondre avec succès
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({
                                message: 'Données enregistrées avec succès',
                                data: formData
                            }));
                        });
                    });
        
                } catch (error) {
                    // En cas d'erreur de parsing JSON
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Format JSON invalide' }));
                }
            });
            return;
        }
        
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }



});

// Lancer le serveur
server.listen(PORT_JSON,hostname, () => {
    console.log(`Serveur API en cours d'exécution sur http://localhost:${PORT_JSON}`);
    console.log(filePath);
});
