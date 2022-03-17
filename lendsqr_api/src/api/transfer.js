import {transferValidation} from "../validator/validation.js";

async function transfer(fastify, options, done) {
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
    
    fastify.post('/transfer', async (req, res) => {

        if(req.AUTH)
        {
            const trans = async function ({account, amount}) { 

                return new Promise(async(resolve, reject) => {
                    fastify.KNEX('users').select("Email", "Income", "Balance", "Verify", "Deactivate")
                    .where({ Account_number: account })
                    .then((receiver)=> {
                        if(receiver.length > 0)
                        {
                            const {email} = req._UI_;

                            if((receiver[0].Deactivate == 0 || receiver[0].Verify == 1) && receiver[0].Email != email)
                            {

                                fastify.KNEX('users').select("Email", "Expense", "Balance", "Account_number", "Verify", "Deactivate")
                                .where({ Email: email })
                                .then((sender)=> {
                                    if(sender.length > 0)
                                    {
                                        if(sender[0].Deactivate == 0 || sender[0].Verify == 1)
                                        {
                                            if(parseInt(sender[0].Balance) >= amount)
                                            {
                                                var sender_ex = parseInt(sender[0].Expense) + amount
                                                var sender_bal = parseInt(sender[0].Balance) - amount

                                                var receiver_in = parseInt(receiver[0].Income) + amount
                                                var receiver_bal = parseInt(receiver[0].Balance) + amount

                                                fastify.KNEX('users')
                                                .update({ Expense: sender_ex, Balance: sender_bal })
                                                .where({ Email: email })
                                                .then(rows => {

                                                    fastify.KNEX('transaction').insert({
                                                        Email: email,
                                                        Account: account,
                                                        Mode: "Transfer",
                                                        Amount: amount
                                                    })
                                                    .then(result=>{
                                                        resolve({
                                                            status: "ok",
                                                            message: "Transfer successful"
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

                                                fastify.KNEX('users')
                                                .update({ Income: receiver_in, Balance: receiver_bal })
                                                .where({ Account_number: account })
                                                .then(rows => {

                                                    fastify.KNEX('transaction').insert({
                                                        Email: receiver[0].Email,
                                                        Account: sender[0].Account_number,
                                                        Mode: "Received",
                                                        Amount: amount
                                                    })
                                                    .catch(err=>{
                                                        console.log(err);
                                                    })
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
                                                message: "Please verify your account before you can transfer",
                                                data: {}
                                            });
                                        }
                                    }
                                    else{
                                       reject({
                                            status: "failed",
                                            message: "Unauthorized please login again",
                                            data: {}
                                        }); 
                                    }
                                    
                                })
                            }
                            else{
                                reject({
                                    status: "failed",
                                    message: "Unkown user",
                                    data: {}
                                });
                            }
                          
                        }
                        else{
                            reject({
                                status: "failed",
                                message: "The user does not exist",
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
            
            const acc = req.body.account_number;
            const amount = parseInt(req.body.amount);
            transferValidation(acc, amount)
            .then(trans)
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
                message: "Unable to find user"
            });
        }
        
    })
}

export default transfer;