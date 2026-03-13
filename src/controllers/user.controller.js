import { generateResetToken } from "../utils/crypto.js";
import { userService } from "../services/index.js";
import { sendResetPasswordEmail } from "../services/email.service.js";
import bcrypt from 'bcrypt';

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userService.findByEmail(email);
        
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const token = generateResetToken();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        
        await sendResetPasswordEmail(user.email, token);

        res.status(200).json({ status: "success", message: "Email de recuperación enviado" });
    } catch (error) {
        next(error);
    }
};
export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        
        const user = await userService.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            const error = new Error("Token inválido o expirado");
            error.status = 400;
            throw error; 
        }

        
        const isSame = await bcrypt.compare(password, user.password);
        if (isSame) {
            const error = new Error("La nueva contraseña no puede ser igual a la anterior");
            error.status = 400;
            throw error;
        }

        
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ status: "success", message: "Contraseña actualizada correctamente" });
    } catch (error) {
        next(error);
    }
};