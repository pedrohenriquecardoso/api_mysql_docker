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
    logger.info(`${req.method} ${req.originalUrl} fetching patients`)
    database.query(QUERY.SELECT_PATIENTS, (error, results) => {
        if(!results) {
            res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `No Patients found`))
        } else {
            res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patients retrieved`, {patients: results}))
        }
    })
}

export const createPatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl} create patient`)
    const { first_name, last_name, email, address, diagnosis, phone, image_url } = req.body
    const values = [first_name, last_name, email, address, diagnosis, phone, image_url]
    database.query(QUERY.CREATE_PATIENT, values,(error, results) => {
        if(!results) {
            logger.error(error.message)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`))
        } else {
            const patient = {id: results.insertId, ...req.body, created_at: new Date()}
            res.status(HttpStatus.CREATED.code)
            .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Patient created`, {patient}))
        }
    })
}

export const getPatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl} fetching patient`)
    const { id } = req.params
    database.query(QUERY.SELECT_PATIENT, [id],(error, results) => {
        if(!results[0]) {
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient by id ${req.params.id} was not found`))
        } else {
            res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient retrieved`, results[0]))
        }
    })
}

export const updatePatient = (req, res) => {
    logger.info(`${req.method} ${req.originalUrl} fetching patient`)
    const { id } = req.params
    database.query(QUERY.SELECT_PATIENT, [id],(error, results) => {
        if(!results[0]) {
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient by id ${id} was not found`))
        } else {
            logger.info(`${req.method} ${req.originalurl} updating patient`)
            const { first_name, last_name, email, address, diagnosis, phone, image_url } = req.body
            const values = [first_name, last_name, email, address, diagnosis, phone, image_url]
            database.query(QUERY.UPDATE_PATIENT, [...values, id],(error, results) => {
                if (!error) {
                    res.status(HttpStatus.OK.code)
                    .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient retrieved`, {id: id, ...req.body}))
                } else {
                    logger.error(error.message)
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                    .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`))
                }
            })
        }
    })
}

export const deletePatient = (req, res) => {
    const { id } = req.params
    logger.info(`${req.method} ${req.originalUrl} deleting patient`)
    database.query(QUERY.DELETE_PATIENT, [id],(error, results) => {
        if(results.affectedRows > 0) {
            res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Patient deleted`, results[0]))
        } else {
            res.status(HttpStatus.NOT_FOUND.code)
            .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Patient by id ${req.params.id} was not found`))
        }
    })
}

export default HttpStatus