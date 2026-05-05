// ============================================
// ARCHIVO: models/article.js
// TAREA: Convertir este pseudocódigo a Mongoose
// ============================================

// PSEUDOCÓDIGO A IMPLEMENTAR:
// ============================
// 
// Crear esquema de Mongoose para Artículos
// 
// CAMPOS:
// - titulo: tipo string
//   * Requerido: SÍ
//   * No puede estar vacío
//   * Máximo 100 caracteres
//
// - descripcion: tipo string
//   * Requerido: NO
//   * Máximo 500 caracteres
//
// - precio: tipo number
//   * Requerido: SÍ
//   * Debe ser mayor a 0
//   * No puede ser negativo
//
// - categoria: tipo string
//   * Requerido: SÍ
//   * Solo valores permitidos: 'tecnología', 'ropa', 'otros'
//
// - imagen: tipo string
//   * Requerido: NO
//   * URL del archivo subido
//
// - Fechas automáticas: createdAt, updatedAt
//
// EXPORTAR: El modelo Article

// ============================================
// COMIENZA A ESCRIBIR EL CÓDIGO AQUÍ:
// ============================================

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleSchema = Schema({
    titulo: {
        type:String , 
        required: true,
        trim: true,
        maxlength:100
    },
    descripcion: {
        type:String,
        maxlength:500
    },
    precio: {
        type: Number, required: true, min: 0.01
    },
    categoria: {
        type: String, 
        required:true,
        enum:['tecnologia', 'ropa', 'otros']
    },
    imagen: {
        type:String,
        default: null
    }
    
}, {timestamps: true});

module.exports = mongoose.model('Article', ArticleSchema, "articulos");

// TODO: Crear schema

// TODO: Crear modelo


// TODO: Exportar modelo

// ============================================
// VERIFICACIÓN: Al completar, ejecuta:
// ============================================
// $ node
// > const Article = require('./models/article.js')
// > console.log(Article.schema.paths)
// 
// Deberías ver: { titulo, descripcion, precio, categoria, imagen, createdAt, updatedAt }
