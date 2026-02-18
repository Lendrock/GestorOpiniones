import { Schema, model } from 'mongoose';

const CommentSchema = Schema({
    autor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    texto: { type: String, required: true }
}, { timestamps: true });

const PostSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['Tecnología', 'Deportes', 'Noticias', 'Random'],
        default: 'Random',
        trim: true
    },
    texto: {
        type: String,
        required: [true, 'El contenido no puede estar vacío']
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    comentarios: [CommentSchema]
}, { timestamps: true });

export default model('Post', PostSchema);