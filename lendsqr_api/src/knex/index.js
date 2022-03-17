// everything in fastify is a plugin.... 
// so we need to make knex a plugin so has to make it accessible everywhere.

import KNEX from "knex";
import fp from 'fastify-plugin';

const knex = fp(async function (fastify, options) {
    const mysql = KNEX(options)
    
    fastify.decorate('KNEX', mysql);

})

export default knex;