const express = require('express');
const { addUser, getUsers, updateUser, deleteUser, resetPIN } = require('../controllers/usersController');
const router = express.Router();


router.post('/', async (req, res) => {
    await addUser(req, res);
});
router.get('/', async (req, res) =>{
    await getUsers(req, res);
});
router.put('/', async (req ,res) => {
    await updateUser(req, res)
})
router.delete('/', async(req, res) => {
    await deleteUser(req, res);
})
router.post('/reset', async(req, res) => {
    await resetPIN(req, res);
})

module.exports = router;