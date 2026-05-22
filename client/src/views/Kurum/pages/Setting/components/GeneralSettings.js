import { useEffect, useState } from 'react';
import { useSelector } from "react-redux"
import Input from "../../../../components/Input"
import Button from "../../../../components/Button"
import Card from "../../../../components/Card"
import Noty from "../../../../molecules/noty"
import KurumService from '../../../../../services/KurumService';

export default function GeneralSettings() {
    const kurum = useSelector((state) => state.auth.kurum)
    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState([]);
    const [noty, setNoty] = useState({ isOpen: false })

    const [formData, setFormData] = useState({
        whatsapp_appkey: '',
        whatsapp_authkey: ''
    })
    const { whatsapp_appkey, whatsapp_authkey } = formData

    useEffect(() => {
        const getKurum = async () => {
            try {
                const response = await KurumService.get(kurum._id);
                if (response.status === 200 && !response.data.error) {
                    setFormData({
                        whatsapp_appkey: response.data.whatsapp_appkey || '',
                        whatsapp_authkey: response.data.whatsapp_authkey || ''
                    })
                }
            } catch (_) { /* sessiz */ }
        }
        getKurum()
    }, [])

    const onChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const updateKurumWp = async (e) => {
        e.preventDefault();
        setError([])
        setLoading(true)
        try {
            const response = await KurumService.update({ _id: kurum._id, ...formData });
            if (response.status === 200 && !response.data.error) {
                setNoty({ isOpen: true, title: "Kaydedildi", message: "WhatsApp ayarları güncellendi." })
                setTimeout(() => setNoty((p) => ({ ...p, isOpen: false })), 2500)
            } else {
                setError({ key: response.data.error || "Ayarlar güncellenemedi." })
            }
        } catch (_) {
            setError({ key: "Bir hata oluştu. Lütfen tekrar deneyin." })
        }
        setLoading(false)
    }

    return (
        <>
            <Noty isOpen={noty.isOpen} title={noty.title} message={noty.message} />

            <form onSubmit={updateKurumWp}>
                <Card className="!p-6">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">WhatsApp Ayarları</h3>
                    <p className="text-sm text-gray-400 mb-5">
                        <a href="https://wpsenderpro.com/register/2" target="_blank" rel="noreferrer" className="text-purple-600 hover:text-purple-700">wpsenderpro.com</a>
                        {" "}adresinde <strong>My Apps</strong> bölümünden Appkey ve Authkey alabilirsiniz.
                    </p>

                    {errors.key && (
                        <div className="mb-4 p-3 rounded-lg bg-pink-50 border border-pink-200 text-sm text-pink-700">{errors.key}</div>
                    )}

                    <Input value={whatsapp_appkey} title="WhatsApp APPKEY" pholder="APPKEY" name="whatsapp_appkey" onChange={onChange} errors={errors} />
                    <Input value={whatsapp_authkey} title="WhatsApp AUTHKEY" pholder="AUTHKEY" name="whatsapp_authkey" onChange={onChange} errors={errors} />

                    <Button className="mt-2 w-full sm:w-auto" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </Card>
            </form>
        </>
    );
}
