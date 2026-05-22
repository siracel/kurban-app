import Kurum from '../models/Kurum.js'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import bcrypt from "bcrypt";

import mongoose from "mongoose";

const login = async (req,res) =>{
    try {
        const {email, password} = req.body
    
        const admin = await Admin.findOne({email});

        if(admin && (await bcrypt.compare(password, admin.password))) {
            return res.status(200).json({
                id: admin._id,
                email: admin.email,
                createdAt: admin.createdAt,
                token: generateToken(admin._id)
            })
        } else {
            return res.status(200).json({error: 'Doesn\'t match with the any admin.'})
        }
    } catch (error) {
        //res.json(error);
    }
}


const create = async (req,res) =>{    
    try {
        const { id: _id } = req.params;

        if(mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No item wit that id')

        const projectExisting = await Project.findById(id);
        if (!projectExisting) {
            return res.status(404).json({ msg: "project not found" });
        }

        if (projectExisting.creator.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not authorized" });
        }

        const user = new User(req.id);
        await user.save();
        res.json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).send("there was an error");
    }
}

const find = async (req,res) =>{

}

const update = async (req,res) =>{

}

const _delete = async (req,res) =>{ }

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

// Admin: tüm kurumları, her birine impersonation için token üreterek listeler
const listKurums = async (req, res) => {
    try {
        const kurumlar = await Kurum.find().select('-password -template').sort('kurum_name')
        const data = kurumlar.map(k => ({
            _id: k._id,
            email: k.email,
            username: k.username,
            full_name: k.full_name,
            kurum_name: k.kurum_name,
            gsm: k.gsm,
            is_verify: k.is_verify,
            current_message_api: k.current_message_api,
            active_sms_api: k.active_sms_api,
            createdAt: k.createdAt,
            token: generateToken(k._id),
        }))
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// Admin: bir kurumun onay durumunu değiştirir
const verifyKurum = async (req, res) => {
    try {
        const { id } = req.params
        const { is_verify } = req.body
        const updated = await Kurum.findByIdAndUpdate(id, { is_verify: !!is_verify }, { new: true }).select('_id is_verify kurum_name')
        if (!updated) return res.status(404).json({ error: 'Kurum bulunamadı' })
        return res.status(200).json({ _id: updated._id, is_verify: updated.is_verify })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export {login, create, find, update, _delete, listKurums, verifyKurum}