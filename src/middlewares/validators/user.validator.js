import Joi from 'joi';

export const validateUser = (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().min(2).required(),
        last_name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        age: Joi.number().integer().min(18).required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: "error", error: error.details[0].message });
    }
    next();
};