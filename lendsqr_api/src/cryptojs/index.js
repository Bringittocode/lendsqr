import CryptoJS from "crypto-js";
import fp from 'fastify-plugin';

// make the cryptojs a fastify plugin
// so it will be access by fastify.CryptoJs
const crypto = fp(async function (fastify, options) {
    fastify.decorate('CryptoJS', CryptoJS);
})

export default crypto;