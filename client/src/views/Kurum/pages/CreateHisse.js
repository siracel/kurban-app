import { useEffect, useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useSelector } from "react-redux"
import { ChevronLeftIcon } from '@heroicons/react/outline'
import HisseService from '../../../services/HisseService';
import HissedarService from '../../../services/HissedarService';
import HissedarForm from '../components/HissedarForm'

function CreateHisse() {
  const location = useLocation()
  const navigate = useNavigate()
  const kurum = useSelector((state) => state.auth.kurum)
  const active_project_id = useSelector((state) => state.kurum.active_project_id)

  const [hissedars, setHissedars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState([]);

  useEffect(() => {
    const getHissedars = async () => {
      const request = await HissedarService.getAll({ kurum_id: kurum._id });
      if (request.status === 200) setHissedars(request.data)
    }
    getHissedars()
  }, [])

  const submit = async (formData) => {
    setError([])
    setLoading(true)
    try {
      const response = await HisseService.create({
        kurum_id: kurum._id,
        project_id: active_project_id,
        kurban_id: location.state?.kurban_id,
        ...formData,
      });
      if (response.status === 200 && !response.data.error) {
        navigate(`/kurum/dashboard/${active_project_id}`)
      } else {
        setLoading(false)
        setError({ key: response.data?.error || "Kayıt eklenemedi." })
      }
    } catch (err) {
      setLoading(false)
      const status = err?.response?.status
      setError({ key: status === 401 ? "Oturumunuz geçersiz. Lütfen çıkış yapıp tekrar giriş yapın." : "Bir hata oluştu. Lütfen tekrar deneyin." })
    }
  }

  if (!location.state) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Bu sayfaya kurban listesindeki <strong>Hissedar Ekle+</strong> butonundan ulaşın.</p>
        <NavLink to={`/kurum/dashboard/${active_project_id}`} className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700">
          <ChevronLeftIcon className="w-4 h-4" /> Listeye dön
        </NavLink>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-6">
      <div className="flex items-center gap-2 mb-5">
        <button type="button" onClick={() => navigate(-1)} aria-label="Geri" className="p-1.5 -ml-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Hissedar Ekle</h1>
        <span className="ml-1 px-2.5 py-0.5 text-sm font-semibold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
          {location.state.kurban_no}. Kurban · {location.state.hissedar_count + 1}/7
        </span>
      </div>

      <HissedarForm hissedars={hissedars} loading={loading} errors={errors} onSubmit={submit} />
    </div>
  );
}

export default CreateHisse;
