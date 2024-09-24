const xlsx = require('xlsx');
const fetch = require('node-fetch');
const fs = require('fs');
const { default: config } = require('../../frontend/src/config');
const logger = require('./logger');

function readExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; 
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const extractedData = jsonData.map(row => ({
        name: row.name,
        email: row.email,
        hNumber: row.hNumber,
        role: row.role
    }));

    return extractedData;
}

async function postDataToAPI(data) {
    try {
        const response = await fetch(config.host + '/api/users', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        logger.info(result);
        return response;
    } catch (error) {
        logger.error('Error making POST request:', error);
    }
}

async function main() {
    const filePath = ''; 
    const counter = 0;
    const extractedData = readExcelFile(filePath);
    for (const data of extractedData) {
        let response = await postDataToAPI(data);
        if(response.status == 200){
            counter = counter+1;
        }
    }
}

main();
