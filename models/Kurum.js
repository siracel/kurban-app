import mongoose from 'mongoose'

const KurumSchema = new mongoose.Schema({
    username: String,
    email: String,
    password : String,
    full_name: String,
    kurum_name: String,
    gsm: String,
    is_verify: {
        type: Boolean,
        default: 0
    },
    current_message_api: String,
    template: {
        type: String,
        default: 'light'
    },
    active_sms_api: {
        type: mongoose.Types.ObjectId,
        ref: "MessageService"
    },
    whatsapp_appkey: {
        type: String,
        default: ""
    },
    whatsapp_authkey: {
        type: String,
        default: ""
    }
    /*
    project: {
        type: mongoose.Types.ObjectId, // ??????????????????????? project.id kaydı geçilecek 
        //type: mongoose.Schema.Types.ObjectId, // ???????????????????????
        //type: mongoose.SchemaTypes.ObjectId, // ???????????????????????
        ref: 'Project',    // bu artık Kurumdan ona ait projelere ulaşılabileceği anlamına mı geliyor - kurum_id foreign key belirtmedik???
        require: true
    }*/
}, {timestamps: true})

export default mongoose.model('Kurum', KurumSchema)