import nodemailer from 'nodemailer';

export const createEmailTransport = async () => {
    let testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};
export const sendResetPasswordEmail = async (email, token) => {
    
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    const resetUrl = `http://localhost:8080/reset-password?token=${token}`;

    
    const mailOptions = {
        from: '"Soporte Backend" <noreply@tienda.com>',
        to: email,
        subject: "Recuperación de Contraseña",
        html: `
            <h1>Recuperación de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
            <a href="${resetUrl}">Restablecer mi contraseña</a>
            <p>Este enlace expira en 1 hora.</p>
        `
    };

    const info = await transporter.sendMail(mailOptions);
    
   
    console.log("Email enviado: %s", nodemailer.getTestMessageUrl(info));
    return info;
};