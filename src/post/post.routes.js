import { Router } from "express";
import {
    getPosts,
    createPost,
    updatePost,
    deletePost
} from "./post.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

/**
 * RUTAS PÚBLICAS
 * Cualquier usuario (logueado o no) puede ver el feed de opiniones.
 */
// GET - Listar todas las publicaciones con paginación
router.get("/", getPosts);

/**
 * RUTAS PROTEGIDAS (Requieren Token x-token)
 * Solo usuarios autenticados pueden interactuar.
 */

// POST - Crear una nueva publicación (El autor se extrae del Token)
router.post("/", validateJWT, createPost);

// PUT - Editar una publicación propia (El controlador valida si eres el dueño)
router.put("/:id", validateJWT, updatePost);

// DELETE - Eliminación lógica de una publicación propia
router.delete("/:id", validateJWT, deletePost);

export default router;