const express = require('express');
const env = require('dotenv')
env.config();
const app = express();
const port = process.env.PORT || 4000
const connectDB = require('./db/database');
const userRouter = require('./Routes/userRoutes')
const hostRouter = require('./Routes/hostRoute');
const AdminRouter = require('./Routes/adminRoute');
const cookieParser = require('cookie-parser'); 


connectDB();

app.use(cookieParser())

app.use(express.json());
app.use('/api/v1/users', userRouter)
app.use('/api/v1/host', hostRouter);
app.use('/api/v1/admin', AdminRouter);

app.get('/', (req, res) =>{
    res.send('Homepage')
});

app.listen(port, ()=>{
    console.log(`app is listening on http://localhost:${port}`)
})