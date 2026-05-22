import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import KurbanService from "../../../../services/BKurbanService";
import Loading from "../../../components/Loading";
import "../../../../assets/css/KurbanInfo.css"

import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import ProcessSteps from "./ProcessSteps";

/**
 * Resolves an embed value into a usable iframe src.
 * Accepts: a full <iframe ... src="..."> embed code (any provider),
 * a bare URL, or a YouTube video id (backwards compatibility).
 */
function resolveEmbedSrc(input) {
  if (!input) return ""
  const value = String(input).trim()

  const iframeMatch = value.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)
  if (iframeMatch) return iframeMatch[1]

  if (/^https?:\/\//i.test(value)) return value

  return `https://www.youtube.com/embed/${value}`
}

// 16:9 responsive iframe wrapper
function VideoFrame({ src, title }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ paddingTop: "56.25%" }}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default function KurbanInfo() {
  let { kurban_code } = useParams();

  const [loading, setLoading] = useState(true)
  const [tarih, setTarih] = useState('')
  const [kurban, setKurban] = useState({})
  const [process, setProcess] = useState([])

  const getKurban = async () => {
    const kurbanInfo = await KurbanService.getKurbanInfo(kurban_code)
    if (kurbanInfo?.data?.[0]) {
      getKurumProcess(kurbanInfo.data[0].kurum_id)
      setKurban(kurbanInfo.data[0])
    }
    setLoading(false)
  }

  const getKurumProcess = async (kurum_id) => {
    const kurumProcess = await KurbanService.getKurumProcess(kurum_id)
    setProcess(kurumProcess.data)
  }

  const setTarihThing = () => {
    const t = new Date();
    const gunler = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const day = t.getDate().toString().padStart(2, "0");
    const month = (t.getMonth() + 1).toString().padStart(2, "0");
    setTarih(`${day}.${month}.${t.getFullYear()}, ${gunler[t.getDay()]}`)
  }

  useEffect(() => {
    setTarihThing()
    getKurban()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading loading={loading} />
      </div>
    )
  }

  const hasVideo = kurban?.youtube_embed || kurban?.vidyome_embed || kurban?.video_path

  return (
    <div className="kurban-info-page min-h-screen bg-slate-50 pb-10">
      {/* Hero */}
      <header className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-center px-5 pt-10 pb-20 rounded-b-[2.5rem] shadow-sm">
        <p className="text-xs font-medium tracking-widest uppercase text-white/80">Kurban Takip</p>
        <h1 className="text-2xl font-bold mt-2 leading-snug">Kurban Bayramınız<br />Mübarek Olsun</h1>
        <p className="text-sm text-white/80 mt-3 max-w-xs mx-auto">
          Kurbanınızın güncel durumunu bu sayfadan takip edebilirsiniz.
        </p>
      </header>

      <main className="max-w-md mx-auto px-4 -mt-12 space-y-4">
        {/* Kurban No + Durum */}
        <section className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-xs uppercase tracking-wider text-gray-400">Kurban No</p>
          <p className="text-5xl font-bold text-teal-600 mt-1 leading-none">{kurban?.kurban_no}</p>
          {kurban?.process?.process_title && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              {kurban.process.process_title}
            </div>
          )}
        </section>

        {/* Hisse Grubu + Fiyat */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-xs text-gray-400">Hisse Grubu</p>
            <p className="text-base font-semibold text-gray-800 mt-1 break-words">{kurban?.kurban_hisse_group || "—"}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-xs text-gray-400">Net Hisse Fiyatı</p>
            <p className="text-base font-semibold text-gray-800 mt-1">{kurban?.net_hisse_fiyat ? `${kurban.net_hisse_fiyat} ₺` : "—"}</p>
          </div>
        </section>

        {/* Süreç */}
        <section className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-800 mb-5">Kurbanım Şu Anda Ne Durumda?</h2>
          <ProcessSteps process={process} currentID={kurban?.process?._id} />
        </section>

        {/* Hissedarlar */}
        {kurban?.hisse?.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Hissedarlar</h2>
            <ul className="divide-y divide-gray-100">
              {kurban.hisse.map(hissedar => (
                <li key={hissedar._id} className="flex items-center gap-3 py-2.5">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-semibold">
                    {(hissedar.hissedar_full_name || "?").charAt(0).toUpperCase()}
                  </span>
                  <span className="text-gray-700">{hissedar.hissedar_full_name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Fotoğraf */}
        {kurban?.kurban_image && (
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Kurbanınız</h2>
            <img src={kurban.kurban_image} alt="kurban" className="w-full h-auto rounded-xl" />
          </section>
        )}

        {/* Video */}
        {hasVideo ? (
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Bu Kurbanın Videosu</h2>
            {kurban?.youtube_embed && <VideoFrame src={resolveEmbedSrc(kurban.youtube_embed)} title="Kurban videosu" />}
            {kurban?.vidyome_embed && <VideoFrame src={kurban.vidyome_embed} title="Kurban videosu" />}
            {kurban?.video_path && (
              <Video autoPlay className="w-full rounded-xl overflow-hidden"
                controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}>
                <source src={kurban.video_path} type="video/mp4" />
              </Video>
            )}
          </section>
        ) : (
          <section className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <p className="text-sm text-gray-400">
              Kurbanınız kesildikten sonra kesim videosunu buradan izleyebilirsiniz.
            </p>
          </section>
        )}

        <p className="text-center text-xs text-gray-400 pt-2">{tarih}</p>
      </main>
    </div>
  )
}
