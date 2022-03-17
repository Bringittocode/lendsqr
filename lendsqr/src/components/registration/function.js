export const verifyEmail_main_reg = (email) => {
    if(email.length === 0){
        return null;
    }else{
        let regex = /^([_\-.0-9a-zA-Z]+)@([_\-.0-9a-zA-Z]+).([a-zA-Z]){2,7}$/
        if (!regex.test(email)) {
            return false
        } else {
            return true;
        }
    }
}

export const verifyPassword_main_reg = (password, confirmPassword)=> {
    if(password.length === 0){
        return {
            password: null,
            confirmPassword: null
        }
    }else{
        let regex =  /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}|:;"'<>,.?/_₹]).{8,}$/;
        if (!regex.test(password)) {
            return {
                password: false,
                confirmPassword: null
            };
        } else {
            if(confirmPassword === password)
            {
                return {
                    password: true,
                    confirmPassword: true
                }; 
            }
            else if (confirmPassword.length === 0){
                return {
                    password: true,
                    confirmPassword: null
                }
            }
            else{
                return {
                    password: true,
                    confirmPassword: false
                }
            }
        }
    }
}

export const verifyConfirmPassword_main_reg = (confirmPassword, password)=> {
    if(confirmPassword.length === 0){
        return null
    }else{
        let regex =  /[A-Za-z0-9@#$.%^&+=]{8,}$/;
        if (!regex.test(confirmPassword)) {
            return false
        } else {
            if(confirmPassword === password)
            {
               return true; 
            }
            else{
                return false
            }
            
        }
    }
}

export const verifyEmail_main_log = (email) => {
    if(email.length === 0){
        return null;
    }else{
        let regex = /^([_\-.0-9a-zA-Z]+)@([_\-.0-9a-zA-Z]+).([a-zA-Z]){2,7}$/
        if (!regex.test(email)) {
            return false
        } else {
            return true;
        }
    }
}

export const verifyPassword_main_log = (password)=> {
    if(password.length === 0){
        return null
    }else{
        let regex =  /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}|:;"'<>,.?/_₹]).{8,}$/;
        if (!regex.test(password)) {
            return false
        } else {
                return true
        }
    }
}