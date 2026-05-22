import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {useSelector} from "react-redux"
//import axios from 'axios';
import BKurbanService from '../../../../services/BKurbanService';
import HisseGroupService from '../../../../services/HisseGroupService';
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import Prev from "../../../components/Prev"
import Title from "../../../components/Title"
import Textarea from "../../../components/Textarea"
import Noty from '../../../molecules/noty'
import { PhotographIcon, FilmIcon, LinkIcon, ClipboardCopyIcon, CheckIcon, InformationCircleIcon } from '@heroicons/react/outline'

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-4">
      <div className="flex items-start gap-3 mb-4">
        {Icon && (
          <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </span>
        )}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function EditBuyukbas() {

    let location = useLocation();
    const { id: kurbanId } = useParams();
    //const isKurumAuth = useSelector((state) => state.auth.isKurum)
    //const kurum = useSelector((state) => state.auth.kurum)
    const active_project_id = useSelector((state) => state.kurum.active_project_id)
    //if(isKurumAuth) axios.defaults.headers.common['Authorization'] = `Bearer ${kurum.token}`;

    const navigate = useNavigate()
    //const [v, setV] = useState(false);
    const [percentage, setUploadFileProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState([]);
    const [singleFile, setSingleFile] = useState('');
    const [kurbanImage, setKurbanImage] = useState('');
    const [img, setImg] = useState('');

    const [hisseGroupLoader, setHisseGroupLoader] = useState("Hisse grupları yükleniyor..");
    const [selected, setSelected] = useState("")
    const [hisse_groups, setHisseGroup] = useState([]);
    const [kurbanCode, setKurbanCode] = useState("");
    const [kurbanNo, setKurbanNo] = useState("");
    const [videoPath, setVideoPath] = useState("");
    const [copied, setCopied] = useState(false);
    const [noty, setNoty] = useState({ isOpen: false });
    const embedRef = useRef(null);

    const autoSizeEmbed = (el) => {
      if (!el) return
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }

    const [formData, setFormData] = useState({
      _id: '',
      kurban_kupe_no: '',
      net_hisse_fiyat: '',
      kurban_weight: '',
      kurban_note: '',
      file: '',
      youtube_embed: '',
      vidyome_embed: '',
    })
    
    const { kurban_kupe_no, net_hisse_fiyat, kurban_weight, kurban_note, youtube_embed, _id, vidyome_embed } = formData
    
    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value, // verilen propslardan name'e göre value'değerini match edip eşleştiriyor
      }))
    }

    const getHisseGroups = async () => {
      const request = await HisseGroupService.getByProject({project_id: active_project_id});
      if(request.status === 200) {
        const hisseGroupLoaderMessage = request.data.length > 0 ? "Hisse grubu seçiniz" : "Listelenecek hisse grubu bulunamadı"
        setHisseGroupLoader(hisseGroupLoaderMessage)
        setHisseGroup(request.data)
      }
    }

    const handleDropDown = (e) => {
      setSelected(e.target.value)
    }
    
    const applyKurban = (data) => {
      if (!data) return
      setSelected(data.kurban_hisse_group)
      setImg(data.kurban_image)
      setKurbanCode(data.uniq_kurban_code)
      if (data.kurban_no !== undefined) setKurbanNo(data.kurban_no)
      if (data.video_path !== undefined) setVideoPath(data.video_path)
      Object.keys(formData).forEach(key => {
        if (data[key] !== undefined) {
          setFormData((prevState) => ({ ...prevState, [key]: data[key] }))
        }
      })
    }

    /* */
    useEffect(() => {
      // 1) location.state varsa hızlı ilk render için kullan (listeden gelindiyse)
      if (location.state) applyKurban(location.state)

      // 2) Her durumda URL'deki id ile sunucudan taze veriyi çek
      //    (sayfa yenilense / link doğrudan açılsa bile çalışır)
      const targetId = kurbanId || location.state?._id
      const refetch = async () => {
        if (!targetId) return
        try {
          const res = await BKurbanService.getSingle(targetId)
          const fresh = Array.isArray(res.data) ? res.data[0] : res.data
          applyKurban(fresh)
        } catch (_) { /* location.state ile devam */ }
      }
      refetch()

      getHisseGroups()
    }, [])

    // embed alanı değer değiştikçe (yazınca / veri yüklenince) içeriğe göre büyüsün
    useEffect(() => {
      autoSizeEmbed(embedRef.current)
    }, [youtube_embed])

    const KurbanImageChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const [file] = e.target.files;
        setImg(URL.createObjectURL(file));
        setKurbanImage(file)
      }
    }
    
    const SingleFileChange = (e) => {
      setSingleFile(e.target.files[0]);
      //setSingleProgress(0);
    }

    const uploadFileOption = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        const percent = Math.floor(((loaded/1000) * 100) / (total/1000))
        setUploadFileProgress(percent)
        console.log(percentage)
      }
    }

    const publicLink = `${window.location.origin}/kurban-info/${kurbanCode}`

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(publicLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch (_) { /* clipboard izni yoksa sessiz geç */ }
    }

    /* */
    const editKurban = async (e) => {
      e.preventDefault();
      
      setLoading(true)
    
      // eğer video dosyası seçilmişse
      if(singleFile) {
        const form = new FormData();
        form.append('file', singleFile);

        try {
          const upload = await BKurbanService.upload(form, _id, uploadFileOption);
          if(!upload.data.error) {
            setNoty({ isOpen: true, title: "Kaydedildi", message: "Video yüklendi." })
            setTimeout(() => navigate(`/kurum/dashboard/${active_project_id}`), 1000)
          } else {
            setLoading(false)
            setError({ key: upload.data.error?.message || 'Video yüklenemedi. (Sunucu depolama ayarı eksik olabilir.)' })
          }
        } catch (err) {
          setLoading(false)
          setError({ key: 'Video yüklenirken bir hata oluştu. Sunucu dosya depolama (S3) ayarı yapılmamış olabilir.' })
        }

      } else if(kurbanImage) {
        const imageForm = new FormData();
        imageForm.append('kurban_img', kurbanImage);

        try {
          const uploadImage = await BKurbanService.uploadImage(imageForm, _id);
          if(!uploadImage.data.error) {
            setNoty({ isOpen: true, title: "Kaydedildi", message: "Fotoğraf yüklendi." })
            setTimeout(() => navigate(`/kurum/dashboard/${active_project_id}`), 1000)
          } else {
            setLoading(false)
            setError({ key: uploadImage.data.error?.message || 'Fotoğraf yüklenemedi. (Sunucu depolama ayarı eksik olabilir.)' })
          }
        } catch (err) {
          setLoading(false)
          setError({ key: 'Fotoğraf yüklenirken bir hata oluştu. Sunucu dosya depolama (S3) ayarı yapılmamış olabilir.' })
        }

      }
      else {
        // update
        try {
          const response = await BKurbanService.update({...formData, kurban_hisse_group: selected});
          if(response.status === 200 && !response.data.error) {
            setNoty({ isOpen: true, title: "Kaydedildi", message: "Kurban bilgileri güncellendi." })
            setTimeout(() => {
              navigate(`/kurum/dashboard/${active_project_id}`)
            }, 1000)
          } else {
            setLoading(false)
            setError({key: response.data?.error || 'Kayıt güncellenemedi. Lütfen tekrar deneyin.'})
          }
        } catch (err) {
          setLoading(false)
          const status = err?.response?.status
          setError({key: status === 401
            ? 'Oturumunuz geçersiz. Lütfen çıkış yapıp tekrar giriş yapın.'
            : 'Kayıt güncellenirken bir hata oluştu. Lütfen tekrar deneyin.'})
        }
      }

    }

    const fileInputClass = "block w-full text-sm text-gray-500 dark:text-gray-400 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-gray-700 dark:file:text-purple-300"

    return (
        <>
          <Noty isOpen={noty.isOpen} title={noty.title} message={noty.message} />

          <form onSubmit={editKurban} id="kurban_edit_form" encType="multipart/form-data" className="pb-6">
            <input type={"hidden"} value={_id} name="_id"/>

            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <Prev />
              <Title title={"Kurban Düzenle"} />
              {kurbanNo !== "" && (
                <span className="ml-1 px-2.5 py-0.5 text-sm font-semibold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  No {kurbanNo}
                </span>
              )}
            </div>

            {errors.key && (
              <div className="mb-4 p-3 rounded-lg bg-pink-50 border border-pink-200 text-sm text-pink-700">
                {errors.key}
              </div>
            )}

            {/* Temel Bilgiler */}
            <SectionCard icon={InformationCircleIcon} title="Temel Bilgiler">
              <label htmlFor="kurban_hisse_group" className="block text-sm mb-4">
                <span className="text-gray-700 dark:text-gray-400">Hisse Grubu:</span>
                <select
                  id="kurban_hisse_group"
                  value={selected}
                  onChange={(e) => handleDropDown(e)}
                  disabled={!hisseGroupLoader}
                  className="mt-1 block w-full text-md border-gray-400/30 rounded-[0.250rem] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-select">
                  <option value="">{hisseGroupLoader}</option>
                  {hisse_groups.map((hisse_group) => (
                    <option key={hisse_group._id} value={hisse_group.hisse_group_title}>{hisse_group.hisse_group_title}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                <Input value={kurban_kupe_no} title="Küpe No" name="kurban_kupe_no" onChange={onChange} errors={errors} />
                <Input type="number" value={net_hisse_fiyat} title="Net Hisse Fiyatı (₺)" name="net_hisse_fiyat" onChange={onChange} errors={errors} />
                <Input value={kurban_weight} title="Kurban KG" name="kurban_weight" onChange={onChange} errors={errors} />
              </div>

              <Textarea value={kurban_note} title="Kurban Notu" name="kurban_note" onChange={onChange} errors={errors} />
            </SectionCard>

            {/* Fotoğraf */}
            <SectionCard icon={PhotographIcon} title="Kurban Fotoğrafı" description="JPG veya PNG yükleyebilirsiniz.">
              <input
                id="formFile"
                type="file"
                name="kurban_img"
                accept="image/*"
                onChange={(e) => KurbanImageChange(e)}
                className={fileInputClass}
              />
              {img && (
                <div className="mt-4">
                  <img className="w-full max-h-80 object-contain rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" src={img} alt="kurban" />
                </div>
              )}
            </SectionCard>

            {/* Video / Embed */}
            <SectionCard icon={FilmIcon} title="Kurban Videosu" description="Embed kodu yapıştırın veya video dosyası yükleyin.">
              <label htmlFor="youtube_embed" className="block text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-400">Video Embed Kodu:</span>
                <textarea
                  id="youtube_embed"
                  ref={embedRef}
                  name="youtube_embed"
                  value={youtube_embed}
                  onChange={onChange}
                  rows={3}
                  placeholder={'Örn: <iframe src="https://..."></iframe>'}
                  className="mt-1 block w-full border-gray-400/30 rounded-[0.250rem] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple form-textarea resize-none overflow-hidden font-mono text-sm leading-relaxed min-h-[3.5rem]"
                />
              </label>
              <div className="flex items-start gap-1.5 mb-4 text-xs text-gray-400">
                <InformationCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>YouTube, Rumble, Vidyome gibi platformların "yerleştir / embed" iframe kodunu olduğu gibi yapıştırabilirsiniz. Link veya YouTube video ID de kabul edilir.</span>
              </div>

              <Input value={vidyome_embed} title="Vidyome Embed Linki (opsiyonel)" name="vidyome_embed" onChange={onChange} errors={errors} />

              <label className="block text-sm mt-2">
                <span className="text-gray-700 dark:text-gray-400">Kesim Videosu Dosyası (opsiyonel):</span>
                <input
                  type="file"
                  name="file"
                  accept="video/*"
                  onChange={(e) => SingleFileChange(e)}
                  className={`mt-1 ${fileInputClass}`}
                />
              </label>

              {videoPath && (
                <video controls className="mt-4 w-full max-h-96 rounded-lg bg-black">
                  <source src={videoPath} type="video/mp4" />
                </video>
              )}
            </SectionCard>

            {/* Paylaşım Linki */}
            <SectionCard icon={LinkIcon} title="Kurban Bilgi Linki" description="Hissedarlarla paylaşılan herkese açık takip sayfası.">
              <div className="flex items-stretch gap-2">
                <a
                  href={publicLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-grow min-w-0 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 truncate"
                >
                  {publicLink}
                </a>
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardCopyIcon className="w-4 h-4" />}
                  {copied ? "Kopyalandı" : "Kopyala"}
                </button>
              </div>
            </SectionCard>

            {/* Kaydet */}
            <div className="sticky bottom-4 mt-2">
              <Button className="w-full py-3 shadow-lg" disabled={loading}>
                {loading ? 'Kaydediliyor...' : 'KAYDET'}
              </Button>
            </div>
          </form>
      </>
    );
  }
  
  export default EditBuyukbas;