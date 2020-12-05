const Joi = require("joi")

module.exports = {
    login: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
        }
    },
    register: {
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            dob: Joi.string().required(),
            city: Joi.string().required(),
        }
    }
}