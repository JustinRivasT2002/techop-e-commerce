require('dotenv').config(); // Carga las variables de entorno desde .env
const nodemailer = require('nodemailer');
const path = require('path');

// Configurar el transporte SMTP con Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

// Función para enviar un correo de bienvenida
const sendWelcomeEmail = async (email) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: '🎉 ¡Bienvenido a Techop! Tu nueva experiencia tecnológica 🚀',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
                <h1 style="color: #007bff;">🎉 ¡Bienvenido a Techop! 🚀</h1>
                <p style="font-size: 18px;">Nos alegra que formes parte de nuestra comunidad tecnológica.</p>
                <p>Con Techop, tienes acceso a los mejores productos de tecnología, con ofertas y beneficios exclusivos.</p>
                <img src="cid:techop_logo" alt="Techop Logo" style="width: 200px; margin: 20px 0;">
                <p>Explora nuestra tienda y disfruta de una experiencia única.</p>
                <a href="http://localhost:4200" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Ir a Techop</a>
                <p style="margin-top: 20px;">¡Gracias por confiar en nosotros! 💙</p>
            </div>
        `,
        attachments: [
            {
                filename: 'Techop-about-us.png',
                path: path.join(__dirname, '..', 'assets', 'Techop-about-us.png'),
                cid: 'techop_logo',
            },
        ],
    };

    try {
        // Intentar enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente:', info.response); // Confirmación en consola
    } catch (error) {
        // Manejo de errores
        console.error('Error al enviar el correo:', error);
        throw error; // Lanza el error al backend para manejarlo
    }
};

module.exports = { sendWelcomeEmail };
