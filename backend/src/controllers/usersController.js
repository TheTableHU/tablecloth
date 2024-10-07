const path = require('path');
const logger = require('../logger.js');
const { models } = require('../models/index.js');
const usersModel = models.Users;
const bcrypt = require('bcrypt');

const fs = require('fs');
const mailerPromise = require('../mailer.js');

async function addUser(req, res) {
    const mailer = await mailerPromise;
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

        await mailer.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'New Account for TheTableHU!',
            template: 'new-user-thetable', 
            context: { 
                name: name,
                PIN: randomPIN,
                role: role
            }
        });

        const newUser = await usersModel.create({
            name,
            email,
            hNumber,
            role,
            PIN: hashedPin,
            
        });


        return res.status(200).json({ message: "User created successfully with ID: " + newUser.id});
    } catch (error) {
        logger.error('Error while creating user:', error);
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
    const mailer = await mailerPromise;
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
            subject: 'New PIN for TheTableHU!',
            template: 'reset_pin',  // name of your Handlebars template
            context: {  // Variables for the template
                name: updatedUser.name,
                PIN: randomPIN,
            }
        });


        return res.status(200).json({ message: 'PIN successfully changed'});
    } catch (error) {
        logger.error('Error resetting PIN:', error);
        return res.status(500).json({ message: 'Could not reset PIN: ' + error.message });
    }
}
async function updateTraining(req, res){
    let hNumber = res.locals.hNumber;
    try{
    usersModel.update({lastTrainingDate: new Date()},{
        where: {hNumber}
    });
    res.status(200).json({message: "Training updated"});
}catch(err){
    info.error(err.message);
    res.status(500).json({message: err.message});
}
}
module.exports = {
    updateTraining,
    addUser,
    getUsers,
    updateUser,
    deleteUser,
    resetPIN
};
