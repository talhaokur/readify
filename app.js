import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// Artifact repository
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname + '/output'));

app.get('/', (req, res) => {
    res.json({status: "OK"});
});


app.use(
    (err, req, res, next) => {
        if (err && err.errorCode) {
            res.status(err.errorCode).json(err.message);
        } else if (err) {
            res.status(500).json(err.message);
        }
        console.error(`${err}, ${err.message}`)
    });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.info(`server up on port ${PORT}`);
});