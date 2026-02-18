`use strict`;
// Importaciones
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { corsOptions } from "./cors-configuration.js";
import helmet from "helmet";
import { helmetConfiguration } from "./helmet-configuration.js";
import { requestLimit } from "../middlewares/request-limit.js";

// Rutas
import { dbConnection } from './db.js';
import userRoutes from '../src/users/user.routes.js';
import postRoutes from '../src/post/post.routes.js';
import commentRoutes from '../src/comments/comment.routes.js';

const BASE_URL = '/gestor-opiniones/v1';

const middlewares = (app) => {
    app.use(helmet(helmetConfiguration));
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(requestLimit);
    app.use(morgan("dev"));
}

//Integracion de todas las rutas
const routes = (app) => {
    app.use(`${BASE_URL}/users`, userRoutes);
    app.use(`${BASE_URL}/posts`, postRoutes);
    app.use(`${BASE_URL}/comments`, commentRoutes);
}

// funcion para iniciar el servidor
const initServer = async (app) => {
    // Crear la instancia de la aplicacion
    app = express();
    const PORT = process.env.PORT || 3001;

    try {
        //Configuracion de los middlewares (Mi aplicaion)
        dbConnection();
        middlewares(app);
        routes(app);


        app.listen(PORT, () => {
            console.log(`Servidor iniciado en el puerto ${PORT}`);
            console.log(`URL BASE: http://localhost:${PORT}${BASE_URL}`);
        });

        // Primera ruta
        app.get(`${BASE_URL}/prueba`, (req, res) => {
            res.status(200).json(
                {
                    status: 'ok',
                    service: 'Gestor de Opiniones',
                    version: '1.0.0'
                }
            );
        });

    } catch (error) {

        console.log(error);

    }
}

export { initServer };