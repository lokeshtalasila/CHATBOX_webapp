import express from "express";
import connectdb from "./db/index.js";
import dotenv from "dotenv";

const app = express();

dotenv.config({
    path: './.env'
});

connectdb();

app.get('/', (req, res) => {
    res.send('Server is ready');
});

app.get('/twitter', (req, res) => {
    res.send('Are you ready');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
