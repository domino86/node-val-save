const express = require('express');
const router = express.Router();

const SchemaValidator = require('./middleware/SchemaValidator');
const saveToFile = require('./middleware/SaveToFile');

const validateRequest = SchemaValidator(true);

const handler = async (req, res, next) => {
    res.json({
        status: 'success',
        data: req.body
    });
	
	const jsonString = JSON.stringify(req.body);
	const rawBytes = new Buffer.from(jsonString);
	const encoded = rawBytes.toString('base64');
	
	const date = new Date().toISOString();
	const time = date.split('T')[1];
	const year = date.split('-')[0];
	const month = date.split('-')[1];
	const day = date.split('-')[2].split('T')[0];
	const hour = time.split(':')[0];
	const minute = time.split(':')[1];
	const seconds = time.split(':')[1].split('.')[0];
	
	const path = `./data/${year}/${month}/${day}`;
	const file = `${hour}_${minute}_${seconds}_items.json`;
	
	
	await saveToFile.writeFile(path, file, encoded);
};

// validation and file save
router.post('/items', validateRequest, handler);

module.exports = router;
