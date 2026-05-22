import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { CheckCircleIcon } from "@heroicons/react/solid"
import { Icon } from "../../../../../utils/SVG"
import Loading from "../../../../components/Loading"
import Card from "../../../../components/Card"
import SMSService from "../../../../../services/SMSService"
import { useDispatch, useSelector } from "react-redux"
import KurumService from "../../../../../services/KurumService"
import { setActiveSMSAPI } from "../../../../../store/reducers/auth"
import Modal from "../../../../molecules/modal"

export default function MessageSettings() {
    const kurum = useSelector((state) => state.auth.kurum)
    const dispatch = useDispatch()
    const [deleteLoading, setDeleteLoading] = useState('')
    const [deleteObj, setDeleteObj] = useState({})
    const [isModal, setModal] = useState({ isOpen: false, title: '', message: '' })
    const [loading, setLoading] = useState(true)
    const [sms, setSMS] = useState([])

    const getSMSServices = async () => {
        const getSms = await SMSService.getAll({ kurum_id: kurum._id })
        setSMS(getSms.data)
        setLoading(false)
    }

    const setSMSService = async (active_sms_api) => {
        const update = await KurumService.update({ _id: kurum._id, active_sms_api })
        dispatch(setActiveSMSAPI(update.data.active_sms_api))
    }

    useEffect(() => {
        getSMSServices()
    }, [])

    const askModal = (item) => {
        setDeleteObj(item)
        setModal({ isOpen: true, title: 'SMS API Sil', message: `[${item.message_api?.message_service_title}] - ait SMS API bilgilerini silmek istediğinize emin misiniz?` })
    }

    const modalResult = async (result) => {
        setModal({ isOpen: false })
        if (result) {
            setDeleteLoading(deleteObj._id)
            const deleteRecord = await SMSService.delete(deleteObj._id)
            if (deleteRecord.status === 200) {
                setSMS(sms.filter(e => e._id !== deleteRecord.data._id))
                setDeleteLoading('')
            }
        }
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Mesaj (SMS) Ayarları</h3>
                    <p className="text-sm text-gray-400">SMS sağlayıcı tanımlarınız. Aktif olan, gönderimlerde kullanılır.</p>
                </div>
                <NavLink to={'/kurum/new-message-api'} className="flex-shrink-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                    Yeni SMS API+
                </NavLink>
            </div>

            <Card className="!p-0 overflow-hidden">
                <div className={`${loading || sms.length === 0 ? "hidden" : ""} w-full overflow-x-auto`}>
                    <table className="w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50" lang="tr">
                                <th className="px-5 py-3">Mesaj API</th>
                                <th className="px-5 py-3">Başlık / Originator</th>
                                <th className="px-5 py-3 text-center">Durum</th>
                                <th className="px-5 py-3 text-center" colSpan={2}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800">
                            {sms && sms.map((item) => {
                                const isActive = kurum.active_sms_api === item._id
                                return (
                                    <tr className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/40" key={item._id}>
                                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{item.message_api?.message_service_title}</td>
                                        <td className="px-5 py-3 text-sm">{item.message_service_origin}</td>
                                        <td className="px-5 py-3 text-center">
                                            {isActive ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                                                    <CheckCircleIcon className="w-3.5 h-3.5" /> Aktif
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setSMSService(item._id)}
                                                    className="px-3 py-1 text-xs font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
                                                >
                                                    Aktif Yap
                                                </button>
                                            )}
                                        </td>
                                        <td className="py-3 text-sm w-16">
                                            <div className="flex items-center justify-center">
                                                <NavLink to={"/kurum/edit-sms-api"} state={item} title="Düzenle" aria-label="SMS API düzenle">
                                                    <div className="p-2.5 cursor-pointer text-orange-500 bg-orange-100 rounded-full hover:bg-orange-200 dark:text-orange-100 dark:bg-orange-500">
                                                        <Icon name="edit" size={5} />
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-5 text-sm w-16">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => askModal(item)}
                                                    title="Sil"
                                                    aria-label="SMS API sil"
                                                    className="p-2.5 cursor-pointer text-red-500 bg-red-100 rounded-full hover:bg-red-200 dark:text-orange-100 dark:bg-red-500"
                                                >
                                                    <span className={`${deleteLoading === item._id ? "" : "hidden"}`}>
                                                        <Icon name={"spin_loader_1"} size={5} className="animate-spin" />
                                                    </span>
                                                    <span className={`${deleteLoading === item._id ? "hidden" : ""}`}>
                                                        <Icon name={"delete"} size={5} />
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className={`${loading ? "" : "hidden"} py-10`}>
                    <Loading loading={loading} />
                </div>

                <div className={`${sms.length === 0 && !loading ? "" : "hidden"} py-12`}>
                    <span className='text-gray-400 block text-center'>Henüz bir mesaj API tanımlanmadı.</span>
                </div>
            </Card>

            <Modal result={modalResult} data={isModal} />
        </>
    )
}
