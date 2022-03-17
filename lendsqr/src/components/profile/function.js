export const verifyEmail_main = (email) => {
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

export const verifyName_main = (name)=> {
    if(name.length === 0){
        return null
    }else{
        let regex =  /^[A-Za-z]{3,}$/;
        if (!regex.test(name)) {
            return false
        } else {
                return true
        }
    }
}