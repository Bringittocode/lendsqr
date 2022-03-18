These is a web application for practicing... You can also impliment any of these in your project. feel free to play with.

REACT
NODEJS => fastify

# Get started by doing the following

clone or download those folder..
## banka folder
> npm i
> npm start

## banka_api folder
ENVIRONMENT VARIABLE:
put this in your .env
> Database_host = 

> Database_user = 

> Database_password = 

> Database_name = 

> Public_token_secret = 

> Public_encrypt_secret = 

> Public_sign_cookie =

install by
> npm i
> npm i knex -g

create a database named banka
> knex migrate:up -esm

# testing using cypress
## banka folder
> npx cypress open
or use
> npm run cypress:open

After all test make sure you delete the user from your database
and clear all transaction record as well incase you want to test again.

TODO:
> upgrade the frontend to NEXTJS
> Add more feature
> Add more documentation
