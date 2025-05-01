import { useEffect, useState } from 'react';
import { useSelector } from "react-redux"
import Input from "../../../../components/Input"
import Button from "../../../../components/Button"
import Card from "../../../../components/Card"
import KurumService from '../../../../../services/KurumService';

// sayfa yüklenince ilgili kurum whatsapp bilgileri çekilecek ve inputa set edilecek
export default function GeneralSettings(props) {
    const kurum = useSelector((state) => state.auth.kurum)
    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState([]);

    useEffect(() => {
        const getKurum = async () => {
            const response = await KurumService.get(kurum._id);
            if(response.status === 200 && !response.data.error) {
                setFormData({
                    whatsapp_appkey: response.data.whatsapp_appkey,
                    whatsapp_authkey: response.data.whatsapp_authkey
                })
            } else if(response.data.error) {
                console.log(response.data.error)
            }
        }
        getKurum()
    }, [])

    const [formData, setFormData] = useState({
        whatsapp_appkey: '',
        whatsapp_authkey: ''
    })

    const { whatsapp_appkey, whatsapp_authkey } = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
        }))
    }

    const updateKurumWp = async (e) => {
        e.preventDefault();
        let isError = false
        
        Object.keys(formData).forEach(element => {
            if(formData[element] === "") {
            isError = true
            setError({[element]: "Değer boş geçilemez"})
            }
        });

        if(isError) {return}

        setLoading(true)

        const data = { _id: kurum._id, ...formData }
        
        const response = await KurumService.update(data);
        
        setLoading(false)

        if(response.status === 200 && !response.data.error) {
            console.log(response.data)
        } else if(response.data.error) {
            console.log(response.data.error)
        }
    }

    return (
            <>
                <section className={`card p-4 ${props.className} `}>
                
                <form onSubmit={updateKurumWp}>
                  <Card>              
                    <div className="flex flex-col mb-4">
                      <h4 className={`text-xl font-semibold`}>Whatsapp Ayarları</h4>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        <a href="https://wpsenderpro.com/register/2" target="_blank" className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400" rel="noreferrer">wpsenderpro.com</a>
                        adresinden My Apps kısmından Appkey ve Authkey alabilirsiniz.
                      </span>
                    </div>
    
                    <Input value={whatsapp_appkey} title="Whatsapp APPKEY" pholder="Whatsapp APPKEY" name="whatsapp_appkey" onChange={onChange} errors={errors} />
                    <Input value={whatsapp_authkey} title="Whatsapp AUTHKEY" pholder="Whatsapp AUTHKEY" name="whatsapp_authkey" onChange={onChange} errors={errors} />
                    
                    <Button className={"mt-2 w-full"} disabled={loading}>
                      {loading ? 'Kayıt Yapılıyor...' : 'Kaydet'}
                    </Button>
                  </Card>
                </form>

                </section>
            </>
        );
}