"use strict"

import cors from "fastify-cors"; // cross origin module
import Fastify from 'fastify'; // fastify module
import Fastify_cookie from "fastify-cookie"; // cookie module
import bcrypt from "fastify-bcrypt"; // bcrypt module that support fastify
import dotenv from "dotenv"; // dotenv module
import jwt from "fastify-jwt"; //JWT module that support fastify
import KNEX from "./src/knex/index.js" //knex module that support fastify
import crypto from "./src/cryptojs/index.js"; //crypto js module that support fastify
import register from "./src/api/register.js"; // registration routh module
import generate_access from "./src/api/generate_access.js"; // get access routh module
import validate_cookie from "./src/api/cookie.js"; // cookie validation routh module
import { cookieValidation } from "./src/validator/validation.js"; // validate cookie function
import login from "./src/api/login.js"; // login routh module
import getprofile from "./src/api/getprofile.js"; //get profile routh module
import updateprofile from "./src/api/updateprofile.js"; // update profile routh module
import gethistory from "./src/api/gethistory.js"; // get history routh module
import deposite from "./src/api/deposite.js"; // deposite routh module
import withdraw from "./src/api/withdraw.js"; // withdraw routh module
import finduser from "./src/api/finduser.js"; // finduser routh module
import transfer from "./src/api/transfer.js"; // transfer routh module

// Dotenv initialization. to load .env file into the process
dotenv.config();

// fastify initialization to get the server ready
const fastify = Fastify({logger: false});

// request variable... all these variable will be available in every request
fastify.decorateRequest('AUTH', false); // req.AUTH
fastify.decorateRequest('_UI_', null); // req._UI_
fastify.decorateRequest('raw_UI_', null); // req.raw_UI_

// These hook will run before passing to the routh
// REQUEST : the request object
// REPLY: the reply object.. use to send response back to the user
// DONE: to pass the request to another handler
fastify.addHook('preHandler', (request, reply, done) => {

    // get the login cookie.... 
	// OUR cookie we are looking for is _UI_
	const unsign = request.cookies._UI_ || ''; // this will get the cookie or set it to empty
	const cookie = request.unsignCookie(unsign); //unsign it
	const _UI_ = cookie.value; //get the value of the cookie
	
	// using try and catch to test some code incase it throw an error
	try {
        // our cookie was encrypt then decrypt the cookie
		var bytes = fastify.CryptoJS.AES.decrypt(
            _UI_,
            process.env.Public_encrypt_secret
		);
		const token = bytes.toString(fastify.CryptoJS.enc.Utf8); //convert to valid string
  
        // verify the decryption ( we encrypt jwt as cookie so we need to verify as well )
		fastify.jwt.verify(
			token,
			process.env.Public_token_secret,
			function (err, decoded) {
				if (decoded) {
                    // Validate if what is inside the cookie is what we stil want
					// this is useful incase we don't want some things again, so the user will automatically be force to login again
					cookieValidation(decoded)
					.then(()=>{
						request._UI_ = decoded; // store the json decoded in the request object for the routh to access it
						request.raw_UI_ = unsign; // get the raw cookie incase we want to store the cookie again
						
                        request.AUTH = true; // the user has a valid cookie therefore the user is still login
						done(); // pass the request to another handler

					})
					.catch(() => {
						// we do not care about the error
						done(); // pass the request to another handler
					});
				}
			}
		);
	} catch (error) {
		// we do not care about the error
		done(); // pass the request to another handler
	}

});

// register the crypto module so it can be accessible anywhere
// the name will be determine by what is use to store in the decoration
// in this case to access it is : fastify.CRYPTOJS
fastify.register(crypto)

// register the becrypt module
fastify.register((bcrypt), {
	saltWorkFactor: 12
})

// cookie phaser
fastify.register(Fastify_cookie, {
	secret: process.env.Public_sign_cookie, // for cookies signature
	parseOptions: {} // options for parsing cookies
})

// register JWT
fastify.register(jwt, {
	secret: process.env.Public_token_secret,
})

// register knex
fastify.register(KNEX,{
    client: 'mysql',
    connection: {
		host : "localhost",
		user : "root",
		password : "",
		database : "lendsqr"
    },
});

// cors allow for our frontend
fastify.register(cors, {
	origin: "http://localhost:3000",
	optionsSuccessStatus: 200,
	credentials: true,
})


// all routh
fastify.register(login, {prefix: '/auth'});

fastify.register(register, {prefix: '/auth'});

fastify.register(generate_access, {prefix: '/auth'});

fastify.register(validate_cookie, {prefix: '/auth'});

fastify.register(getprofile, {prefix: '/user'});

fastify.register(updateprofile, {prefix: '/user'});

fastify.register(gethistory, {prefix: '/user'});

fastify.register(deposite, {prefix: '/user'});

fastify.register(withdraw, {prefix: "/user"});

fastify.register(finduser, {prefix: "/user"});

fastify.register(transfer, {prefix: "/user"});

// when we trigger error from any request handler i.e we dont want to process the request again
// this handler is going to handle it and send approprate message to user
fastify.setErrorHandler(function (error, request, reply) {
	// console.log(error);
	// request.error is what we set before triggering the error
	reply.status(200).send(request.error)
})

// do somethings after fastify is ready
fastify.ready()
.then(() => {});

const port = process.env.PORT || 5000;

// Run the server!
const start = async () => {
	try {
		fastify.listen(port, '127.0.0.1')
		.then((address) => console.log(`server listening on ${address}`))
		.catch(err => {
			console.log('Error starting server:', err)
			process.exit(1)
		})

	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()
