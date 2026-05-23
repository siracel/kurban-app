import SMSInterface from "../SMSInterface.js"
import fetch from 'cross-fetch'
import normalizeGSM from '../../../utils/normalizeGSM.js'

// XML özel karakterlerini kaçır
const xmlEscape = (s) => String(s || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const ERROR_CODES = {
  '20': 'Post edilen XML eksik veya hatalı',
  '21': 'Kullanılan originatöre (gönderici adı) sahip değilsiniz',
  '22': 'Kontörünüz yetersiz — Mutlucell hesabına kontör yükleyin',
  '23': 'Kullanıcı adı ya da parola hatalı',
  '24': 'Şu anda size ait başka bir işlem aktif',
  '25': 'SMSC durdu — 1-2 dk sonra tekrar deneyin',
  '30': 'Hesap aktivasyonu sağlanmamış — Mutlucell\'den hesap aktivasyonunu tamamlatın (genelde kontör yükleme/onay gerektirir)',
  '34': 'Hesabınız API erişimine kapalı',
}

/**
 * Mutlucell SMS — https://smsgw.mutlucell.com/smsgw-ws/sndblkex
 * user_name = ka, password = pwd (parola ya da ApiKey), origin = org (gönderici adı)
 */
class Mutlucell extends SMSInterface {
  constructor(user_name, password, origin) {
    super(user_name, password, origin)
    this.user_name = user_name
    this.password = password
    this.origin = origin
  }

  async send(gsm, message) {
    const num = normalizeGSM(gsm) // 90XXXXXXXXXX
    if (!num) {
      console.error('Mutlucell: geçersiz numara ->', gsm)
      return false
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<smspack ka="${xmlEscape(this.user_name)}" pwd="${xmlEscape(this.password)}" org="${xmlEscape(this.origin)}"><mesaj><metin>${xmlEscape(message)}</metin><nums>${num}</nums></mesaj></smspack>`

    try {
      const res = await fetch('https://smsgw.mutlucell.com/smsgw-ws/sndblkex', {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml; charset=UTF-8' },
        body: xml,
      })
      const text = (await res.text()).trim()

      // Başarı: yanıt "$" ile başlayan bir mesaj ID döner. Aksi halde hata kodu.
      if (text.startsWith('$')) {
        console.log('Mutlucell gönderildi, id:', text)
        return true
      }

      const code = text.split(/\s+/)[0]
      console.error(`Mutlucell hata [${code}]: ${ERROR_CODES[code] || 'Bilinmeyen hata'} -> ${text}`)
      return false
    } catch (err) {
      console.error('Mutlucell istek hatası:', err)
      return false
    }
  }
}

export default Mutlucell
