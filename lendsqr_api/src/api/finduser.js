import {finduserValidation} from "../validator/validation.js";

/**
 * @param { import("fastify").FastifyInstance } fastify
 * @returns { Promise<void> }
 */
async function finduser(fastify, options, done) {
    // error variable will be available anywhere from the request
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
    // domain.com/user/finduser
    fastify.post('/finduser', async (req, res) => {

        // If you remember in our app.js we have an handler to check if user is login in
        // If the user has a valid cookie then req.AUTH will be true
        if(req.AUTH)
        {
            const find = async function ({account}) { 

                return new Promise(async(resolve, reject) => {
                    // using knex to run a query
                    // SELECT First_name... from user where Account_number = account
                    fastify.KNEX('users').select("First_name", "Email", "Last_name", "Verify", "Deactivate")
                    .where({ Account_number: account })
                    .then((row)=> {
                        // check if the result is greater than 0
                        if(row.length > 0)
                        {
                            // get the email from the cookie (_UI_). these was already handle in app.js
                            const {email} = req._UI_;

                            /**
                             * verify all conditions
                             * user must not deactivated
                             * user must be verified
                             * and the email of the person must not equal to the email of the requester
                             * I.e same person can not find them self
                             */
                            if((row[0].Deactivate === 0 || row[0].Verify === 1) && row[0].Email != email)
                            {
                                // Get both first name and last name
                                var name = row[0].First_name + " " + row[0].Last_name
                                
                                // success
                                resolve({
                                    status: "ok",
                                    message: name
                                })
                                
                            }
                            else{
                                // failed
                                reject({
                                    status: "failed",
                                    message: "Unkown user",
                                    data: {}
                                });
                            }
                          
                        }
                        else{
                            // failed
                            reject({
                                status: "failed",
                                message: "Unkown user",
                                data: {}
                            });
                        }
                    })
                    .catch((err)=>{
                        // if there is error with our DB
                        // log the error
                        console.log(err);
                        reject({
                            status: "failed",
                            message: "Something went wrong!. Not you, was us.",
                            data: {},
                        });
                    })
                });
            }
            
            // get the account number from the request
            const acc = req.body.account_number;
            // validate the account number
            finduserValidation(acc)
            .then(find)
            .then((data) => {
                res.code(200).send(data)
            })
            .catch((error) => {
                res.code(200).send(error);
            });
        }
        else{
            // user is not logged in then send invalid response
            res.code(200).send({
                status: "failed",
                message: "Unable to find user or login again"
            });
        }
        
    })
}

export default finduser;