import express from 'express'
const router = express.Router()
import dotenv from 'dotenv'
dotenv.config({ path: './config/config.env' })

import adminMiddleware from "../middleware/admin.js"
import { login, listKurums, verifyKurum } from '../controllers/AdminController.js'

router.post('/login', login)
router.get('/kurums', adminMiddleware, listKurums)
router.put('/kurums/:id/verify', adminMiddleware, verifyKurum)

export default router