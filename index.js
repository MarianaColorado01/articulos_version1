// ============================================
// ARCHIVO: index.js
// TAREA: Completar según REQUISITOS.md
// ============================================

// TODO: Importar app desde app.js

// TODO: Importar mongoose

// TODO: Definir puerto (3000)

// TODO: Conectar a MongoDB con mongoose.connect()
// Usa la URL de CONEXION_MONGODB.txt

// TODO: Iniciar servidor con app.listen()
// - Puerto: 3000
// - Callback: console.log() con mensaje de confirmación

// RESULTADO ESPERADO:
// $ npm start
// Conectado a MongoDB ✅
// Servidor escuchando en puerto 3000


'use strict'
var mongoose = require('mongoose')
var app = require('./app');
var port = 3800;
mongoose.connect('mongodb://localhost:27017/evaluacion-db').then(() => {
    console.log('conexion exitosa');
    app.listen(port, () => {
        console.log('Servidor corriendo en http://localhost:' + port)
    });
    })
    .catch((err) => {
        console.log('Error de conexion', err)
})