import Kurum from '../models/Kurum.js'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import Process from '../models/Process.js';
import nodemailer from "nodemailer"

// user objesinden password veya istenilen ögeler çıkarılmış şekilde return et
const kurumData = (kurum) => {
    if(kurum.length > 1) {
        const kurums = kurum.map(item => {
            return {
                _id: item._id,
                email: item.email,
                full_name: item.full_name,
                kurum_name: item.kurum_name,
                is_verify: item.is_verify,
                current_message_api: item.current_message_api,
                template: item.template,
                token: generateToken(item._id)
            }
        })
        return kurums;
    } 
    // tek bir obj ise
    return {
        _id: kurum._id,
        email: kurum.email,
        full_name: kurum.full_name,
        kurum_name: kurum.kurum_name,
        is_verify: kurum.is_verify,
        current_message_api: kurum.current_message_api,
        template: kurum.template,
        active_sms_api: kurum.active_sms_api,
        token: generateToken(kurum._id)
    }
}

const login = async (req,res) =>{
    
    try {
        const {email, password} = req.body
    
        const kurum = await Kurum.findOne({$or: [
            {email: email},
            {username: email}
        ]});

        Object.keys(req.body).forEach(e => {
            if(req.body[e] === "") { 
                return res.status(200).json({validation: {[e]: 'Bu alan boş bırakılamaz'}});
            }
        });
       
        if(kurum && (await bcrypt.compare(password, kurum.password))) {
            if(!kurum.is_verify) {
                return res.status(200).json({error: 'Hesabınız henüz onaylanmadı. Lütfen yöneticinizle iletişime geçin.'})
            }
            res.status(200).json(kurumData(kurum))
        } else {
            res.status(200).json({error: 'Girilen bilgiler ile eşleşen bir kullanıcı bulunamadı'})
        }
    } catch (error) {
        //res.json(error);
    }
}

// import validationResult from "express-validator"
const register = async (req,res) => {
    // const errors = validationResult(req);
    /*
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    */
    try {
        //req.body.password = bcrypt.hash(req.body.password)

        const { 
            email,
            password,
            password2,
            username,
            full_name,
            kurum_name,
            gsm
          } = req.body

        const findKurum = await Kurum.findOne({$or: [
            {email: email},
            {username: username}
        ]})
        
        let is_ok = 1

        /* 
        1- Bu helper neden çalışmıyor
        2- is_ok ile komtrol yapmadan return ler state'i durdurmuyor yine sorgu çalışıyor
        3- bu yapı daha iyi nasıl olabilir

        if(emptyy(req.body)) {
            is_ok = 0
            return res.status(200).json(emptyy(req.body));
        } */

        Object.keys(req.body).forEach(e => {
            if(req.body[e] === "") { 
                is_ok = 0
                return res.status(200).json({validation: {[e]: 'Bu alan boş bırakılamaz'}});
            }
        });
          
        if(password != password2) {
            is_ok = 0
            return res.status(200).json({validation: {password2: 'Şifreler uyuşmuyor'}});
        }

        if(findKurum) {
            is_ok = 0
            return res.status(200).json({error: 'Bu email adresi veya kullanıcı adı ile kayıt bulunmaktadır'});
        }
        
        
        if(is_ok) {
            const salt = await bcrypt.genSalt(10)
            req.body.password =  await bcrypt.hash(req.body.password, salt)
        
            const kurum = await Kurum.create(req.body);
            
            // Her kurum için default KAYIT process'i oluştur
            await Process.create({
                kurum_id: kurum._id,
                process_title: "KAYIT",
                process_order: 0
            });

            return res.status(200).json({
                _id: kurum._id,
                email: kurum.email,
                username: kurum.username,
                gsm: kurum.gsm,
                is_verify: kurum.is_verify,
                template: kurum.template,
                full_name: kurum.full_name,
                kurum_name: kurum.kurum_name,
                token: generateToken(kurum._id)
            });
        }

        /*const user = new User(req.body);
        const savedUser = await kurum.save()
        res.status(200).json(savedUser)*/

    } catch (error) {
        //console.log(error);
        //res.status(500).send(error);
    }
}

const kurums = asyncHandler( async (req,res) => {
    const kurumlar = await Kurum.find().select("-template");
    // execPupulate() 'i silipte dene 
    //await kurumlar.populate('kurum_id').execPopulate() - bu kodla kurumlar.project şeklinde erişilebilecek mi? - tabloyu söylemeden nasıl buluyor? içinde kurum_id li bütün collectionları mı alıyor 
    return res.status(200).json(kurumlar);
})

const find = async (req,res) => {
  /* try {
        const kurum = await Kurum.findById({ _id: req.params.id }) // routerda /user/:id şeklinde id parametresi var
        res.status(200).json(kurum);
   } catch (error) {
        console.log(error);
        res.status(500).send(error);
   }
*/
   /**
    * ID ile Collection'dan spesifik field'ları çekmek için
    */
    const kurumSpecial = await Kurum.findById({ _id: req.params.id }).exec(); // _id, full_name, kurum_name key'li obj döner
    res.status(200).json(kurumSpecial)
    /**
     * var mı? varsa _id döner 
     */
    //const is = await Kurum.exists({ istediginKey: "değeri" })
    
    /**
     * where - eşleşirse objeyi döner - dönen objeden istediklerini almak için .select("title gsm zart zurt")
     */
    //const where = await Kurum.where(key).equals("değeri")
}

const update = async (req,res) => {
    const id = { _id: req.params.id }
    let doc = await Kurum.findOneAndUpdate(id, req.body, {new: true});
    res.status(200).json(doc);
}
const _delete = async (req,res) =>{
   /* const result = await Kurum.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json(result);*/

    /** */
    //const zart = await deleteOne({ istediginKey: "değeri" }) // belirtilen değere ait bulduğu ilk kaydı siler
    //const zurt = await deleteMany({ istediginKey: "değeri" }) // belirtilen değere ait bulduğu bütün kayıtları siler
}

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'}) // buradaki json key id olduğu için decode ederken de id olmalı
}

const onKayit = (req,res) => {
    const {kurum_id} = req.params
    console.log(kurum_id);
    console.log(req.body);
    // res.status(200).json(response)

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "hesap.akkus@gmail.com",
            pass: "dnbqgkcxgfnlkstk"
        }
    });

    const mailOptions = {
        from: "hesap.akkus@gmail.com",
        to: req.body.email,
        subject: "Kurban",
        html: `İsim: ${req.body.full_name} </br> GSM: ${req.body.phone}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        } else{
            console.log("Email sent: " + info.response);
            res.status(200).json({response: true})
        }
    });

}

export {login, kurums, register, find, update, _delete, onKayit}