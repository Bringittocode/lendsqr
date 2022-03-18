import {registerValidation} from "../validator/validation.js";
import bcrypt from "bcryptjs";

async function register(fastify, options, done) {
    // error variable will be available anywhere from the request
    fastify.decorateRequest('error', null);
    fastify.decorateRequest('hash_password', null);

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
                    const salt = await bcrypt.genSalt(12);
                    const pass = bcrypt.hash(req.body.password, salt);
                    resolve(pass);
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
            // console.log(err);
            req.error = {
                status: 'failed',
                message: "Unauthorize access"
            };
            throw new Error(err);
        })
    });
    
    fastify.post('/register', async (req, res) => {

        const storeUser = async function ({email}) { 
            const hash = req.hash_password;
            
            return new Promise((resolve, reject) => {
                fastify.KNEX('users').select('Email').where({ Email: email })
                .then(rows => {
                    if(rows.length === 0)
                    {
                        const num = Math.floor(Math.random() * 55555555) + 11111111;
                        const acc = "10"
                        const acc_num = acc.concat(num)
                        fastify.KNEX('users').insert({
                            Email: email,
                            Account_number: acc_num,
                            Password: hash
                        })
                        .then(result=>{
                            // console.log(result);
                            resolve({
                                status: "ok",
                                message: "Registration successful, please login and complete your settings to verify"
                            })
                        })
                        .catch(err=>{
                            // console.log(err);
                        })
                      
                    }
                    else{
                        // console.log(rows);
                        reject({
                            status: "failed",
                            message: "User already exist",
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

        registerValidation(email, password)
            .then(storeUser)
            .then((data) => {
                res.code(200).send(data)
            })
            .catch((error) => {
                res.code(200).send(error);
            });
    })
}

export default register;