import jwt from "jsonwebtoken";

export const generateJWT = (uid = "") => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRET_OR_PRIVATE_KEY, // Asegúrate de tener esto en tu .env
            {
                expiresIn: "4h", // Tiempo de vida del token
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject("No se pudo generar el token");
                } else {
                    resolve(token);
                }
            }
        );
    });
};