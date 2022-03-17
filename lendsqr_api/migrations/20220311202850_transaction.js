/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('transaction', function (table) {
       table.increments('Id',{primaryKey:true})
       table.timestamp('Created').defaultTo(knex.fn.now());
       table.string('Email', 255).notNullable();
       table.bigint('Account', 12).notNullable();
       table.string('Mode', 255).notNullable();
       table.string('Amount', 255).notNullable();

       table.foreign('Email').references('users.Email');
       table.foreign('Account').references('users.Account_number');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
	.dropTable('transaction')
};
