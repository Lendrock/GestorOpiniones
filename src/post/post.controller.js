import Post from "./post.model.js";

/**
 * GET - Listar publicaciones con paginación
 */
export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const query = { activo: true };

        const [posts, total] = await Promise.all([
            Post.find(query)
                .populate('autor', 'nombre username')
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }),
            Post.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones",
            error: error.message
        });
    }
};

/**
 * POST - Crear una publicación (estilo Reddit)
 */
export const createPost = async (req, res) => {
    try {
        const data = req.body;
        const post = new Post({
            ...data,
            autor: req.user._id
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: "Opinión publicada exitosamente",
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear la publicación",
            error: error.message
        });
    }
};

/**
 * PUT - Actualizar publicación (Solo el autor)
 */
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { autor, comentarios, ...data } = req.body;
        const userId = req.user._id;

        const postCheck = await Post.findById(id);

        if (!postCheck) return res.status(404).json({
            success: false,
            message: "Publicación no encontrada"
        });

        // Verificación de dueño
        if (postCheck.autor.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para editar esta publicación"
            });
        }

        const post = await Post.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: "Publicación actualizada",
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la publicación",
            error: error.message
        });
    }
};

/**
 * DELETE - Desactivar publicación (Solo el autor)
 */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const postCheck = await Post.findById(id);

        if (!postCheck) return res.status(404).json({
            success: false,
            message: "Publicación no encontrada"
        });

        // Verificación de dueño
        if (postCheck.autor.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "No puedes eliminar una opinión que no te pertenece"
            });
        }

        // Eliminación lógica
        const post = await Post.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Publicación eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la publicación",
            error: error.message
        });
    }
};