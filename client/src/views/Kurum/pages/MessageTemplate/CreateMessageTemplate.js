import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {useSelector} from "react-redux"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Prev from '../../../components/Prev'
import Title from '../../../components/Title'
import MessageService from '../../../../services/MessageService';
import Textarea from '../../../components/Textarea';

function CreateProcess() {
    const kurum = useSelector((state) => state.auth.kurum)

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState([]);
    const [formData, setFormData] = useState({
      message_title: '',
      message_content: ''
    })

    const { message_title, message_content } = formData

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }

    /* */
    const createMessageTemplate = async (e) => {
      e.preventDefault();
      setLoading(true)

      const data = {
        message_title,
        message_content,
        kurum_id: kurum._id,
      }
      const response = await MessageService.create(data);
      console.log(response)

      if(response.status === 200 && !response.data.error) {
        navigate(-1)
      } else if(response.data.error) {
        console.log(response.data.error)
        setLoading(false)
        setError({message_title: response.data.error})
      }
    }

    return (
        <>
            <form onSubmit={createMessageTemplate}>
              <Card>              
                <div className="flex items-center justify-start">
                  <Prev />
                  <Title title={"Mesaj Şablonu Oluştur"}/>
                </div>

              
                <Input value={message_title} title="Mesaj Başlığı" name="message_title" onChange={onChange} errors={errors} required autoFocus />
                <Textarea value={message_content} title="Mesaj İçeriği" name="message_content" onChange={onChange} errors={errors} required rows={5} />
                <Button className={"mt-2 w-full"} disabled={loading}>
                  {loading ? 'Oluşturuluyor..' : 'Oluştur'}
                </Button>
              </Card>
            </form>
        </>
    );
  }
  
  export default CreateProcess;