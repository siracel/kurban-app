import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Input from "../../../../components/Input"
import Button from "../../../../components/Button"
import Card from "../../../../components/Card"
import Noty from "../../../../molecules/noty"
import KurumService from '../../../../../services/KurumService'
import { setKurum } from "../../../../../store/reducers/auth"

export default function AccountSettings() {
  const kurum = useSelector((state) => state.auth.kurum)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [errors, setError] = useState([])
  const [noty, setNoty] = useState({ isOpen: false })
  const [form, setForm] = useState({
    kurum_name: kurum.kurum_name || "",
    full_name: kurum.full_name || "",
    email: kurum.email || "",
    username: "",
    gsm: "",
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await KurumService.get(kurum._id)
        if (res.status === 200 && res.data && !res.data.error) {
          const d = res.data
          setForm({
            kurum_name: d.kurum_name || "",
            full_name: d.full_name || "",
            email: d.email || "",
            username: d.username || "",
            gsm: d.gsm || "",
          })
        }
      } catch (_) { /* mevcut redux verisiyle devam */ }
    }
    load()
  }, [])

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setError([])
    setLoading(true)
    try {
      const res = await KurumService.update({ _id: kurum._id, ...form })
      if (res.status === 200 && !res.data.error) {
        // Header/panelde görünen bilgileri de güncelle (token korunur)
        dispatch(setKurum({ ...kurum, kurum_name: form.kurum_name, full_name: form.full_name, email: form.email }))
        setNoty({ isOpen: true, title: "Kaydedildi", message: "Hesap bilgileri güncellendi." })
        setTimeout(() => setNoty((p) => ({ ...p, isOpen: false })), 2500)
      } else {
        setError({ key: res.data.error || "Bilgiler güncellenemedi." })
      }
    } catch (_) {
      setError({ key: "Bir hata oluştu. Lütfen tekrar deneyin." })
    }
    setLoading(false)
  }

  return (
    <>
      <Noty isOpen={noty.isOpen} title={noty.title} message={noty.message} />

      <form onSubmit={save}>
        <Card className="!p-6">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">Hesap Bilgileri</h3>
          <p className="text-sm text-gray-400 mb-5">Kurumunuzun temel kimlik bilgileri.</p>

          {errors.key && (
            <div className="mb-4 p-3 rounded-lg bg-pink-50 border border-pink-200 text-sm text-pink-700">{errors.key}</div>
          )}

          <Input value={form.kurum_name} title="Kurum Adı" name="kurum_name" onChange={onChange} errors={errors} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Input value={form.full_name} title="Yetkili Ad Soyad" name="full_name" onChange={onChange} errors={errors} />
            <Input value={form.gsm} title="GSM" name="gsm" onChange={onChange} errors={errors} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Input type="email" value={form.email} title="E-posta" name="email" onChange={onChange} errors={errors} />
            <Input value={form.username} title="Kullanıcı Adı" name="username" onChange={onChange} errors={errors} />
          </div>

          <Button className="mt-2 w-full sm:w-auto" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </Card>
      </form>
    </>
  )
}
