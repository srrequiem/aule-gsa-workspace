import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { sendEmail } from "./utils";

admin.initializeApp();
const db = admin.firestore();

exports.paymentCreation = functions.firestore
    .document("payments/{paymentID}")
    .onCreate(async (paymentSnap: any) => {
        const { accountID, amount } = paymentSnap.data();
        const accountSnap: any = await db
            .collection("accounts")
            .doc(accountID)
            .get();
        const { balance } = accountSnap.data();
        return accountSnap.ref.update({ balance: balance + amount });
    });

exports.servicesFeeCreation = functions.firestore
    .document("servicesFees/{servicesFeeID}")
    .onCreate(async (servicesFeeSnapshot: any) => {
        const servicesFee = servicesFeeSnapshot.data();
        const task = {
            servicesFeeID: servicesFeeSnapshot.id,
            performAt: servicesFee.triggerDate,
            status: "scheduled",
            worker: "sendReminders",
        };
        return await db.collection("tasks").add(task);
    });

exports.servicesFeeUpdate = functions.firestore
    .document("servicesFees/{servicesFeeID}")
    .onUpdate(async (servicesFeeSnapshotChanged: any, context) => {
        const previousServicesFee = servicesFeeSnapshotChanged.before.data();
        const newServicesFee = servicesFeeSnapshotChanged.after.data();
        const hasTriggerDateChanged =
            previousServicesFee.triggerDate !== newServicesFee.triggerDate;
        if (hasTriggerDateChanged) {
            const taskQuery = db
                .collection("tasks")
                .where("servicesFeeID", "==", context.params.servicesFeeID)
                .where("status", "==", "scheduled");
            const tasks = await taskQuery.get();
            if (tasks.size === 0) {
                const task = {
                    servicesFeeID: context.params.servicesFeeID,
                    performAt: newServicesFee.triggerDate,
                    status: "scheduled",
                    worker: "sendReminders",
                };
                await db.collection("tasks").add(task);
            }
            tasks.forEach((taskSnap: any) => {
                taskSnap.ref.update({
                    performAt: newServicesFee.triggerDate,
                });
            });
        }
    });

export const taskRunner = functions.pubsub
    .schedule("* * * * *")
    .onRun(async (context: any) => {
        const now = admin.firestore.Timestamp.now();
        const query = db
            .collection("tasks")
            .where("performAt", "<=", now)
            .where("status", "==", "scheduled");
        const tasks = await query.get();
        const jobs: Promise<any>[] = [];
        tasks.forEach((taskSnap: any) => {
            const { worker, servicesFeeID } = taskSnap.data();
            const job = workers[worker](servicesFeeID)
                .then(async () => {
                    const servicesFeeSnap = await db
                        .collection("servicesFees")
                        .doc(servicesFeeID)
                        .get();
                    const servicesFee: any = servicesFeeSnap.data();
                    const newDate = servicesFee.triggerDate.toDate();
                    newDate.setMonth(newDate.getMonth() + 1);
                    await taskSnap.ref.update({ status: "complete" });
                    await servicesFeeSnap.ref.update({ triggerDate: newDate });
                })
                .catch((err) => taskSnap.ref.update({ status: "error" }));
            jobs.push(job);
        });
        return await Promise.all(jobs);
    });

interface Workers {
    [key: string]: (servicesFeeID: string) => Promise<any>;
}

const workers: Workers = {
    sendReminders: async (servicesFeeID) => {
        const senders: Promise<any>[] = [];
        const servicesFeeSnap = await db
            .collection("servicesFees")
            .doc(servicesFeeID)
            .get();
        const servicesFee: any = servicesFeeSnap.data();
        servicesFee.accountsIDS.forEach(async (accountID: string) => {
            const accountSnap = await db
                .collection("accounts")
                .doc(accountID)
                .get();
            const account: any = accountSnap.data();
            const newBalance = account.balance - servicesFee.amount;
            await accountSnap.ref.update({ balance: newBalance });
            account.balance = newBalance;
            const reminder = {
                servicesFee: servicesFee,
                account: account,
            };
            if (account.reminders.includes("Email")) {
                const emailSender = sendEmail(reminder)
                    .then(() => functions.logger.log("Email sended"))
                    .catch((err: any) => functions.logger.log(err));
                senders.push(emailSender);
            }
        });
        return Promise.all(senders);
    },
};