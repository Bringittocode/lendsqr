// cookie verification
// This routh is just to valid if user is logged in or not in every page when navigating

/**
 * @param { import("fastify").FastifyInstance } fastify
 * @returns { Promise<void> }
 */
async function validate_cookie(fastify, options, done) {
  
    fastify.post('/cookie', async (req, res) => {
        
        return new Promise(async(resolve, reject) => {

            // Remember every request pass through the app.js hander which check
            // if user is logged in i.e valid cookkie
            // then req.AUTH will be true
            if(req.AUTH)
            {
                resolve('valid')
            }
            else{
                reject('invalid')
            }
            
        })
        .then((password)=>{
            res.send({
                status: "ok"
            })
        })
        .catch((err)=>{
            res.send({
                status: "failed"
            })
        })
    })
}

export default validate_cookie;