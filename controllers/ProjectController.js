import Project from '../models/Project.js'
import asyncHandler from 'express-async-handler'
//import mongoose from 'mongoose';
const projects = asyncHandler( async (req,res) => {
    //if( !mongoose.Types.ObjectId.isValid(req.params.kurum_id) ) return false;
    const projects = await Project.find({kurum_id: req.params.kurum_id}) //.select("-template")
    return res.status(200).json(projects);
})

const findProject = async (req,res) => {
   try {
        // routerda /kurum/:kurum_id/project/:id şeklinde id parametresi var
        const project = await Project.findById(req.params.id);
        res.status(200).json(project);
   } catch (error) {
        console.log(error);
        res.status(500).send(error);
   }
}

const update = async (req,res) => {
    try {
        const { project_name } = req.body
        if (!project_name || !project_name.trim()) {
            return res.status(200).json({ error: 'Proje adı boş olamaz.' })
        }
        const doc = await Project.findOneAndUpdate(
            { _id: req.params.id },
            { project_name: project_name.trim() },
            { new: true }
        );
        return res.status(200).json(doc);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const create = async (req,res) => {
    const {kurum_id, project_name} = req.body
    const isProject = await Project.find( { $and: [ { kurum_id: kurum_id }, { project_name: project_name }  ] })
    //const isProject = await Project.find({ kurum_id: kurum_id, project_name: project_name }).exec();
    
    if(isProject !== null && isProject.length > 0) {
        res.status(200).json({error: "Bu isimde bir proje mevcut.."});
    } else {
        const project = await Project.create(req.body);
        res.status(200).json(project);
    }
}

const _delete = async (req,res) =>{
    const result = await Project.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json(result);
}


export { projects, create, findProject, update, _delete}