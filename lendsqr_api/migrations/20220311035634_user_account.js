/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema
    .createTable('users', function (table) {
       table.timestamp('Created').defaultTo(knex.fn.now()).primary();
       table.string('Email', 255).notNullable();
       table.string('Password', 255).notNullable();
       table.string('First_name', 255).nullable();
       table.string('Last_name', 255).nullable();
       table.bigint('Account_number', 12).notNullable();
       table.string('Income', 255).defaultTo(0);
       table.string('Expense', 255).defaultTo(0);
       table.string('Balance', 255).defaultTo(0);
       table.boolean('Verify').defaultTo(false);
       table.boolean('Deactivate').defaultTo(false);

       table.unique('Email')
       table.unique('Account_number')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema
	.dropTable('users')
};
