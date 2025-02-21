import Joi from "joi";

const patientSchema = Joi.object({
    first_name: Joi.string().max(255).required(),
    last_name: Joi.string().max(255).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(255).allow(null, ""),
    diagnosis: Joi.string().max(255).allow(null, ""),
    phone: Joi.string().pattern(/^\d{9,15}$/).required(),
    image_url: Joi.string().uri().allow(null, ""),
});

const validatePatient = (req, res, next) => {
    const { error } = patientSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    next();
};

export default validatePatient