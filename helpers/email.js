import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;

  //enviar  el email
  await transport.sendMail({
    from: "winvale.com.co.co",
    to: email,
    subject: "Confirma tu cuenta en Winvale",
    text: "Confirma tu cuenta en Winvale",
    html: `
            <p>hola ${nombre}, comprueba tu cuenta :)</p>

            <p>Tu cuenta ya esta lista , solo debes confirmar en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirmar/${token}">Confirma cuenta</a></p>
            
            <p>Si no creaste esta cuenta, pudes ignorar el mensaje</p>
            `,
  });
};

export { emailRegistro };
