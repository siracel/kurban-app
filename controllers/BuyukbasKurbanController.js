import Buyukbas from '../models/Buyukbas.js'
import asyncHandler from 'express-async-handler'
import Process from '../models/Process.js';
import AWS from 'aws-sdk'
import KurbanProcessChangeFacade from './KurbanProcessChangeFacade/KurbanProcessChangeFacade.js';

const changeKurbanProcess = async (req,res) => {
    try {
        const kurbanID = { _id: req.params.id }
        const processID = req.body.process
        const kurumID = req.body.kurum_id

        const kurbanProcessFacade = new KurbanProcessChangeFacade(kurbanID, processID, kurumID)
        const response = await kurbanProcessFacade.changeKurbanProcess()
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json(error.message);
    }
}

const findSingleBuyukbas = asyncHandler( async (req,res) => {
    const buyukbas = await Buyukbas.find({_id: req.params.id})
    return res.status(200).json(buyukbas);
})

const findAll = asyncHandler( async (req,res) => {
    const buyukbas = await Buyukbas.find({project_id: req.params.project_id}).populate("hisse").populate("process").sort('kurban_no')
    return res.status(200).json(buyukbas);
})

// Sürükle-bırak sıralama: gelen _id dizisine göre kurban_no'yu 1..N olarak yeniden atar
const reorderKurbans = async (req, res) => {
    try {
        const { items } = req.body // yeni sıradaki _id dizisi
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Geçersiz sıralama verisi" })
        }
        const ops = items.map((id, idx) => ({
            updateOne: { filter: { _id: id }, update: { kurban_no: idx + 1 } }
        }))
        await Buyukbas.bulkWrite(ops)
        return res.status(200).json({ ok: true })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


// bu method aslında 3-4 farklı metoda bölünmeliydi :(
const update = async (req,res) => {
    // net hisse fiyat number gelmeli yoksa hata veriyor
    const id = { _id: req.params.id }
    const { kurban_kupe_no, net_hisse_fiyat, kurban_weight, kurban_note, kurban_hisse_group, youtube_embed, vidyome_embed } = req.body
    // _id immutable bir alan; req.body içinde gelirse Mongo hata fırlatır.
    // Bu yüzden sadece düzenlenebilir alanları açıkça güncelliyoruz.
    const updateFields = {
        kurban_kupe_no,
        net_hisse_fiyat,
        kurban_weight,
        kurban_note,
        kurban_hisse_group,
        youtube_embed,
        vidyome_embed,
    }
    // undefined alanları gönderme (mevcut değeri silmemek için)
    Object.keys(updateFields).forEach(k => updateFields[k] === undefined && delete updateFields[k])

    const doc = await Buyukbas.findOneAndUpdate(id, updateFields, {new: true});
    return res.status(200).json(doc);
}

const create = async (req,res) => {
    const {kurum_id, project_id} = req.body
    const buyukbas = await Buyukbas.find({ project_id: project_id })
    const max_kurban_no = buyukbas.length > 0 ? buyukbas.reduce( (a,b) => a.kurban_no> b.kurban_no ? a : b).kurban_no : 0
    const countKurban = await Buyukbas.countDocuments( { kurum_id: kurum_id }, { project_id: project_id }  )
    let process = await Process.find({ $and: [{ kurum_id: kurum_id }, {process_order: 0}] });
    // process find ile çekildipğinde array içinde dönüyor create yapınca tek obj olarak dönüyor
    if(process.length === 0) {
        process = await Process.create({ kurum_id: kurum_id , process_title: "KAYIT", process_order: 0 })
    } else {
        process = process[0]
    }
    const createKurban = await Buyukbas.create({ ...req.body, process: process._id, kurban_no: max_kurban_no+1 })
    return res.status(200).json(createKurban);
}

const uploadKurbanImage = async (req, res, next) => {
    const id = { _id: req.params.id }

    try{
        // delete s3 object
        const kurban = await Buyukbas.findById(id)
        if(kurban.kurban_image) {
            const s3 = new AWS.S3(
                { 
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                    Bucket: "awskurbanapp"
                }
            );
              
            s3.deleteObject({
                Bucket: "awskurbanapp",
                Key: kurban.kurban_image_key
            }, function (err,data){
                console.log(data)
                console.log(err)
            })
        }

        const uploaded = await Buyukbas.findOneAndUpdate(id, {
            kurban_image: req.file.location,
            kurban_image_key: req.file.key
        }, {new: true});

        return res.status(200).json(uploaded);
    }catch(error) {
        return res.status(200).json({error: error});
    }

}


const _delete = async (req,res) =>{
    const result = await Buyukbas.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json(result);
}


export { create, findSingleBuyukbas, findAll, update, _delete, uploadKurbanImage, changeKurbanProcess, reorderKurbans }