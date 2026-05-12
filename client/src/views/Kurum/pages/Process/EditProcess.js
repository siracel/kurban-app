import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import ProcessService from "../../../../services/ProcessService";
import MessageService from "../../../../services/MessageService";
import {useSelector} from "react-redux"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Prev from '../../../components/Prev'
import Title from '../../../components/Title'

function EditProcess() {
    const kurum = useSelector((state) => state.auth.kurum)
    let location = useLocation();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [message_template_holder, setMessageTemplateHolder] = useState('Yükleniyor..');
    const [errors, setError] = useState([]);
    const [selected, setSelected] = useState("")
    const [messageTemplates, setMessageTemplates] = useState([]);
    const [formData, setFormData] = useState({
      _id: '',
      process_title: ''
    })

    const { process_title, _id } = formData

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }

    const handleDropDown = (e) => {
      setSelected(e.target.value)
    }

    /* */
    useEffect(() => {
      const getMessageTemplate = async () => {
        console.log(kurum)
        const request = await MessageService.getAll({kurum_id: kurum._id});
        if(request.status === 200) {
          setMessageTemplates(request.data)
          request.data.length === 0 ? setMessageTemplateHolder('Henüz mesaj şablonu oluşturmadınız.') : setMessageTemplateHolder('Mesaj Şablonu Seç')
        }
      }
      getMessageTemplate()

      Object.keys(formData).forEach(key => {
        setFormData((prevState) => ({
          ...prevState,
          [key]: location.state[key]
        }))
      });

      // message_template: location.state.message.template (üstteki kod bu işlemi yapıyor select: location.message_template select/option için)
      setSelected(location.state.message_template)
    }, [])

    /* */
    const editProcess = async (e) => {
      e.preventDefault();

      //if(process_title === location.state.process_title) { navigate(-1) }
      
      if(process_title === '') { return; } 

      setLoading(true)

      const data = {
        _id,
        process_title,
        kurum_id: kurum._id,
        message_template: selected
      }
      const response = await ProcessService.update(data);
      console.log(response)

      if(response.status === 200 && !response.data.error) {
        navigate('/kurum/process')
      } else if(response.data.error) {
        console.log(response.data.error)
        setLoading(false)
        setError({process_title: response.data.error})
      }
    }

    return (
        <>
            <form onSubmit={editProcess}>
              <Card>              
                <div className="flex items-center justify-start">
                  <Prev />
                  <Title title={"İşlem Adımı Düzenle"}/>
                </div>

              
                <Input value={process_title} title="İşlem Başlığı" name="process_title" onChange={onChange} errors={errors} />

                <label className="block text-sm mb-4">
                  <span className={`text-gray-700 dark:text-gray-400`}>Mesaj Şablonu Bağla (İşlem Uygulandığında Otomatik Mesaj Gönderir):</span>
                  <select value={selected?selected:""} onChange={(e) => handleDropDown(e)} className="border-gray-400/30 rounded-[0.250rem] form-select appearance-none
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding bg-no-repeat
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
                      <option value="">{message_template_holder}</option>
                      {messageTemplates.map((message) => (
                        <option key={message._id} value={message._id}>{message.message_title}</option>
                      ))}
                  </select>
                </label>

                <Button type="submit" className={"mt-2 w-full"} disabled={loading}>
                  {loading ? 'Düzenleniyor' : 'Düzenle'}
                </Button>
              </Card>
            </form>
        </>
    );
  }
  
  export default EditProcess;