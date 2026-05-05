// ============================================
// ARCHIVO: app.js
// TAREA: Completar según REQUISITOS.md
// ============================================

// TODO: Importar express

// TODO: Importar cors

// TODO: Crear aplicación express

// TODO: Agregar middleware de JSON

// TODO: Agregar middleware de CORS

// TODO: Crear ruta GET "/" 
// Retorna: {message: "Servidor OK"}

// TODO: Exportar app

// RESULTADO ESPERADO:
// $ curl http://localhost:3000
// {"message":"Servidor OK"}

'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var article_routes = require('./routes/articleroutes');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use('/api', article_routes);

app.get('/probando', function(req, res){
    console.log("Servidor OK")
})

app.use('/api', article_routes);

module.exports = app;