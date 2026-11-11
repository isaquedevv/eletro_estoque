const express = require('express');
const path = require('path');

const authRoute = require('./routes/auth.route.js');
const componenteRoute = require('./routes/componente.route.js');
const relatorioRoute = require('./routes/relatorio.route.js');

const APP = express();
const PORT = 3000;
const SERVER = 'localhost';

APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

// Disponibiliza as páginas HTML da pasta public
APP.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
APP.use('/auth', authRoute);
APP.use('/componentes', componenteRoute);
APP.use('/relatorio', relatorioRoute);

APP.listen(PORT, () => {
    console.log(`Servidor Online em http://${SERVER}:${PORT}`);
});
