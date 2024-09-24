const logger = require('../logger.js');
const mailer = require('../mailer.js');
const { models } = require('../models/index.js');
const usersModel = models.Users;
const bcrypt = require('bcrypt');

async function addUser(req, res) {
    const { name, hNumber, email, role } = req.body;

    // Validate required fields
    if (!name || !hNumber || !email || !role) {
        return res.status(400).json({ message: 'Missing required fields: name, hNumber, email, and role are required.' });
    }

    const existingUser = await usersModel.findOne({ where: { hNumber } });
    if (existingUser) {
        return res.status(409).json({ message: "H-Number already exists." });
    }

    let randomPIN = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPin = await bcrypt.hash(randomPIN, 10);

    try {
        const newUser = await usersModel.create({
            name,
            email,
            hNumber,
            role,
            PIN: hashedPin,
        });

        // Send email to user
        await mailer.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Credentials for TheTableHU',
            text: `Hey! An account has just been created for you.
            Please log in by scanning your Harding ID and then entering your PIN: ${randomPIN}.
            This PIN is unique to you and we do not have access to it after it has been generated.
            Please remember to always logout after your shift.`,
            html: `<p>Hey! An account has just been created for you.
            Please log in by scanning your Harding ID and then entering your PIN: ${randomPIN}.
            This PIN is unique to you and we do not have access to it after it has been generated.
            Please remember to always logout after your shift.</p>`,
        });

        return res.status(200).json({ message: "User created successfully with ID: " + newUser.id + " and PIN: " + randomPIN });
    } catch (error) {
        console.error('Error while creating user:', error);
        return res.status(500).json({ message: "Error while creating user" });
    }
}

async function getUsers(req, res) {
    try {
        const allUsers = await usersModel.findAll();
        let data = allUsers.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            hNumber: user.hNumber,
            role: user.role
        }));
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function updateUser(req, res) {
    const row = req.body.row;

    // Validate required fields
    if (!row || !row.hNumber || !row.name || !row.email || !row.role) {
        return res.status(400).json({ message: 'Missing required fields: hNumber, name, email, and role are required.' });
    }

    try {
        const existingUser = await usersModel.findOne({
            where: { hNumber: row.hNumber }
        });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const [affectedRows] = await usersModel.update({
            name: row.name,
            email: row.email,
            role: row.role
        }, {
            where: { hNumber: row.hNumber },
        });

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'No changes made.' });
        }

        // Successfully updated
        return res.status(200).json({
            message: 'User updated successfully',
            success: true,
        });
    } catch (error) {
        logger.error('Error updating user data:', error);
        return res.status(500).json({ message: 'Could not update user data: ' + error.message });
    }
}

async function deleteUser(req, res) {
    const { hNumber } = req.body;

    // Validate required field
    if (!hNumber) {
        return res.status(400).json({ message: 'Missing required field: hNumber.' });
    }

    try {
        const result = await usersModel.destroy({
            where: { hNumber }
        });

        if (result) {
            return res.status(200).json({ message: "User deleted successfully." });
        } else {
            return res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.error('Error while deleting user:', error);
        return res.status(500).json({ message: "Error while deleting user." });
    }
}

async function resetPIN(req, res) {
    const { hNumber } = req.body;

    // Validate required field
    if (!hNumber) {
        return res.status(400).json({ message: 'Missing required field: hNumber.' });
    }

    let randomPIN = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPin = await bcrypt.hash(randomPIN, 10);

    try {
        const [affectedRows] = await usersModel.update({ PIN: hashedPin }, {
            where: { hNumber },
        });

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made.' });
        }

        const updatedUser = await usersModel.findOne({ where: { hNumber } });

        await mailer.sendMail({
            from: process.env.EMAIL,
            to: updatedUser.email,
            subject: 'New PIN for TheTableHU',
            text: `Hey! An administrator requested a new PIN for your account.
            Please log in by scanning your Harding ID and then entering your PIN: ${randomPIN}.`,
            html: `<p>Hey! An administrator requested a new PIN for your account.
            Please log in by scanning your Harding ID and then entering your PIN: ${randomPIN}.</p>`,
        });

        return res.status(200).json({ message: 'PIN successfully changed to ' + randomPIN, success: true });
    } catch (error) {
        logger.error('Error resetting PIN:', error);
        return res.status(500).json({ message: 'Could not reset PIN: ' + error.message });
    }
}

module.exports = {
    addUser,
    getUsers,
    updateUser,
    deleteUser,
    resetPIN
};
