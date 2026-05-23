import { useState, useEffect } from 'react';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom'
import Input from "../../../../components/Input"
import Button from "../../../../components/Button"
import Card from "../../../../components/Card"
import Title from '../../../../components/Title'
import SMSService from '../../../../../services/SMSService';

function EditSMSAPI() {
    const navigate = useNavigate()
    const location = useLocation()
    const item = location.state

    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState([]);
    const [formData, setFormData] = useState({
      message_service_origin: '',
      message_service_username: '',
      message_service_password: '',
    })

    const { message_service_origin,
      message_service_username,
      message_service_password } = formData

    const goBack = () => navigate({
      pathname: "/kurum/setting",
      search: `?${createSearchParams({ tab: "tab3" })}`
    })

    useEffect(() => {
      // Düzenlenecek kayıt state ile gelmezse listeye geri dön
      if (!item || !item._id) {
        goBack()
        return
      }
      setFormData({
        message_service_origin: item.message_service_origin || '',
        message_service_username: item.message_service_username || '',
        message_service_password: item.message_service_password || '',
      })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }

    const editProcess = async (e) => {
      e.preventDefault();

      let isError = false
      Object.keys(formData).forEach(element => {
        if (formData[element] === "") {
          isError = true
          setError({ [element]: "Değer boş geçilemez" })
        }
      });
      if (isError) { return }

      setLoading(true)

      const data = {
        _id: item._id,
        message_service_origin,
        message_service_username,
        message_service_password,
      }

      const response = await SMSService.update(data);

      if (response.status === 200 && !response.data?.error) {
        goBack()
      } else {
        setLoading(false)
        setError({ message_service_origin: response.data?.error || 'Güncelleme başarısız' })
      }
    }

    const firmName = item?.message_api?.message_service_title || item?.message_api_title || ''

    return (
        <>
            <form onSubmit={editProcess}>
              <Card>
                <div className="flex items-center justify-start">
                  <div className="flex justify-start">
                    <span onClick={goBack}
                      className="cursor-pointer my-4 bg-white p-1 rounded-sm text-center dark:bg-gray-800/90 dark:text-gray-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                  </div>
                  <Title title={"SMS API Düzenle"} />
                </div>

                <label className="block text-sm mb-4">
                  <span className="text-gray-700 dark:text-gray-400">SMS API Firması:</span>
                  <input
                    type="text"
                    value={firmName}
                    disabled
                    className="border-gray-400/30 rounded-[0.250rem] block w-full px-3 py-1.5 text-base font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                  />
                </label>

                <Input value={message_service_username} title="SMS API Hesap kullanıcı adı" pholder="SMS API Hesap kullanıcı adı" name="message_service_username" onChange={onChange} errors={errors} />
                <Input value={message_service_password} title="SMS API Hesap kullanıcı şifresi (ya da ApiKey)" pholder="SMS API Hesap kullanıcı şifresi" name="message_service_password" onChange={onChange} errors={errors} />
                <Input value={message_service_origin} title="SMS API Mesaj Başlığınız" pholder="SMS API Origin/Originator/Başlık" name="message_service_origin" onChange={onChange} errors={errors} />

                <Button className={"mt-2 w-full"} disabled={loading}>
                  {loading ? 'Kaydediliyor..' : 'Kaydet'}
                </Button>
              </Card>
            </form>
        </>
    );
  }

export default EditSMSAPI;
