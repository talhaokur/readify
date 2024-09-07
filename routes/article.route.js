import { Router } from 'express';
import { HttpStatusCode } from 'axios';

const router = Router();

function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

router.get('/', (req, res) => {
    return res.status(HttpStatusCode.NotImplemented).json();
});

router.get("/:uuid", (req, res) => {
    const { uuid } = req.params;
    if (!isValidUUID(uuid))
        return res.status(HttpStatusCode.BadRequest).json({message: `Given id is not valid`});
    return res.status(HttpStatusCode.NotImplemented).json();
});

router.delete("/:uuid", (req, res) => {
    const { uuid } = req.params;
    if (!isValidUUID(uuid))
        return res.status(HttpStatusCode.BadRequest).json({message: `Given id is not valid`});
    return res.status(HttpStatusCode.NotImplemented).json();
});

export default router;