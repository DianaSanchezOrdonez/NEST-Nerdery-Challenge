# Nest-Nerdery-Challenge

## About The Project
Build a tiny REST API store 

## Technical requirements
* POSTGRESQL
* Expressjs
* Typescript
* Jest
* Prettier
* Eslint
* AWS

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Change the values in .env following the keys of env.example
  ```sh
  ---DATABASE
  DATABASE_URL=
  SENDGRID_API_KEY=
  TOKEN_KEY=
  TOKEN_EXPIRATION=
  AWS_REGION=
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  AWS_PUBLIC_BUCKET_NAME=
  ```
  * Do the same for .env.test if you want to have a different database for testing

5. Run migration commands 

  Run prisma migrations
   ```sh
   npm run prisma:run:migration
   ```
  Run prisma seed migrations
   ```sh
   npm run prisma:seed
   ```
  Run prisma migrations for the test database
   ```sh
   npm run migrate-dbtest
   ```
   
6. Endpoint deploy in Heroku
    * https://challenge-nest.herokuapp.com/
    * Swagger Documentation: https://challenge-nest.herokuapp.com/docs


## Team
* Fran Tiravantt - https://github.com/Fran2304/NEST-Nerdery-Challenge
* Diana Ordoñez - https://github.com/DianaSanchezOrdonez/NEST-Nerdery-Challenge