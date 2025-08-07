import postgres from "postgres";

   export const sql = postgres({
     host: 'localhost',
     port: 5432,
     user: 'postgres',
     password: 'postgres',
     database: 'thingsboard'
   });


