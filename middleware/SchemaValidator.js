const _ = require('lodash');
const Joi = require('joi');
const Schemas = require('../schemas');

module.exports = (useJoiError = false) => {

    const _useJoiError = _.isBoolean(useJoiError) && useJoiError;
    const _supportedMethods = ['post'];
   
    const _validationOptions = {
        abortEarly: true, // abort after the last validation error
        allowUnknown: false, // allow unknown keys that will be ignored
        stripUnknown: false // remove unknown keys from the validated data
    };

    return (req, res, next) => {

        const route = req.route.path;
        const method = req.method.toLowerCase();

        if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {

            const _schema = _.get(Schemas, route);

            if (_schema) {

                return Joi.validate(req.body, _schema, _validationOptions, (err, data) => {

                    if (err) {

                        const JoiError = {
                            status: 'failed',
                            error: {
                                original: err._object,
                                details: _.map(err.details, ({message, type}) => ({
                                    message: message.replace(/['"]/g, ''),
                                    type
                                }))
                            }
                        };

                        const CustomError = {
                            status: 'failed',
                            error: 'Invalid request data. Please review request and try again.'
                        };

                        res.status(422).json(_useJoiError ? JoiError : CustomError);

                    } else {
                        req.body = data;
                        next();
                    }

                });

            }
        }
        
        next();
    };
};
