
export function login()
    {
        const schema ={
            rules: {
                email: ["required", "email",],
                password: ["required", "regex:/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}|:;\"'<>,.?/_₹]).{8,}$/"]
            },
            message: {
                "required.email": "Email can not be empty",
                "email.email": "Invalid email address",
                "required.password": "Your Password can not be empty",
                "regex.password": "Password should be at least 8 character long and must have UPPERCASE, LOWERCASE, NUMBER and a special character"
            }
        }

        return schema;
    }

export function register()
    {
        const schema ={
            rules: {
                email: ["required", "email",],
                password: ["required", "regex:/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}|:;\"'<>,.?/_₹]).{8,}$/"]
            },
            message: {
                "required.email": "Email can not be empty",
                "email.email": "Invalid email address",
                "required.password": "Your Password can not be empty",
                "regex.password": "Password should be at least 8 character long and must have UPPERCASE, LOWERCASE, NUMBER and a special character"
            }
        }

        return schema;
    }

export function updateprofile()
    {
        const schema ={
            rules: {
                email: ["required", "email"],
                firstname: ["required", "regex:/^[A-Za-z]{3,}$/"],
                lastname: ["required", "regex:/^[A-Za-z]{3,}$/"],
            }
        }

        return schema;
    }

export function cookie()
    {
        const schema ={
            rules: {
                email: ["required", "email", "min:3"],
            }
        }

        return schema;
}

export function deposite()
{
    const schema ={
        rules: {
            email: ["required", "email", "min:3"],
            amount: ["required", "min:3"],
        }
    }

    return schema;
}

export function withdraw()
{
    const schema ={
        rules: {
            email: ["required", "email", "min:3"],
            amount: ["required", "min:4"],
        }
    }

    return schema;
}

export function finduser()
{
    const schema ={
        rules: {
            account: ["required", "min:10"],
        }
    }

    return schema;
}

export function transfer()
{
    const schema ={
        rules: {
            account: ["required", "min:10"],
            amount: ["required", "min:4"],
        }
    }

    return schema;
}

