import express from 'express';
const router = express.Router();

router.get('/user', (req, res) => {
    res.status(200).json({ message: 'User route working!' });
});


export default router;
