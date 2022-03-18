import {updateprofileValidation} from "../validator/validation.js";

async function updateprofile(fastify, options, done) {
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
        .then(()=>{})
        .catch((err)=>{
            req.error = {
                status: 'failed',
                message: "Unauthorize access"
            };
            throw new Error(err);
        })
    });
    
    fastify.post('/updateprofile', async (req, res) => {
        
        if(req.AUTH)
        {
            const updateprof = async function ({email, firstname, lastname}) {

                return new Promise((resolve, reject) => {
                    fastify.KNEX('users').select("Verify", "Deactivate").where({ Email: email })
                    .then(row =>{
                        if(row.length > 0)
                        {
                            if(row[0].Verify == 0 && row[0].Deactivate == 0)
                            {
                                fastify.KNEX('users')
                                .update({ Email: email, First_name: firstname, Last_name: lastname, Verify: 1 })
                                .where({ Email: email })
                                .then(rows => {
                                    resolve({
                                        status: "ok",
                                        message: "Your account has been updated and verified..."
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
                                    message: "Unable to update your data",
                                    data: {},
                                });
                            }
                        }
                        else{
                            reject({
                                status: "failed",
                                message: "You have an invalid email",
                                data: {},
                            });
                        }
                    })
                    .catch(()=>{
                        reject({
                            status: "failed",
                            message: "Something went wrong!. Not you, was us.",
                            data: {},
                        });
                    })  
                });
            }
            
            var email = req.body.email;
            var firstname = req.body.firstname;
            var lastname = req.body.lastname;

            updateprofileValidation(email, firstname, lastname)
            .then(updateprof)
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

export default updateprofile;