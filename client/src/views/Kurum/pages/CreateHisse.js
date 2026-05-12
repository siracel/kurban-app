import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import {useSelector} from "react-redux"
import axios from 'axios';
import HisseService from '../../../services/HisseService';
import Input from "../../components/Input"
import Button from "../../components/Button"
import Card from "../../components/Card"
import Prev from "../../components/Prev"
import Title from "../../components/Title"
import Textarea from "../../components/Textarea"
import HissedarService from '../../../services/HissedarService';

function CreateHisse() {
  const location = useLocation()
  //const { location_state } = location.state

  const isKurumAuth = useSelector((state) => state.auth.isKurum)
  const kurum = useSelector((state) => state.auth.kurum)
  const active_project_id = useSelector((state) => state.kurum.active_project_id)
  if(isKurumAuth) axios.defaults.headers.common['Authorization'] = `Bearer ${kurum.token}`;
  
  const [hissedars, setHissedars] = useState([]);

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState([]);

  useEffect(() => {
    const getHissedars = async () => {
      setLoading(true)
      const request = await HissedarService.getAll({kurum_id: kurum._id});
      if(request.status === 200) {
        console.log(request.data);
          setLoading(false)
          setHissedars(request.data)
      }
    }
    getHissedars()

    const handleClickOutside = (e) => {
      if (!e.target.closest('#hissedar-autocomplete')) {
        setShowList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])

  // Hissedar arama
  const [suggestions, setSuggestions] = useState([]);   // Görünen liste
  const [showList, setShowList]   = useState(false);    // Liste açık / kapalı

  // <input> change’i sadece hissedar adı için yakalıyoruz
  const onChangeHissedarName = (e) => {
    const value = e.target.value;

    // formData’yı güncelle
    setFormData((prev) => ({ ...prev, hissedar_full_name: value }));

    const normalized = value.toLocaleLowerCase('tr');

    //  Filtrele ve göster
    const filtered = hissedars.filter((h) =>
      h.hissedar_full_name.toLocaleLowerCase('tr').includes(normalized)
    );
    setSuggestions(filtered);
    setShowList(true);
  };

  // Bir öneriye tıklandığında hem adı hem GSM’i doldur
  const selectSuggestion = (h) => {
    setFormData((prev) => ({
      ...prev,
      hissedar_full_name: h.hissedar_full_name,
      hissedar_gsm: h.hissedar_gsm,
    }));
    setShowList(false);
  };

  // Input’a ilk tıklamada “hepsini” göster
  const onFocusHissedarName = () => {
    setSuggestions(hissedars);
    setShowList(true);
  };


  const [formData, setFormData] = useState({
      hissedar_full_name: "",
      hissedar_address: "",
      hissedar_gsm: '',
      hissedar_note: "",
      referans_full_name: "",
      referans_gsm: '',
      kapora: 0,
      is_vekalet: false
    })

    const { hissedar_full_name, hissedar_address, hissedar_gsm, referans_full_name, referans_gsm, kapora, hissedar_note, is_vekalet} = formData

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value, // verilen propslardan name'e göre value'değerini match edip eşleştiriyor
      }))
    }

    /* */
    useEffect(() => {
      console.log(location)
    }, [])
    /* */
    const createKurban = async (e) => {
      e.preventDefault();
      
      setLoading(true)
      const data = {
        kurum_id: kurum._id,
        project_id: active_project_id,
        kurban_id: location.state.kurban_id,
        hissedar_full_name,
        hissedar_gsm,
        hissedar_address,
        kapora,
        referans_full_name,
        referans_gsm,
        is_vekalet,
        hissedar_note
      }
      
      const response = await HisseService.create(data);

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
                <Title title={`${location.state.kurban_no}. Kurban — Hisse Kaydı (${location.state.hissedar_count+1}/7)`} />
              </div>

              {/* <Input value={hissedar_full_name} title="*Hissedar tam ismi" name="hissedar_full_name" onChange={onChange} errors={errors} /> */}

              <div id="hissedar-autocomplete" className="relative">
                <Input
                  value={hissedar_full_name}
                  title="*Hissedar tam ismi"
                  name="hissedar_full_name"
                  onChange={onChangeHissedarName}
                  onFocus={onFocusHissedarName}
                  autoComplete="off"
                  errors={errors}
                />

                {/* Liste */}
                {showList && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border shadow max-h-60 overflow-auto">
                    {suggestions.map((h) => (
                      <li
                        key={h._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectSuggestion(h)}
                      >
                        <span className="font-medium">{h.hissedar_full_name}</span>
                        <span className="text-xs text-gray-500 ml-2">{h.hissedar_gsm}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Input type="number" min={0} value={hissedar_gsm} title="*Hissedar GSM" name="hissedar_gsm" onChange={onChange} errors={errors} />

              <hr className='mb-4 mt-6' />
              <Input value={kapora} title="Kapora" name="kapora" onChange={onChange} errors={errors} />
              <Textarea value={hissedar_address} title="Hissedar adresi" name="hissedar_address" onChange={onChange} errors={errors} />
              <Input value={referans_full_name} title="Referans tam ismi" name="referans_full_name" onChange={onChange} errors={errors} />
              <Input type="number" min={0} value={referans_gsm} title="Referans GSM" name="referans_gsm" onChange={onChange} errors={errors} />
              <Textarea value={hissedar_note} title="Hissedar not" name="hissedar_note" onChange={onChange} errors={errors} />
              <p className="mt-2">
                <input
                  type="checkbox"
                  id="vekalet"
                  name="is_vekalet"
                  checked={is_vekalet}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_vekalet: e.target.checked }))}
                />
                <label htmlFor='vekalet' className="ml-2 cursor-pointer select-none"> Vekaleti alınmıştır</label>
              </p>

              <Button className={"mt-2 w-full"} disabled={loading}>
                {loading ? 'Oluşturuluyor...' : 'Oluştur'}
              </Button>
            </Card>    
          </form>
      </>
    );
  }
  
  export default CreateHisse;