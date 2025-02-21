import database from '../config/mysql.config.js'
import Response from '../domain/response.js'
import logger from '../util/logger.js'
import QUERY from '../query/patient.query.js'

const HttpStatus = {
    OK: {code: 200, status: 'OK'},
    CREATED: {code: 201, status: 'CREATED'},
    NO_CONTENT: {code: 204, status: 'NO_CONTENT'},
    BAD_REQUEST: {code: 400, status: 'BAD_REQUEST'},
    NOT_FOUND: {code: 404, status: 'NOT_FOUND'},
    INTERNAL_SERVER_ERROR: {code: 500, status: 'INTERNAL_SERVER_ERROR'},
}

export const getPatients = (req, res) => {
    try {
        logger.info(`${req.method} ${req.originalUrl} fetching patients`);
        
        database.query(QUERY.SELECT_PATIENTS, (error, results) => {
            if (error) {
                logger.error(`Database error: ${error.message}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error fetching patients`));
            }

            if (!results || results.length === 0) {
                return res.status(HttpStatus.OK.code)
                    .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No Patients found`));
            }

            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patients retrieved`, { patients: results }));
        });
    } catch (err) {
        logger.error(`Unexpected error: ${err.message}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Unexpected error`));
    }
};

export const createPatient = (req, res) => {
    try {
        logger.info(`${req.method} ${req.originalUrl} create patient`);

        const { first_name, last_name, email, address, diagnosis, phone, image_url } = req.body;
        const values = [first_name, last_name, email, address, diagnosis, phone, image_url];

        database.query(QUERY.CREATE_PATIENT, values, (error, results) => {
            if (error) {
                logger.error(`Database error: ${error.message}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error creating patient`));
            }

            if (!results || !results.insertId) {
                logger.error(`Unexpected database response`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Patient creation failed`));
            }

            const patient = { id: results.insertId, ...req.body, created_at: new Date() };
            res.status(HttpStatus.CREATED.code)
                .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Patient created`, { patient }));
        });

    } catch (err) {
        logger.error(`Unexpected error: ${err.message}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Unexpected error`));
    }
};

export const getPatient = (req, res) => {
    try {
        logger.info(`${req.method} ${req.originalUrl} fetching patient`);
        
        const { id } = req.params;

        database.query(QUERY.SELECT_PATIENT, [id], (error, results) => {
            if (error) {
                logger.error(`Database error: ${error.message}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error fetching patient`));
            }

            if (!results || results.length === 0) {
                return res.status(HttpStatus.NOT_FOUND.code)
                    .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient with ID ${id} was not found`));
            }

            res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient retrieved`, results[0]));
        });

    } catch (err) {
        logger.error(`Unexpected error: ${err.message}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Unexpected error`));
    }
};

export const updatePatient = (req, res) => {
    try {
        logger.info(`${req.method} ${req.originalUrl} fetching patient`);

        const { id } = req.params;

        database.query(QUERY.SELECT_PATIENT, [id], (error, results) => {
            if (error) {
                logger.error(`Database error: ${error.message}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error fetching patient`));
            }

            if (!results || results.length === 0) {
                return res.status(HttpStatus.NOT_FOUND.code)
                    .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient with ID ${id} was not found`));
            }

            logger.info(`${req.method} ${req.originalUrl} updating patient`);

            const { first_name, last_name, email, address, diagnosis, phone, image_url } = req.body;
            const values = [first_name, last_name, email, address, diagnosis, phone, image_url];

            database.query(QUERY.UPDATE_PATIENT, [...values, id], (error, results) => {
                if (error) {
                    logger.error(`Database error: ${error.message}`);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error updating patient`));
                }

                res.status(HttpStatus.OK.code)
                    .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient updated successfully`, { id, ...req.body }));
            });
        });

    } catch (err) {
        logger.error(`Unexpected error: ${err.message}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Unexpected error`));
    }
};

export const deletePatient = (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`${req.method} ${req.originalUrl} deleting patient`);

        database.query(QUERY.DELETE_PATIENT, [id], (error, results) => {
            if (error) {
                logger.error(`Database error: ${error.message}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error deleting patient`));
            }

            if (results.affectedRows > 0) {
                return res.status(HttpStatus.OK.code)
                    .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient deleted successfully`));
            }

            return res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient with ID ${id} was not found`));
        });

    } catch (err) {
        logger.error(`Unexpected error: ${err.message}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Unexpected error`));
    }
};

export default HttpStatus