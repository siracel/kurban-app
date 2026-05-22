import express from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3Client } from '@aws-sdk/client-s3'
import AWS from 'aws-sdk'
import progress from 'progress-stream'
const router = express.Router()

import { create, update, _delete, uploadKurbanVideo, uploadKurbanImage, changeKurbanProcess, reorderKurbans } from '../controllers/BuyukbasKurbanController.js'

router.post('/:project_id', create)

// /:id'den ÖNCE tanımlanmalı, yoksa "reorder" id olarak yakalanır
router.put('/reorder', reorderKurbans)

router.put('/:id', update)

// { parametre ile kurban_id, process (process_id), kurum_id } alıyor
router.put('/change-process/:id', changeKurbanProcess)







/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //cb(null, 'client/public/uploads');
        cb(null, 'client/src/assets/uploads');
    },
    filename: (req, file, cb) => {
        const newName = new Date().toISOString()
        cb(null, newName + ".mp4");
        //cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
})*/


const s3 = new S3Client({
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    },
    // bunlar olmasa da olur - kaldır - dene
    hostPrefixEnabled: true,
    computeChecksums: true,
    s3BucketEndpoint: true,
    correctClockSkew: true
    
})

// image için olan validation mp4 olarak değiştirilecek
const filefilter = (req, file, cb) => {
  if (file.mimetype === 'video/mp4' || file.mimetype === 'image/jpg' 
      || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
          cb(null, true);
      }else {
          cb(null, false);
      }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'awskurbanapp',
    ACL: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      const extension = file.originalname.split(".").pop()
      cb(null, Date.now().toString() + "." + extension)
    },
    filefilter: filefilter
  })
})

/* Create Bucket */
/*
s3.createBucket({
  Bucket: BUCKET_NAME   
}, function () {
  s3.putObject(params, function (err, data) {});
})
*/


//const upload = multer({storage: storage, fileFilter: filefilter})
//const upload = multer({storage: storage});

router.post('/video/:id', upload.single('file'), uploadKurbanVideo)
router.post('/image/:id', upload.single('kurban_img'), uploadKurbanImage)

router.delete('/:id', _delete)

export default router