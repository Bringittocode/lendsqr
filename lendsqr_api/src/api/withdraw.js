import {withdrawValidation} from "../validator/validation.js";

async function withdraw(fastify, options, done) {
    // error variable will be available anywhere from the request
    fastify.decorateRequest('error', null);

    // do somethings before handling the request
    fastify.addHook('preHandler', async(req, res) => {
        
        return new Promise(async(resolve, reject) => {

            const all_req = req.cookies._AUTH_ || '';
            const cookie = req.unsignCookie(all_req); //unsign it
            const _AUTH_ = cookie.value; //get the value
            
            try {
                // decrypt the cookie
                var bytes = fastify.CryptoJS.AES.decrypt(
                    _AUTH_,
                    process.env.Public_encrypt_secret
                );
                const token = bytes.toString(fastify.CryptoJS.enc.Utf8); //convert to valid string
                if(token === "allow_access")
                {
                    resolve(token);
                }
                else{
                    reject('token mismatch');
                }
            } catch (error) {
                reject('invalid cookie')
            }
            
        })
        .then((res)=>{})
        .catch((err)=>{
            req.error = {
                status: 'failed',
                message: "Unauthorize access"
            };
            throw new Error(err);
        })
    });
    
    fastify.post('/withdraw', async (req, res) => {

        if(req.AUTH)
        {
            const withdr = async function ({email, amount}) { 

                return new Promise(async(resolve, reject) => {
                    fastify.KNEX('users').select("Account_number", "Balance", "Expense", "Verify", "Deactivate")
                    .where({ Email: email })
                    .then((row)=> {
                        if(row.length > 0)
                        {
                            if(row[0].Deactivate == 0 || row[0].Verify == 1)
                            {
                                if(parseInt(row[0].Balance) >= amount)
                                {
                                    var total = parseInt(row[0].Expense) + amount
                                    var total_bal = parseInt(row[0].Balance) - amount
                                    fastify.KNEX('users')
                                    .update({ Expense: total, Balance: total_bal })
                                    .where({ Email: email })
                                    .then(rows => {

                                        fastify.KNEX('transaction').insert({
                                            Email: email,
                                            Account: row[0].Account_number,
                                            Mode: "Withdraw",
                                            Amount: amount
                                        })
                                        .then(result=>{
                                            resolve({
                                                status: "ok",
                                                message: "Withdraw is on it's way.."
                                            })
                                        })
                                        .catch(err=>{
                                            console.log(err);
                                        })
                                    })
                                    .catch((err)=>{
                                        console.log(err);
                                        reject({
                                            status: "failed",
                                            message: "Something went wrong!. Not you, was us.",
                                            data: {},
                                        });
                                    })
                                }
                                else{
                                    reject({
                                        status: "failed",
                                        message: "Your account is too low for that amount",
                                        data: {}
                                    }); 
                                }
                                
                            }
                            else{
                                reject({
                                    status: "failed",
                                    message: "Unauthorized please complete your profile",
                                    data: {}
                                });
                            }
                          
                        }
                        else{
                            reject({
                                status: "failed",
                                message: "Unauthorized please login againc",
                                data: {}
                            });
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                        reject({
                            status: "failed",
                            message: "Something went wrong!. Not you, was us.",
                            data: {},
                        });
                    })
                });
            }
            
            const amount = parseInt(req.body.amount);
            const {email} = req._UI_
            withdrawValidation(email, amount)
            .then(withdr)
            .then((data) => {
                res.code(200).send(data)
            })
            .catch((error) => {
                res.code(200).send(error);
            });
        }
        else{
            res.code(200).send({
                status: "failed",
                message: "Unauthorized please login again"
            });
        }
        
    })
}

export default withdraw;