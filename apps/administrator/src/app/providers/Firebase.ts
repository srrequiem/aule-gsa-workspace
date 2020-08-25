import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { Account, ServicesFee, Payment } from '@aule-gsa-workspace/interfaces';

const config = {
    apiKey: process.env.NX_FIREBASE_API_KEY,
    authDomain: process.env.NX_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NX_FIREBASE_DATABASE_URL,
    projectId: process.env.NX_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NX_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NX_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NX_FIREBASE_APP_ID,
};

export default class Firebase {
    public auth: firebase.auth.Auth;
    private _db: firebase.firestore.Firestore;

    constructor() {
        firebase.initializeApp(config);
        this.auth = firebase.auth();
        this._db = firebase.firestore();
    }

    signInWithEmailAndPassword = (email: string, password: string) => {
        return this.auth.signInWithEmailAndPassword(email, password);
    };

    signOut = () => this.auth.signOut();

    passwordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

    passwordUpdate = (password: string) =>
        this.auth.currentUser.updatePassword(password);

    getAccounts = () => this._db.collection('accounts').get();
    getAccount = (accountID: string) =>
        this._db.collection('accounts').doc(accountID).get();
    saveAccount = (account: Account) =>
        this._db.collection('accounts').add(account);
    setAccount = (accountID: string, account: Account) =>
        this._db.collection('accounts').doc(accountID).set(account);
    deleteAccount = (accountID: string) =>
        this._db.collection('accounts').doc(accountID).delete();

    getServicesFees = () => this._db.collection('servicesFees').get();
    saveServicesFee = (servicesFee: ServicesFee) =>
        this._db.collection('servicesFees').add(servicesFee);
    setServicesFee = (servicesFeeID: string, servicesFee: ServicesFee) =>
        this._db.collection('servicesFees').doc(servicesFeeID).set(servicesFee);
    deleteServicesFee = (servicesFeeID: string) =>
        this._db.collection('servicesFees').doc(servicesFeeID).delete();

    savePayment = (payment: Payment) =>
        this._db.collection('payments').add(payment);
}
