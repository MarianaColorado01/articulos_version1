'use strict'

var validator = require('validator'); //validar cualquier tipo de dato
var fs = require('fs');
var path = require('path');
var Article = require('../models/article'); //importar el modelo articulo para usarlo
var multiparty = require('multiparty');

var controller = {
    createArticle: async(req,res)=>{

        var params = req.body;

        try{
            var validate_titulo = !validator.isEmpty(params.titulo);
            var validate_descripcion = !validator.isEmpty(params.descripcion);
            var validate_precio = !validator.isEmpty(params.precio);
            var validate_categoria = !validator.isEmpty(params.categoria);

        }catch(err){
            return res.status(200).send({
                status:'error',
                message: 'Faltan datos por enviar',
                detalle: err.message
                //article: params,
            });
        }

        if(validate_titulo && validate_descripcion &&validate_precio && validate_categoria){
            var article = new Article();

            article.titulo = params.titulo;
            article.descripcion = params.descripcion;
            article.precio = params.precio;
            article.categoria = params.categoria;
            article.image = null;


            try{
                const articleStored = await article.save();
                return res.status(200).send({
                    status:'success',
                    article:articleStored
                });
            }catch(err){
                return res.status(500).send({
                    status:'error',
                    message:'El articulo no se ha guardado !!!',
                    detalle: err.message
                });
            }
        }else{
            return res.status(200).send({
                status:'error',
                message:'Los datos no son validos !!!'
            });
        }

        
        
    },
    getArticles: async (req, res) => {
        try {
            const articles = await Article.find().sort({ createdAt: -1 });

            if (!articles || articles.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontraron artículos'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al obtener los artículos',
                detalle: err.message
            });
        }
    },
    getArticle: async (req, res) => {
        var id = req.params.id;

        try {
            const article = await Article.findById(id);

            if (!article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Artículo no encontrado'
                });
            }

            return res.status(200).send({
                status: 'success',
                article
            });
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al obtener el artículo',
                detalle: err.message
            });
        }
    },
    updateArticle: async (req, res) => {
        var id = req.params.id;
        var params = req.body;

        try {
            // Validar que lleguen datos
            if (!params.titulo && !params.descripcion && !params.precio && !params.categoria) {
                return res.status(400).send({
                    status: 'error',
                    message: 'No hay datos para actualizar'
                });
            }

            const articleUpdated = await Article.findByIdAndUpdate(
                id,
                params,
                { new: true, runValidators: true } // new:true devuelve el doc actualizado
            );

            if (!articleUpdated) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Artículo no encontrado'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleUpdated
            });
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al actualizar el artículo',
                detalle: err.message
            });
        }
    },
    deleteArticle: async (req, res) => {
        var id = req.params.id;

        try {
            const articleDeleted = await Article.findByIdAndDelete(id);

            if (!articleDeleted) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Artículo no encontrado'
                });
            }

            return res.status(200).send({
                status: 'success',
                message: 'Artículo eliminado correctamente',
                article: articleDeleted
            });
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar el artículo',
                detalle: err.message
            });
        }
    },
    uploadImage: async (req, res) => {
        var id = req.params.id;

        var form = new multiparty.Form();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al procesar la imagen'
                });
            }

            // Verificar que llegó archivo
            if (!files || !files.imagen || files.imagen.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'No se ha enviado ninguna imagen'
                });
            }

            var file = files.imagen[0];
            var extension = path.extname(file.originalFilename).toLowerCase();

            // Validar extensión
            var extensionesValidas = ['.jpg', '.jpeg', '.png', '.gif'];
            if (!extensionesValidas.includes(extension)) {
                // Eliminar archivo temporal
                fs.unlinkSync(file.path);
                return res.status(400).send({
                    status: 'error',
                    message: 'Extensión no válida. Solo jpg, jpeg, png, gif'
                });
            }

            // Crear carpeta uploads si no existe
            var uploadsDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir);
            }

            // Nombre único para el archivo
            var nombreArchivo = `${id}_${Date.now()}${extension}`;
            var rutaDestino = path.join(uploadsDir, nombreArchivo);

            // Mover archivo temporal a uploads
            fs.rename(file.path, rutaDestino, async (err) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar la imagen'
                    });
                }

                try {
                    const articleUpdated = await Article.findByIdAndUpdate(
                        id,
                        { imagen: nombreArchivo },
                        { new: true }
                    );

                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'Artículo no encontrado'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated,
                        imagen: nombreArchivo
                    });
                } catch (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar la imagen en BD',
                        detalle: err.message
                    });
                }
            });
        });
    }
}


module.exports = controller;