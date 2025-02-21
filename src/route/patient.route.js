import express from 'express'
import { getPatient, createPatient, getPatients, deletePatient, updatePatient } from '../controller/patient.controller.js'
import validatePatient from '../util/validatePatient.js'
const patientRoutes = express.Router()

patientRoutes.route('/')
    .get(getPatients)
    .post(validatePatient, createPatient)

patientRoutes.route('/:id')
    .get(getPatient)
    .put(validatePatient, updatePatient)    
    .delete(deletePatient)

export default patientRoutes