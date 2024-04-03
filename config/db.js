const mongoose = require('mongoose');


const connectDb = async () => {
  try {
   // console.log(process.env.DB_URL);
    
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`Database connected successfully: ${conn.connection.port}`);

  } catch(error) {

    console.log(`failed connecting to to the database: ${error.message}`);
    process.exit(1);
  }
}

module.exports =  connectDb;
