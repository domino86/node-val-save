const Joi = require('joi');
const name = Joi.string().max(1).regex(/^[A-Z]+$/).uppercase();

const itemsDataSchema = Joi.object().keys({
	    data: Joi.array().required().items(Joi.object({
	    type: name.required(),
		pos: Joi.array().items(Joi.number()).max(2).required(),
		cost: Joi.number().max(5).required(),
		amount: Joi.number().max(12).required()
	}))
});

module.exports = {
    '/items': itemsDataSchema,
};
