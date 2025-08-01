
     const jsonServer = require('json-server');
     const server = jsonServer.create();
     const router = jsonServer.router('db.json');
     const middlewares = jsonServer.defaults();
     server.use(middlewares);
     server.use('/api', router);
     server.listen(3000, () => {
       console.log('Server running on port 3000');
     });