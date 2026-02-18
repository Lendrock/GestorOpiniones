import Post from "../post/post.model.js";

/**
 * GET - Lista de comentatios de un post
 */
export const getComments = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post no encontrado" });
        res.status(200).json({ success: true, comments: post.comentarios });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener comentarios", error: error.message });
    }
};

/**
 * POST - Agregar un comentario a un post
 */
export const addComment = async (req, res) => {
    try {
        const { id } = req.params; // ID del Post
        const { texto } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ success: false, message: "Post no encontrado" });

        // Agregamos el subdocumento al array
        post.comentarios.push({
            texto,
            autor: userId
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: "Comentario agregado exitosamente",
            post
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al comentar", error: error.message });
    }
};

/**
 * PUT - Editar un comentario propio
 */
export const updateComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { texto } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Post no encontrado" });

        // Buscamos el comentario dentro del array del post
        const comentario = post.comentarios.id(commentId);
        if (!comentario) return res.status(404).json({ success: false, message: "Comentario no encontrado" });

        // Verificamos autoría del comentario
        if (comentario.autor.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "No puedes editar un comentario ajeno" });
        }

        comentario.texto = texto;
        await post.save();

        res.status(200).json({ success: true, message: "Comentario actualizado", post });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al actualizar comentario", error: error.message });
    }
};

/**
 * DELETE - Eliminar un comentario propio
 */
export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Post no encontrado" });

        const comentario = post.comentarios.id(commentId);
        if (!comentario) return res.status(404).json({ success: false, message: "Comentario no encontrado" });

        // Verificamos autoría
        if (comentario.autor.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "No puedes eliminar este comentario" });
        }

        // Eliminamos el subdocumento del array
        comentario.deleteOne();
        await post.save();

        res.status(200).json({ success: true, message: "Comentario eliminado" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al eliminar comentario", error: error.message });
    }
};