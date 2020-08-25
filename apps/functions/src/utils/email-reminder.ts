import * as functions from "firebase-functions";
import { Reminder } from "@aule-gsa-workspace/interfaces"

const nodemailer = require("nodemailer");

const { host, user, pass } = functions.config().smtp;
const transporter = nodemailer.createTransport({
    host: host,
    port: 465,
    secure: true,
    auth: {
        user: user,
        pass: pass,
    },
});

export const sendEmail = (reminder: Reminder) => {
    const { servicesFee, account } = reminder;
    const mailOptions = {
        from: functions.config().email.from,
        to: account.email,
        subject: `Recordatorio de pago - ${servicesFee.name}`,
        html: `<h1>${servicesFee.name}</h1>
            <p>Hola, <b>${account.name}</b>.</p>
            <p>Este es un servicio de recordatorios de pago al que estás suscrito, se carga a tu saldo <b>$${servicesFee.amount}</b>.</p>
            <h3>Información de tu cuenta</h3>
            <p>Saldo: <b>$${account.balance}</b></p>
            <p>Recuérdame por: <b>${account.reminders.join(', ')}</b></p>
            ${account.reminders.includes('SMS') ? `<p>Celular: <b>${account.phone}</b></p>` : null}
            <p>Servicio construido con 🖤 por <b><a href="https://rzul.me/">Román Zuleta</a></b>😎.</p>`,
    };
    return transporter.sendMail(mailOptions);
};
