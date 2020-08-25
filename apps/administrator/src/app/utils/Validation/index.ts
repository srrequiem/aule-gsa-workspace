export const isEmailValid = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const isFloatValid = number => {
    const floatNumber = parseFloat(number);
    return !isNaN(floatNumber);
};

export const isIntValid = number => {
    const intNumber = parseInt(number);
    return !isNaN(intNumber);
};

export const isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};
