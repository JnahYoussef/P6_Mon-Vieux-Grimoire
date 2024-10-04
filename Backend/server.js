const http = require('http');
const app = require('./app');

//normaliser le port en un nombre ou une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//définir le port sur lequel l'application va tourner
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

//rechercher et gérer les différentes erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//créer un serveur avec l'application express, qui prend comme arguument la fonction app qui sera appelée à chaque requête reçue par le serveur
const server = http.createServer(app);

//écouter le serveur sur le port défini
server.on('error', errorHandler);

//définir un écouteur d'évènements pour le port sur lequel le serveur s'exécute
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//écouter le serveur sur le port défini
server.listen(port);
