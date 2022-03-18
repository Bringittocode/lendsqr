import {cookieValidation} from "../validator/validation.js";

async function getprofile(fastify, options, done) {
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
    
    fastify.post('/getprofile', async (req, res) => {

        if(req.AUTH)
        {
            const getprof = async function ({email}) { 

                return new Promise((resolve, reject) => {
                    fastify.KNEX('users').select("*").where({ Email: email })
                    .then(rows => {
                        if(rows.length > 0)
                        {
                            if(rows[0].Deactivate === 0)
                            {
                                resolve({
                                    status: "ok",
                                    email: rows[0].Email,
                                    firstname: rows[0].First_name,
                                    lastname: rows[0].Last_name,
                                    acc_num: rows[0].Account_number,
                                    verify: rows[0].Verify
                                })
                            }
                            reject({
                                status: "failed",
                                message: "Unauthorized please login againa",
                                data: {}
                            });
                          
                        }
                        else{
                            reject({
                                status: "failed",
                                message: "Unauthorized please login againb",
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

            cookieValidation(req._UI_)
            .then(getprof)
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

export default getprofile;