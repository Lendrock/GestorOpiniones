import User from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registro de Usuario
export const register = async (req, res) => {
    try {
        const { password, ...data } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = new User({ ...data, password: hashedPassword });
        await user.save();

        res.status(201).json({ success: true, message: "Usuario creado exitosamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al registrar", error: error.message });
    }
};

// Login Dual (Correo o Username)
export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ success: false, message: "Credenciales inválidas" });
        }

        // Generación de Token (Seguridad obligatoria del bimestre)
        // const token = generateJWT(user.id); 

        res.status(200).json({ success: true, message: `Bienvenido ${user.nombre}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error en el login" });
    }
};

// Actualizar Perfil (Requiere contraseña anterior)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, ...data } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        if (newPassword) {
            const validPassword = bcrypt.compareSync(oldPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "La contraseña anterior no coincide" });
            }
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(newPassword, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ activo: true });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, confirmacion } = req.body;

        // 1. Buscar al usuario
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        // 2. Verificar que el usuario no esté ya desactivado
        if (!user.activo) {
            return res.status(400).json({ message: "Esta cuenta ya ha sido desactivada anteriormente." });
        }

        // 3. Validar contraseña antes de permitir la "eliminación"
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Contraseña incorrecta. No se puede proceder con la desactivación."
            });
        }

        // 4. Verificar mensaje de confirmación
        // Esto obliga al usuario a estar seguro de lo que hace
        if (confirmacion !== "SI, ESTOY SEGURO") {
            return res.status(400).json({
                message: "¿Estás seguro de eliminar tu cuenta? Para confirmar, escribe exactamente: 'SI, ESTOY SEGURO' en el campo confirmacion"
            });
        }

        // 5. Desactivar (No eliminar de la base de datos para no romper integridad)
        await User.findByIdAndUpdate(id, { activo: false });

        res.status(200).json({
            success: true,
            message: "Cuenta desactivada exitosamente. Tus opiniones permanecerán en el sistema."
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};