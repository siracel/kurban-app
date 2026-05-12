import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import HisseGroupService from "../../../../services/HisseGroupService";
import {useSelector} from "react-redux"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Prev from '../../../components/Prev'
import Title from '../../../components/Title'

function CreateProcess() {
    const kurum = useSelector((state) => state.auth.kurum)
    const active_project_id = useSelector((state) => state.kurum.active_project_id)

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState([]);
    const [formData, setFormData] = useState({
      hisse_group_title: ''
    })

    const { hisse_group_title } = formData

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }

    /* */
    const createProcess = async (e) => {
      e.preventDefault();
      setLoading(true)

      const data = {
        hisse_group_title,
        kurum_id: kurum._id,
        project_id: active_project_id
      }
      const response = await HisseGroupService.create(data);
      console.log(response)

      if(response.status === 200 && !response.data.error) {
        navigate(-1)
      } else if(response.data.error) {
        setLoading(false)
        setError({hisse_group_title: response.data.error})
      }
    }

    return (
        <>
            <form onSubmit={createProcess}>
              <Card>              
                <div className="flex items-center justify-start">
                  <Prev />
                  <Title title={"Hisse Grubu Oluştur"}/>
                </div>

              
                <Input value={hisse_group_title} title="Hisse grubu" pholder={"Hisse grubu giriniz (örn: 5.000 - 6.000)"} name="hisse_group_title" onChange={onChange} errors={errors} required autoFocus />
                <Button className={"mt-2 w-full"} disabled={loading}>
                  {loading ? 'Oluşturuluyor...' : 'Oluştur'}
                </Button>
              </Card>
            </form>
        </>
    );
  }
  
  export default CreateProcess;