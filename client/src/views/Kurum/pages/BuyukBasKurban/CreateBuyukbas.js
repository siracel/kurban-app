import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import {useSelector} from "react-redux"
import axios from 'axios';
import BKurbanService from '../../../../services/BKurbanService';
import HisseGroupService from '../../../../services/HisseGroupService';
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Prev from "../../../components/Prev"
import Title from "../../../components/Title"
import Textarea from "../../../components/Textarea"
import {randomString} from '../../../../utils/helper'

function CreateBuyukbas() {
  
  const isKurumAuth = useSelector((state) => state.auth.isKurum)
  const kurum = useSelector((state) => state.auth.kurum)
  const active_project_id = useSelector((state) => state.kurum.active_project_id)
  if(isKurumAuth) axios.defaults.headers.common['Authorization'] = `Bearer ${kurum.token}`;
  
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [hisseGroupLoader, setHisseGroupLoader] = useState("Hisse grupları yükleniyor..");
  const [selected, setSelected] = useState("")
  const [hisse_groups, setHisseGroup] = useState([]);
  const [errors, setError] = useState([]);
  const [formData, setFormData] = useState({
      kurban_kupe_no: '',
      net_hisse_fiyat: '',
      kurban_weight: '',
      kurban_note: ''
    })

    const { kurban_kupe_no, net_hisse_fiyat, kurban_weight, kurban_note } = formData

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value, // verilen propslardan name'e göre value'değerini match edip eşleştiriyor
      }))
    }

    const handleDropDown = (e) => {
      setSelected(e.target.value)
    }

    /* */
    useEffect(() => {
      const getHisseGroups = async () => {
        console.log(kurum)
        const request = await HisseGroupService.getByProject({project_id: active_project_id});
        if(request.status === 200) {
          const hisseGroupLoaderMessage = request.data.length > 0 ? "Hisse grubu seçiniz" : "Listelenecek hisse grubu bulunamadı"
          setHisseGroupLoader(hisseGroupLoaderMessage)
          setHisseGroup(request.data)
        }
      }
      getHisseGroups()
    }, [])
    /* */
    const createKurban = async (e) => {
      e.preventDefault();
      
      setLoading(true)
      const data = {
        kurum_id: kurum._id,
        project_id: active_project_id,
        kurban_kupe_no,
        kurban_hisse_group: selected,
        net_hisse_fiyat,
        uniq_kurban_code: randomString(),
        kurban_image: '',
        kurban_weight,
        kurban_note,
      }
      const response = await BKurbanService.create(data);
      
      console.log(response)

      if(response.status === 200 && !response.data.error) {
        navigate(`/kurum/dashboard/${active_project_id}`)
      } else if(response.data.error) {
        console.log(response.data.error)
        setLoading(false)
        setError({key: response.data.error}) // input name key olarak verilecek
      }
    }

    return (
        <>
          <form onSubmit={createKurban}>
            <Card>
              <div className="flex items-center">
                <Prev />
                <Title title={"Kurban Oluştur"} />
              </div>
              
            <label htmlFor="kurban_hisse_group" className="block text-sm mb-4">
                <span className="text-gray-700 dark:text-gray-400">
                  Hisse Grubu
                  <span className="text-pink-600 ml-0.5" aria-hidden="true">*</span>:
                </span>

                  <select
                    id="kurban_hisse_group"
                    value={selected}
                    onChange={(e) => handleDropDown(e)}
                    required
                    aria-required="true"
                    className="border-gray-400/30 rounded-[0.250rem] form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
                      <option value="">{hisseGroupLoader}</option>
                      {hisse_groups.map((hisse_group) => (
                        <option key={hisse_group._id} value={hisse_group.hisse_group_title}>{hisse_group.hisse_group_title}</option>
                      ))}
                  </select>
            </label>

              <Input value={kurban_kupe_no} title="Küpe No" name="kurban_kupe_no" onChange={onChange} errors={errors} required autoFocus />
              <Input type={"number"} value={net_hisse_fiyat} title="Net Hisse Fiyatı" name="net_hisse_fiyat" onChange={onChange} errors={errors} required />
              <Input type={"number"} value={kurban_weight} title="Kurban KG" name="kurban_weight" onChange={onChange} errors={errors} />
              <Textarea value={kurban_note} title="Kurban Not" name="kurban_note" onChange={onChange} errors={errors} />
              <Button className={"mt-2 w-full"} disabled={loading}>
                {loading ? 'Oluşturuluyor...' : 'Oluştur'}
              </Button>
            </Card>    
          </form>
      </>
    );
  }
  
  export default CreateBuyukbas;