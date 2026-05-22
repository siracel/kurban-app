import express from 'express'
const router = express.Router()

import kurumMiddleware from "../middleware/kurum.js"

// Controllers
import { login, kurums, register, find, update, _delete } from '../controllers/KurumController.js'
//import { getAll } from '../controllers/DashboardMenuController.js'


router.get('/', kurumMiddleware, kurums)
//router.get('/menus', kurumMiddleware, getAll)
//router.get('/:id/projects', kurumMiddleware, kurums)
router.post('/login', login)
router.post('/register', register)
// buraya post requesti al mail at

router.get('/:id', kurumMiddleware, find)
router.put('/:id', update)
router.delete('/:id', _delete)

export default router