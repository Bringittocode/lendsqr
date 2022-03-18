import {loginValidation} from "../validator/validation.js";
import bcrypt from "bcryptjs";

async function login(fastify, options, done) {
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
        .then((password)=>{
            req.hash_password = password
        })
        .catch((err)=>{
            req.error = {
                status: 'failed',
                message: "Unauthorize access"
            };
            throw new Error(err);
        })
    });
    
    fastify.post('/login', async (req, res) => {

        const savelogin = async function ({email}) {
            
            return new Promise((resolve, reject) => {
                fastify.KNEX('users').select('Password').where({ Email: email })
                .then(rows => {
                    if(rows.length > 0)
                    {
                        // get the request password
                        const pass = req.body.password;

                        // verify the password
                        bcrypt.compare(pass, rows[0].Password)
                        .then((match) => {
                            if(match)
                            {
                                resolve({
                                    _UI_: token,
                                    data: {
                                        status: "ok",
                                        message: "Login successful"
                                    }
                                })
                            }
                            reject({
                                status: "failed",
                                message: "Email or password is incorrect",
                                data: {}
                            });
                            
                        })
                        .catch((err) => {
                            reject({
                                status: "failed",
                                message: "Email or password is incorrect",
                                data: {}
                            });
                        })

                        // store some valuable stuff so it will be store as cookie for later use
                        const token = fastify.jwt.sign({
                                email: email,
                            },
                            process.env.Public_token_secret, {
                                expiresIn: "7d",
                                noTimestamp: true
                            }
                        );
                      
                    }
                    else{
                        console.log(rows);
                        reject({
                            status: "failed",
                            message: "Email or password is incorrect",
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

        var email = req.body.email;
        var password = req.body.password;

        loginValidation(email, password)
        .then(savelogin)
        .then((data) => {
            // encrypt the token
            const token = fastify.CryptoJS.AES.encrypt(
                data._UI_,
                process.env.Public_encrypt_secret
            ).toString();

            // set the cookie
            res.setCookie("_UI_", token, {
                    secure: true,//process.env.NODE_ENV === "production",
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    path: "/",
                    signed: true,
                    sameSite: 'none',
                }
            );
            res.send(data.data)
        })
        .catch((error) => {
            res.code(200).send(error);
        });
    })
}

export default login;