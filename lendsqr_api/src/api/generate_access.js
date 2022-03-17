// This routh stores the access token as cookkie for them to authorize every request made by them
// This routh suppose to be hidden in the frontend i.e server side request
// This is one NEXTJS is better than react

async function generate_access(fastify, options, done) {
  
    fastify.post('/access', async (req, res) => {
        
        const token = fastify.CryptoJS.AES.encrypt(
            "allow_access",
            process.env.Public_encrypt_secret
        ).toString();

        // stores the cookie
        res.setCookie("_AUTH_", token, {
                secure: true, //process.env.NODE_ENV === "production"
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
                signed: true,
                sameSite: 'none',
            }
        );
        res.send('ok')
    })
}

export default generate_access;