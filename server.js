const express = require('express');
const dotenv =  require('dotenv');
dotenv.config();
const connectDb = require('./config/db.js');
const userRoutes = require('./routes/usersRoute.js');
const authRoutes = require('./routes/authRoute.js');
const {errorHandler,notFound} = require('./middleware/errorMiddleware.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');



const port = process.env.PORT || 8000;

connectDb();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req,res) => {
    res.send('Api is running')
});

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/auth',authRoutes);


app.use(errorHandler);
app.use(notFound);

app.listen(port, () => console.log(`server running on port ${port}`));