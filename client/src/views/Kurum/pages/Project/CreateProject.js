import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import ProjectService from "../../../../services/ProjectService"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Prev from '../../../components/Prev'

function CreateProject() {

    const kurum = useSelector((state) => state.auth.kurum)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errors, setError] = useState([])
    const [formData, setFormData] = useState({ project_name: '' })
    const { project_name } = formData

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }))
    }

    const createProject = async (e) => {
      e.preventDefault()
      setLoading(true)
      const data = {
        project_name,
        kurum_id: kurum._id,
        uniq_project_code: 'xyzt'
      }

      try {
        const response = await ProjectService.create(data)
        if (response.status === 200 && !response.data.error) {
          navigate('/kurum/project')
        } else if (response.data.error) {
          setLoading(false)
          setError({ project_name: response.data.error })
        }
      } catch (err) {
        setLoading(false)
        setError({ project_name: 'Proje oluşturulurken bir hata oluştu. Tekrar deneyin.' })
      }
    }

    return (
      <form onSubmit={createProject}>
        <h1 className="text-center text-xl mt-4 font-semibold">Proje Oluştur</h1>

        <div className="flex justify-start">
          <Prev />
        </div>

        <Card>
          <Input value={project_name} title="Proje Başlığı" name="project_name" onChange={onChange} errors={errors} required autoFocus />
          <Button className={"mt-2 w-full"} disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Oluştur'}
          </Button>
        </Card>
      </form>
    );
  }

  export default CreateProject;
