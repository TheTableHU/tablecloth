const express = require('express');
const { checkCredentials, login } = require('../checkCredentials');
const router = express.Router();


router.post('/', async (req, res) => {
    await login(req, res);
});

module.exports = router;