import bodyParser from "body-parser";
import cors from 'cors';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { GLOBALS } from './configs.js';
import UnhandledErrorMiddleware from './middlewares/unhandled-errors.middleware.js';
import routes from './routes/index.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// Artifact repository
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
GLOBALS.workingDir = __dirname;
GLOBALS.outputDir = path.join(__dirname, 'output');

app.use(routes);
app.use(UnhandledErrorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.info(`server up on port ${PORT}`);
});