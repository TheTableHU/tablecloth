const express = require('express');
const { addUser, getUsers, updateUser, deleteUser, resetPIN, updateTraining } = require('../controllers/usersController');
const { requireAdminPermissions } = require('../checkCredentials');
const router = express.Router();


router.post('/',  requireAdminPermissions, async (req, res) => {
    await addUser(req, res);
});
router.get('/',requireAdminPermissions,  async (req, res) =>{
    await getUsers(req, res);
});
router.put('/', requireAdminPermissions, async (req ,res) => {
    await updateUser(req, res)
})
router.delete('/',requireAdminPermissions,  async(req, res) => {
    await deleteUser(req, res);
})
router.post('/reset', requireAdminPermissions,  async(req, res) => {
    await resetPIN(req, res);
})
router.post('/training', async(req, res) => {
    await updateTraining(req, res);
})

module.exports = router;