// Update with your config settings.
// KNEXT FILE FOR THE CLI

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host : "localhost",
            user : "root",
            password : "",
            database : "lendsqr"
        }
    },

    production: {
        client: 'mysql',
        connection: {
            host : process.env.Database_host,
            user : process.env.Database_user,
            password : process.env.Database_password,
            database : process.env.Database_name
        }
    }

};
