import { Router } from "express";
import { addComment, updateComment, deleteComment, getComments } from "./comment.controller.js";
import { validateJWT } from "../../middlewares/validate-jwt.js";

const router = Router();
//GET - Lista de comentatios de un post
router.get("/:id", validateJWT, getComments);

// POST - Agregar comentario (Necesita el ID del post en la URL)
router.post("/:id", validateJWT, addComment);

// PUT - Editar comentario (Necesita ID del post e ID del comentario)
router.put("/:postId/:commentId", validateJWT, updateComment);

// DELETE - Eliminar comentario
router.delete("/:postId/:commentId", validateJWT, deleteComment);

export default router;