const express = require('express');

const { models } = require('./models/index.js');
const logger = require('./logger');
const Users = models.Users;
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');

const path = require('path');
const { publicDecrypt } = require('crypto');


async function requireVolunteerPermissions(req, res, next){
    if(res.locals.role == 'user' || res.locals.role == 'worker' || res.locals.role == "admin"){
      next();
    }else{
      res.status(401).json({message: 'You do not have enough permissions to access this resource.'})
    }
  }
  async function requireAdminPermissions(req, res, next){
    if(res.locals.role == "admin"){
      next();
    }else{
      res.status(401).json({message: 'You do not have enough permissions to access this resource.'})
    }
  }
  async function requireWorkerPermissions(req, res, next){
    if( res.locals.role == 'worker' || res.locals.role == "admin"){
      next();
    }else{
      res.status(401).json({message: 'You do not have enough permissions to access this resource.'})
    }
  }


async function checkCredentials(req, res, next) {

    const authorizationHeader = req.get('Authorization') || '';
    const match = authorizationHeader.match(/Bearer\s+(\S+)/i);
    let role = 'user';
    let payload = null;
    publicKey = fs.readFileSync(path.join(__dirname, '../keys/tablecloth_public.pem'), 'utf8');
    if (match) {
        const token = match[1];
        try {
            payload = await jwt.verify(
                token,
                publicKey,
                { algorithms: ['RS256'] }
            );
            if (payload.role.includes("admin")) role = 'admin';
            if (payload.role.includes("worker")) role = 'worker';

            res.locals.role = role;
            res.locals.name = payload.sub;
            res.locals.payload = payload;
            res.locals.email = payload.email;
            res.locals.hNumber = payload.hNumber;
            next();
        }
        
        catch (err) {
            res.status(401)
                .setHeader('WWW-Authenticate', 'Bearer')
                .json({ message: 'Authorization is required' , error: err.message});
        }
    }
    else {
        res.status(401)
            .setHeader('WWW-Authenticate', 'Bearer')
            .json({ message: 'Authorization is required'});
    }
}

async function login(req, res){
    let body = req.body;
    let hNumber = body.hNumber;
    let pin = body.pin;
    let tokenResponse = await Users.login(hNumber, pin);
    if(tokenResponse.status == 401){
        res.status(401).json({message: 'Incorrect PIN'});
    }else if(tokenResponse.status == 404){
        res.status(404).json({message: "User not found"});    
    }else{
        res.status(200).json({token: tokenResponse.token, data: tokenResponse.data});
    }


}


module.exports = {
    checkCredentials,
    login,
    requireVolunteerPermissions,
    requireWorkerPermissions,
    requireAdminPermissions
}