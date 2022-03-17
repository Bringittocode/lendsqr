import {depositeValidation} from "../validator/validation.js";

/**
 * @param { import("fastify").FastifyInstance } fastify
 * @returns { Promise<void> }
 */
async function deposite(fastify, options, done) {
    // error variable will be available anywhere from the request
    // only within this routh
    fastify.decorateRequest('error', null);

    // we need to verify if the request is coming from our frontend
    // before handling the request
    fastify.addHook('preHandler', async(req, res) => {
        
        return new Promise(async(resolve, reject) => {

            const all_req = req.cookies._AUTH_ || ''; // get _AUTH_ cookie
            const cookie = req.unsignCookie(all_req); //unsign it
            const _AUTH_ = cookie.value; //get the value
            
            try {
                // decrypt the cookie
                var bytes = fastify.CryptoJS.AES.decrypt(
                    _AUTH_,
                    process.env.Public_encrypt_secret
                );
                const token = bytes.toString(fastify.CryptoJS.enc.Utf8); //convert to valid string
                
                // If the cookie is the same has what was stored
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
            // set the error to be sent to the user
            req.error = {
                status: 'failed',
                message: "Unauthorize access"
            };
            // throwing an error will stop the request then app.js setErrorHandler will take over

            throw new Error(err);
        })
    });
    
    // get post request
    // domain.com/user/deposite
    fastify.post('/deposite', async (req, res) => {

        // If you remember in our app.js we have an handler to check if user is login in
        // If the user has a valid cookie then req.AUTH will be true
        if(req.AUTH)
        {
            const depot = async function ({email, amount}) { 

                return new Promise(async(resolve, reject) => {
                    // using knex to run a query
                    // SELECT Account_number... from user where Email = email
                    fastify.KNEX('users').select("Account_number", "Income", "Balance", "Verify", "Deactivate")
                    .where({ Email: email })
                    .then((row)=> {
                        // check if the result is greater than 0
                        if(row.length > 0)
                        {
                            /**
                             * verify all conditions
                             * user must not deactivated
                             * user must be verified
                             */
                            if(row[0].Deactivate === 0 || row[0].Verify === 1)
                            {
                                var total = parseInt(row[0].Income) + amount // update income
                                var total_bal = parseInt(row[0].Balance) + amount // update balance

                                // update users Income = total... where Email = email
                                fastify.KNEX('users')
                                .update({ Income: total, Balance: total_bal})
                                .where({ Email: email })
                                .then(rows => {

                                    // Insert into transaction (Email,...) values (email,...)
                                    fastify.KNEX('transaction').insert({
                                        Email: email,
                                        Account: row[0].Account_number,
                                        Mode: "Deposite",
                                        Amount: amount
                                    })
                                    .then(result=>{
                                        // success
                                        resolve({
                                            status: "ok",
                                            message: "Deposite was successfull"
                                        })
                                    })
                                    .catch(err=>{
                                        // Transaction history is unable to insert
                                        // TODO: revert the Income and balance update
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
                                    message: "Unauthorized please complete your profile",
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
            
            const amount = parseInt(req.body.amount); // get amount from the request
            const {email} = req._UI_ // get the email from the cookie (_UI_). these was already handle in app.js
            depositeValidation(email, amount)
            .then(depot)
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

export default deposite;