const http = require('http'); // Le module http de Node.js
const url = require('url'); // Le module url pour analyser les requêtes


const fs = require('fs');
const path = require('path');
const { log } = require('console');
const hostname = "127.0.0.1";
const filePath = path.join(__dirname, "../data.json");
const PORT_JSON = 4000;
const ROUTE = '/data';


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
            }
        })
    }
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
                    let articles = [];
        
                    // Lire le fichier JSON existant
                    fs.readFile(filePath, "utf8", (err, data) => {
        
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
                            res.end(JSON.stringify({ message: 'Données enregistrées avec succès' }));
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
        else if (req.method === 'PUT' && req.url === ROUTE){
            //Récuperation de l'élement à mettre à jour
            // const userID = parseInt(req.url.split("/")[2], 10);

            let body = "";

            req.on("data", chunk => {
                body += chunk.toString();
            });

            req.on("end", () => {
                try{

                    // liste d'elements récuperés du fichier
                    let articles = null;
        
                    // Lire le fichier JSON existant
                    console.log("Reading file...");
                    
                    fs.readFile(filePath, "utf8", (err, data) => {

                        console.log("data lu: " + data + ", type: " + typeof(data));
                        // console.log("data lu: " + JSON.parse(data) + ", type: " + typeof(JSON.parse(data)));
                        
                                                
                        if (!err && data) {
                            try {
                                articles = JSON.parse(data); // Parser le fichier existant
                                console.log("Avant:");
                                console.log(articles);

                                if (!Array.isArray(articles)) {
                                    articles = []; // S'assurer que c'est un tableau
                                }

                                //suite...
                                
                                // Mise à jour de l'élement
            
                                
                                const {id, name, description} = JSON.parse(body);
            
                                if (articles.length > 0){
                          
                                    articles[id] = {
                                        id: id + 1,
                                        name: name,
                                        description: description
                                    };
            
                                }
                                console.log("Aprés:");
                                console.log(articles);
                                

                                // Réécrire le fichier JSON avec les nouvelles données
                                fs.writeFile(filePath, JSON.stringify(articles, null, 2), (writeErr) => {
                                    if (writeErr) {
                                        res.writeHead(500, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ error: "Erreur lors de l'enregistrement des données" }));
                                        return;
                                    }
                                });

                                // **************************

                            } catch (parseError) {
                                console.error("Erreur de parsing JSON:", parseError);
                                articles = [];
                            }
                        };
       
                    });
           
        

                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({ message: "Données correctement mises à jour"}));

                    // Mise à jour de l'élement

                }catch(error){
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Données invalides"}));
                }
            });
        }
        else if (req.method === 'DELETE' && req.url === ROUTE){
            //Récuperation de l'élement à mettre à jour
            // const userID = parseInt(req.url.split("/")[2], 10);

            console.log("Dans le corps du DELETE...");
            

            let body = "";

            req.on("data", chunk => {
                body += chunk.toString();
            });

            req.on("end", () => {
                try{

                    // liste d'elements récuperés du fichier
                    let articles = null;
        
                    // Lire le fichier JSON existant
                    console.log("Reading file...");
                    
                    fs.readFile(filePath, "utf8", (err, data) => {

                        console.log("data lu: " + data + ", type: " + typeof(data));
                        // console.log("data lu: " + JSON.parse(data) + ", type: " + typeof(JSON.parse(data)));
                        
                                                
                        if (!err && data) {
                            try {
                                articles = JSON.parse(data); // Parser le fichier existant
                                // console.log("Avant:");
                                // console.log(articles);

                                if (!Array.isArray(articles)) {
                                    articles = []; // S'assurer que c'est un tableau
                                }

                                //suite...
                                
                                // Mise à jour de l'élement
            
                                
                                const {id, name, description} = JSON.parse(body);

                                console.log("Deleting element: " + id);
                                
            
                                if (articles.length > 0){
                          
                                    // articles[id] = {
                                    //     id: id + 1,
                                    //     name: name,
                                    //     description: description
                                    // };
                                    // Suppresion de l'element demandé!
                                    articles.splice(id-1, 1);
            
                                }
                                console.log("Aprés:");
                                console.log(articles);
                                

                                // Réécrire le fichier JSON avec les nouvelles données
                                fs.writeFile(filePath, JSON.stringify(articles, null, 2), (writeErr) => {
                                    if (writeErr) {
                                        res.writeHead(500, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ error: "Erreur lors de l'enregistrement des données" }));
                                        return;
                                    }
                                });

                                // **************************

                            } catch (parseError) {
                                console.error("Erreur de parsing JSON:", parseError);
                                articles = [];
                            }
                        };
       
                    });
           
        

                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({ message: "Données correctement mises à jour"}));

                    // Mise à jour de l'élement

                }catch(error){
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Données invalides"}));
                }
            });
        }
        else{

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Route non trouvée" }));         

        };        
    });


// Lancer le serveur
server.listen(PORT_JSON,hostname, () => {
    console.log(`Serveur API en cours d'exécution sur http://localhost:${PORT_JSON}`);
});
