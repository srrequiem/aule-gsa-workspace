export interface Account {
    id?: string,
    name: string;
    email: string;
    phone: string;
    balance: number;
    reminders: Array<string>;
    servicesFeesIDS: Array<string>;
}

export interface ServicesFee {
    id?: string,
    name: string,
    amount: number,
    triggerDate: any, // verificar Firebase Timestamp
    accountsIDS: Array<string>;
}

export interface Reminder {
    servicesFee: ServicesFee,
    account: Account
}

export interface Payment {
    amount: number,
    date: Date
}