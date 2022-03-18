import {cookieValidation} from "../validator/validation.js";

async function gethistory(fastify, options, done) {
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
    
    fastify.post('/gethistory', async (req, res) => {

        if(req.AUTH===true)
        {
            const getprof = async function ({email}) { 

                return new Promise(async(resolve, reject) => {
                    fastify.KNEX('users').select("Income", "Expense", "Deactivate")
                    .where({ Email: email })
                    .then((row)=> {
                        if(row.length > 0)
                        {
                            if(row[0].Deactivate === 0)
                            {
                                
                                var getModel = () => fastify.KNEX("transaction").where({ Email: email })
                                getModel().count("Email as all")
                                
                                .then(all =>{
                                    var page = req.body.page || 0;
                                    var current_page = Math.abs(parseInt(page));
                                    const offset = 3 *  current_page;
                                    var next_page = current_page + 1
                                    var total_page = Math.ceil(parseInt(all[0].all) / 3); 
                                    
                                    getModel().orderByRaw('Created DESC').offset(offset).limit(3).select()
                                    
                                    .then(res=>{
                                        if(res.length > 0)
                                        {
                                            resolve({
                                                status: "ok",
                                                results: res,
                                                income: row[0].Income,
                                                expense: row[0].Expense,
                                                total: total_page,
                                                next_page: next_page,
                                                prev_page: next_page - 2
                                            })
                                        }
                                        else{
                                            resolve({
                                                status: "ok",
                                                results: false,
                                                income: row[0].Income,
                                                expense: row[0].Expense
                                            })
                                        }
                                    })
                                    
                                });
                                
                            }
                            else{
                                reject({
                                    status: "failed",
                                    message: "Unauthorized",
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

export default gethistory;