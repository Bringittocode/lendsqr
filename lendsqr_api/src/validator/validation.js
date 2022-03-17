import Validator from "validatorjs";

export async function loginValidation(email, password)
{
    const { login } = await import('./schema.js');

    const Login = login();

    return new Promise((resolve, reject) => {
        if (email != undefined && password != undefined) {
            let login = new Validator({
                    email: email,
                    password: password
                },
                Login.rules,
                Login.message);

            if (login.fails()) {
                let error;
                if (login.errors.has('email')) {
                    error = login.errors.first("email");
                } else if (login.errors.has('password')) {
                    error = login.errors.first("password");
                }

                reject({
                    status: "failed",
                    message: error,
                    data: {},
                });

            } else {
                resolve({
                    email: email,
                    password: password
                });
            }
        } else {
            reject({
                status: "failed",
                message: "form data missing",
                data: {},
            });
        }

    });
    
}

export async function registerValidation(email, password)
{
    const { register } = await import('./schema.js');

    const Register = register();

    return new Promise((resolve, reject) => {

        if (email != undefined && password != undefined) {
            let register = new Validator({
                    email: email,
                    password: password
                },
                Register.rules,
                Register.message);

            if (register.fails()) {
                let error;
                if (register.errors.has('email')) {
                    error = register.errors.first("email");
                } else if (register.errors.has('password')) {
                    error = register.errors.first("password");
                }

                reject({
                    status: "failed",
                    message: error,
                    data: {},
                });

            } else {
                resolve({
                    email: email,
                    password: password
                });
            }
        } else {
            reject({
                status: "failed",
                message: "form data missing",
                data: {},
            });
        }

    });
}

export async function updateprofileValidation(email, firstname, lastname) {
    const {updateprofile} = await import('./schema.js');

    const Profile = updateprofile();

    return new Promise((resolve, reject) => {
        if (email != undefined && firstname != undefined && lastname != undefined) {
            let USER = new Validator({
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                },
                Profile.rules
            );

            if (USER.fails()) {
                reject({
                    status: "failed",
                    message: "Invalid request, please check your input",
                });
            }
            else{
                resolve({
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                })
            }
        } else {
            reject({
                status: "failed",
                message: "Invalid request, please check your input",
            });
        }

    });

}

export async function cookieValidation(UI)
{
    const { cookie } = await import('./schema.js');

    const Cookie = cookie();

    return new Promise((resolve, reject) => {
        if (UI != undefined) {
            let ui = new Validator(UI,
                Cookie.rules,
            );

            if (ui.fails()) {
                reject({
                    status: "failed",
                    message: "Unauthorized"
                });
            } else {
                resolve({
                    status: "ok",
                    email: UI.email
                });
            }
        } else {
            reject({
                status: "failed",
                message: "Unauthorized"
            });
        }

    });
}

export async function depositeValidation(email, amount)
{
    const { deposite } = await import('./schema.js');

    const Deposite = deposite();

    return new Promise((resolve, reject) => {
        if (email != undefined && amount != undefined) {
            let depot = new Validator({email: email, amount:amount},
                Deposite.rules,
            );

            if (depot.fails()) {
                reject({
                    status: "failed",
                    message: "Invalid request"
                });
            } else {
                resolve({
                    status: "ok",
                    email: email,
                    amount: amount
                });
            }
        } else {
            reject({
                status: "failed",
                message: "Invalid request"
            });
        }

    });
}

export async function withdrawValidation(email, amount)
{
    const { withdraw } = await import('./schema.js');

    const Withdraw = withdraw();

    return new Promise((resolve, reject) => {
        if (email != undefined && amount != undefined) {
            let depot = new Validator({email: email, amount:amount},
                Withdraw.rules,
            );

            if (depot.fails()) {
                reject({
                    status: "failed",
                    message: "Invalid request"
                });
            } else {
                resolve({
                    status: "ok",
                    email: email,
                    amount: amount
                });
            }
        } else {
            reject({
                status: "failed",
                message: "Invalid request"
            });
        }

    });
}

export async function finduserValidation(acc)
{
    const { finduser } = await import('./schema.js');

    const User = finduser();

    return new Promise((resolve, reject) => {
        if (acc != undefined) {
            let ui = new Validator({account: acc},
                User.rules,
            );

            if (ui.fails()) {
                reject({
                    status: "failed",
                    message: "Invalid"
                });
            } else {
                resolve({
                    status: "ok",
                    account: acc
                });
            }
        } else {
            reject({
                status: "failed",
                message: "Failed"
            });
        }

    });
}

export async function transferValidation(account, amount)
{
    const { transfer } = await import('./schema.js');

    const Transfer = transfer();

    return new Promise((resolve, reject) => {
        if (account != undefined && amount != undefined) {
            let trans = new Validator({account: account, amount:amount},
                Transfer.rules,
            );

            if (trans.fails()) {
                reject({
                    status: "failed",
                    message: "Invalid request"
                });
            } else {
                resolve({
                    status: "ok",
                    account: account,
                    amount: amount
                });
            }
        } else {
            reject({
                status: "failed",
                message: "Invalid request"
            });
        }

    });
}

export default Validator;
