import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
import { OfficeBuildingIcon, ArrowRightIcon, SearchIcon, CheckCircleIcon } from "@heroicons/react/outline"
import { setKurum } from "../../../store/reducers/auth"
import Loading from "../../components/Loading"

// Türkçe-uyumlu Title Case: "CERRAHPAŞA VALİDE" -> "Cerrahpaşa Valide"
const titleCaseTr = (str) => (str || "")
  .toLocaleLowerCase('tr')
  .split(/\s+/)
  .map(w => w ? w.charAt(0).toLocaleUpperCase('tr') + w.slice(1) : w)
  .join(' ')
  .trim()

function Dashboard() {
  const dispatch = useDispatch()
  const [kurums, setKurums] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [busyId, setBusyId] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/admin/kurums")
        if (Array.isArray(res.data)) setKurums(res.data)
      } catch (_) { /* silent */ }
      setLoading(false)
    }
    load()
  }, [])

  // Kuruma tıkla → o kurumun kimliğiyle YENİ SEKMEDE panele gir (impersonation).
  // setKurum redux-persist ile localStorage'a yazılır; yeni sekme rehydrate edip oturumu devralır.
  const openKurum = (kurum) => {
    dispatch(setKurum(kurum))
    // persist'in localStorage'a yazması için kısa bekleme, sonra yeni sekme
    setTimeout(() => {
      window.open("/kurum/project", "_blank", "noopener")
    }, 300)
  }

  // Onayla / onayı kaldır
  const toggleVerify = async (kurum) => {
    setBusyId(kurum._id)
    try {
      const res = await axios.put(`/admin/kurums/${kurum._id}/verify`, { is_verify: !kurum.is_verify })
      if (res.data && typeof res.data.is_verify === "boolean") {
        setKurums(prev => prev.map(k => k._id === kurum._id ? { ...k, is_verify: res.data.is_verify } : k))
      }
    } catch (_) { /* sessiz */ }
    setBusyId("")
  }

  const filtered = kurums.filter(k => {
    const s = q.toLocaleLowerCase('tr')
    return (k.kurum_name || "").toLocaleLowerCase('tr').includes(s) || (k.email || "").toLowerCase().includes(s)
  })

  const verified = filtered.filter(k => k.is_verify)
  const pending = filtered.filter(k => !k.is_verify)

  const renderCard = (kurum) => (
    <div
      key={kurum._id}
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-md transition-all flex flex-col"
    >
      <button
        type="button"
        onClick={() => openKurum(kurum)}
        title="Yeni sekmede panele git"
        className="text-left p-5 pb-3"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <OfficeBuildingIcon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{titleCaseTr(kurum.kurum_name) || "İsimsiz kurum"}</h3>
              <p className="text-xs text-gray-400 truncate">{kurum.email}</p>
            </div>
          </div>
          <ArrowRightIcon className="w-5 h-5 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
      </button>

      <div className="px-5 py-3 mt-auto border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
        {kurum.is_verify ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
            <CheckCircleIcon className="w-3.5 h-3.5" /> Onaylı
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">Onay bekliyor</span>
        )}

        <button
          type="button"
          onClick={() => toggleVerify(kurum)}
          disabled={busyId === kurum._id}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg disabled:opacity-50 ${
            kurum.is_verify
              ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              : 'text-white bg-green-600 hover:bg-green-700'
          }`}
        >
          {busyId === kurum._id ? '...' : kurum.is_verify ? 'Onayı Kaldır' : 'Onayla'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Kurumlar</h1>
          <p className="text-sm text-gray-400">Bir kuruma tıklayarak yönetim paneline geçiş yapın.</p>
        </div>
        {!loading && (
          <span className="text-sm text-gray-400">{kurums.length} kurum</span>
        )}
      </div>

      {/* Arama */}
      <div className="relative mb-5">
        <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Kurum adı veya e-posta ile ara…"
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {loading ? (
        <div className="py-16"><Loading loading={loading} /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          {kurums.length === 0 ? "Sistemde kayıtlı kurum yok." : "Aramanızla eşleşen kurum bulunamadı."}
        </div>
      ) : (
        <>
          {/* Onaylı kurumlar */}
          {verified.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {verified.map(renderCard)}
            </div>
          )}

          {/* Onay bekleyenler */}
          {pending.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Onay Bekleyenler</h2>
                <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">{pending.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pending.map(renderCard)}
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Dashboard
