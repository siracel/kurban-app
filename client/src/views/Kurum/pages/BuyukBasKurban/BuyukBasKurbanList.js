import Loading from '../../../components/Loading';
import KurbanService from "../../../../services/BKurbanService";
import HisseService from "../../../../services/HisseService";
import MessageService from "../../../../services/MessageService";
import { useCallback, useEffect, useState } from "react";
import {useSelector} from "react-redux"
import {Icon} from "../../../../utils/SVG";
import { NavLink } from 'react-router-dom';
import Modal from '../../../molecules/modal';
import Side from '../../../molecules/side';
import Noty from '../../../molecules/noty';
import SMSPreview from '../../../molecules/smsPreview';
import ProcessService from '../../../../services/ProcessService';
import { ChatIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import Pagination from '../../components/Pagination';
import "./BuyukBasKurbanList.css"
import Search from './Search';

function BuyukBasKurbanList({ project_id }) {
    
  const kurum = useSelector(state => state.auth.kurum)

  const [kurbans, setKurban] = useState([]);
  const [kurbanAtStart, setKurbanAtStart] = useState([]);
  const [message_templates, setMessageTemplate] = useState([]);
  const [kurban, _setKurban] = useState({});
  const [process, setProcess] = useState([]);
  const [deleteHisse, setDeleteHisse] = useState({});
  const [hisseDeleteLoading, setHisseDeleteLoading] = useState('');
  const [kurbanDeleteLoading, setKurbanDeleteLoading] = useState('');
  const [loading, setLoading] = useState(true);
  const [processLoader, setProcessLoader] = useState('');
  const [isModal, setModal] = useState({isOpen: false, title: '', message: ''});
  const [isDeleteModal, setDeleteModal] = useState({isOpen: false});
  const [side, setSide] = useState({isOpen: false}); // for process
  const [sideForSMS, setSideForSMS] = useState({isOpen: false});
  const [smsPreview, setSmsPreview] = useState({isOpen: false});
  const [noty, setNoty] = useState({isOpen: false});

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    const getKurbanAll = async () => {
      const request = await KurbanService.getAll({kurum_id: kurum._id, project_id: project_id});
      if(request.status === 200) {
        setLoading(false)
        setKurban(request.data)
        setKurbanAtStart(request.data)
      }
    }
    const getProcess = async () => {
      const request = await ProcessService.getAll({kurum_id: kurum._id});
      if(request.status === 200) {
        setProcess(request.data)
      }
    }
    const getMessageTemplate = async () => {
      const request = await MessageService.getAll({kurum_id: kurum._id});
      if(request.status === 200) {
        setMessageTemplate(request.data)
      }
    }
    getMessageTemplate()
    getKurbanAll()
    getProcess()
  }, [])

  const handleHisseDelete = (hisse) => {
    setDeleteHisse({})
    setDeleteHisse(hisse)
    setModal({isOpen: true, title: 'Hisseyi Sil', message: `[${hisse.hissedar_full_name}] - Bu hisse kaydını silmek istediğinize emin misiniz?`})
  }
  
  const modalResult = async (result) => {
    setModal({isOpen: false})

    // delete process and remove deleted hisse from kurbans.hisse
    if(result) {
      setHisseDeleteLoading(deleteHisse._id)
      const deleteHisseRecord = await HisseService.delete(deleteHisse._id);
      if(deleteHisseRecord.status === 200) {
        setHisseDeleteLoading('')
        setKurban( kurbans.filter( element =>  element.hisse = element.hisse.filter(h => h._id !== deleteHisse._id) ) );
        
      }
    }
  }

  /* Delete Kurban */
  const askModal = (kurban) => {
    _setKurban(kurban)
    setDeleteModal({isOpen: true, title: 'Kurban Sil', message: `[${kurban.kurban_no}] Numaralı kurbanı ve hisselerini silmek istediğinize emin misiniz?`})
  }

  const deleteKurban = async (result) => {
    setDeleteModal({isOpen: false})

    if(result) {
      setKurbanDeleteLoading(kurban._id)
      const deleteRecord = await KurbanService.delete(kurban._id);
      if(deleteRecord.status === 200) {
        setKurban( kurbans.filter( e => e._id !== kurban._id  ) );
        setKurbanDeleteLoading('')
      }
    }
  }

  /* Change Process */
  const openProcessList = (kurban) => {
    setSide({isOpen: true, title: "İşlem Adımı Seç", veri: process})
    _setKurban(kurban)
  }

  const sideResultForProcess = async (result) => {
    console.log(result)
    
    result.kurban_id = kurban._id
    setSide({isOpen: false, title: side.title})
    
    if(result && result?._id !== kurban.process?._id) {
      setProcessLoader(kurban._id)
      // const change_process = await KurbanService.update({_id: kurban._id, process: result._id})
      const change_process = await KurbanService.changeProcess({_id: kurban._id, process: result._id, kurum_id: kurum._id })
      
      // artık kurban process_id tutup populate ederek aldığı için update ederken process_id kaydediliyor
      // anlık güncelleme için değiştirilen _id process içinde bulunup yeni değer yazdırılmalı
      console.log(process)
      setKurban(kurbans.filter(item => item._id === kurban._id ? kurban.process = result : item))
      setProcessLoader(false)
      if(change_process.data.is_message_send) {
        setNoty({isOpen: true, message: "Kurban durumu değiştirildi ve operasyon mesajı hissedarlara gönderildi."})
      } else {
        setNoty({isOpen: true, message: "Kurban durumu değiştirildi."})
      }
      
      setTimeout(() => {
        setNoty({isOpen: false, message: noty.message})
      }, 2500)
    }
  }

  /* Send SMS */
  const openSendSMS = (kurban) => {
    setSideForSMS({isOpen: true, title: "Mesajlar", veri: message_templates, kurban_no: kurban.kurban_no, state_loading: false})
    _setKurban(kurban)
    // message gönderimi sırasında side panelin Icon kısmında progress olabilir gönderim işlemi bitince side kapanır + noty mesaj verir
  }

  const sideResultForSMS = (result) => {
    setSideForSMS({isOpen: false, title: side.title, state_loading: null})
    setSmsPreview({
      isOpen: true,
      message: result,
      hissedars: kurban.hisse || [],
      kurban: kurban,
      kurban_no: kurban.kurban_no,
    })
  }

  const confirmSendSMS = async () => {
    const { message, kurban: targetKurban } = smsPreview
    setSmsPreview({ isOpen: false })
    setSideForSMS({isOpen: true, title: "Mesajlar", veri: message_templates, kurban_no: targetKurban.kurban_no, state_loading: message._id, kurban_info_message: message.kurban_info_message})

    const sendSMS = await MessageService.send({
      message,
      hissedarlar: targetKurban.hisse,
      kurban_no: targetKurban.kurban_no,
      kurban_code: targetKurban.uniq_kurban_code,
      kurum_id: kurum._id,
      kurban_info_message: message.kurban_info_message ? 1 : 0
    })

    setSideForSMS({isOpen: false, title: side.title, state_loading: null})

    if (sendSMS?.data?.error) {
      setNoty({isOpen: true, title: "Hmmm Bir Saniye..", message: sendSMS.data.error, type: "error"})
    } else {
      setNoty({isOpen: true, message: "SMS başarıyla gönderildi."})
    }

    setTimeout(() => {
      setNoty((prev) => ({ ...prev, isOpen: false }))
    }, 3500)
  }

  const cancelSendSMS = () => {
    setSmsPreview({ isOpen: false })
  }

  const doluHisse = (e, hisse) => {
    if(hisse > 6) {
      e.preventDefault()
      setNoty({
        isOpen: true,
        title: "Hisse limiti doldu",
        message: "Büyükbaş bir kurbanda en fazla 7 hissedar yer alabilir.",
        type: "error"
      })
      setTimeout(() => {
        setNoty((prev) => ({ ...prev, isOpen: false }))
      }, 3500)
    }
  }

  const setReverse = () => {
    setKurban(kurbans.reverse())
    forceUpdate();
  }

  const search = (e) => {
    console.log(e.target.value)
    if(e.target.value.length > 0) {
      setKurban(kurbans.filter(kurban => kurban.hisse.some(hissedar => 
          hissedar.hissedar_full_name.toLowerCase().match(new RegExp(e.target.value, 'g')))
        ))
    } else {
      setKurban(kurbanAtStart)
    }
  }
    return (
     <>
        <Search className={` mt-2 mb-5 `} search={search} />
        
        <div className="w-full overflow-hidden rounded-lg shadow-xs border-[1px] border-gray-400/20">
          <Noty isOpen={noty.isOpen} message={noty.message} title={noty.title} type={noty.type} />
          <Side result={sideResultForProcess} data={side} kurbanProcess={kurban.process}/>
          <Side result={sideResultForSMS} data={sideForSMS}/>
          <SMSPreview data={smsPreview} onConfirm={confirmSendSMS} onCancel={cancelSendSMS} />
          <Modal result={deleteKurban} data={isDeleteModal} />

          <div className={`${loading || kurbans?.length === 0 ? "hidden" : ""} hidden md:block w-full overflow-x-auto`}>
            <table className="w-full whitespace-no-wrap ">
              <thead>
                <tr className="text-sm font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800" lang="tr" >
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3 flex items-center cursor-pointer" onClick={setReverse}>
                    <span>Kurban NO</span>
                    <div className='flex flex-col items-center first-letter ml-3 kurban-list-up-down-icons'>
                      <ChevronUpIcon />
                      <ChevronDownIcon />
                    </div>
                  </th>
                  <th className="px-4 py-3">Hissedarlar</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-center" colSpan={4}>İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {kurbans && kurbans?.map((kurban, index) =>  (
                  <tr className="text-gray-700 dark:text-gray-400" key={kurban._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                          <div
                            className="absolute inset-0 rounded-full shadow-inner"
                            aria-hidden="true"
                          ></div>
                        </div>
                        <div>
                          <span className={`${kurbanDeleteLoading === kurban._id ? "hidden" : ""}`}>{index+1}</span>
                          <span className='text-pink-800'>
                            <Icon name="spin_loader_1" size={5} className={`animate-spin ${kurbanDeleteLoading === kurban._id ? "" : "hidden"}`}/>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className='text-[0.60rem] block text-gray-500'>{kurban?.kurban_hisse_group}</span>
                      <span className='text-2xl font-semibold block leading-none'>{kurban.kurban_no}</span>
                    </td>
                    <td className="px-4 py-3 text-l min-w-full">
                      {kurban?.hisse?.map(item => (
                        item.kurban_id === kurban._id
                        ? <p className="flex md:justify-start text-sm mb-2 mt-2 text-gray-600 dark:text-gray-400 flex-shrink-0" key={item._id}>
                            
                            <span>{`${item.hissedar_full_name} - ${item.hissedar_gsm}`}</span>
                            
                            <span className={` text-pink-800 ${hisseDeleteLoading === item._id ? '' : 'hidden'}`}>
                              <Icon name="spin_loader_1" size="5" className="animate-spin ml-2"/>
                            </span>
                            <span onClick={() => handleHisseDelete(item)} className={`text-pink-800 ${hisseDeleteLoading === item._id ? 'hidden' : ''}`}>
                              <Icon name="cross" size="5" className="ml-2 cursor-pointer"/>
                            </span>                              
                          </p>
                        : ""
                      ))}
          
                      <NavLink to={'/kurum/create-hisse'}
                                onClick={(e) => doluHisse(e, kurban.hisse.length)} 
                                state={{ kurban_id: kurban._id, kurban_no: kurban.kurban_no, hissedar_count: kurban.hisse.length }}
                                className={`inline-flex items-center px-1.5 lg:px-2.5 py-1  lg:py-1.5 border border-transparent text-xs font-medium rounded ${kurban.hisse.length > 6 ? 'text-red-500 bg-red-200 ring-0 focus:ring-0 hover:bg-red-200' : ''} text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >Hissedar Ekle+</NavLink>
                    </td>
                    <td className="px-2 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => {openProcessList(kurban)}}
                        title="Durumu değiştir"
                        aria-label="Kurban durumunu değiştir"
                        className="inline-block text-center cursor-pointer px-5 py-2 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600 hover:bg-orange-200">
                        {processLoader === kurban._id ?  "..." : kurban?.process?.process_title}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className='flex items-center justify-center'>
                        <button
                          type="button"
                          title="Kurban bilgileri"
                          aria-label="Kurban bilgilerini görüntüle"
                          className="p-3 cursor-pointer text-blue-500 bg-blue-100 rounded-full dark:text-orange-100 dark:bg-blue-500 hover:bg-blue-200">
                          <Icon name="info" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className='flex items-center justify-center'>
                        <button
                          type="button"
                          onClick={() => openSendSMS(kurban)}
                          title="SMS gönder"
                          aria-label="Hissedarlara SMS gönder"
                          className="p-3 cursor-pointer text-purple-500 bg-purple-100 rounded-full dark:text-green-100 dark:bg-green-500 hover:bg-purple-200">
                          <ChatIcon className='w-5 h-5' />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className='flex items-center justify-center'>
                        <NavLink to={"/kurum/edit-buyukbas"} state={kurban} title="Kurbanı düzenle" aria-label="Kurbanı düzenle">
                          <div className="p-3 cursor-pointer text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500 hover:bg-orange-200">
                              <Icon name="edit" />
                          </div>
                        </NavLink>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className='flex items-center justify-center'>
                        <button
                          type="button"
                          onClick={() => askModal(kurban)}
                          title="Kurbanı sil"
                          aria-label="Kurbanı sil"
                          className="p-3 cursor-pointer text-red-500 bg-red-100 rounded-full dark:text-orange-100 dark:bg-red-500 hover:bg-red-200">
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                </tr>)
              )}
                
              </tbody>
            </table>
          </div>

          {/* Mobile card layout */}
          <div className={`${loading || kurbans?.length === 0 ? "hidden" : ""} md:hidden divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800`}>
            {kurbans && kurbans.map((kurban, index) => (
              <div key={kurban._id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500 block">{kurban?.kurban_hisse_group}</span>
                    <span className="text-2xl font-semibold leading-none block">{kurban.kurban_no}</span>
                    <span className="text-xs text-gray-400">#{index+1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openProcessList(kurban)}
                    title="Durumu değiştir"
                    aria-label="Kurban durumunu değiştir"
                    className="px-3 py-1.5 text-sm font-semibold text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600 hover:bg-orange-200">
                    {processLoader === kurban._id ? "..." : kurban?.process?.process_title}
                  </button>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Hissedarlar</div>
                  {kurban?.hisse?.map(item => (
                    item.kurban_id === kurban._id
                      ? <p className="flex text-sm mb-1 text-gray-600 dark:text-gray-400" key={item._id}>
                          <span className="flex-grow">{`${item.hissedar_full_name} - ${item.hissedar_gsm}`}</span>
                          <span className={`text-pink-800 ${hisseDeleteLoading === item._id ? '' : 'hidden'}`}>
                            <Icon name="spin_loader_1" size="5" className="animate-spin ml-2"/>
                          </span>
                          <button
                            type="button"
                            aria-label="Hisseyi sil"
                            onClick={() => handleHisseDelete(item)}
                            className={`text-pink-800 ${hisseDeleteLoading === item._id ? 'hidden' : ''}`}>
                            <Icon name="cross" size="5" className="ml-2 cursor-pointer"/>
                          </button>
                        </p>
                      : ""
                  ))}
                  <NavLink to={'/kurum/create-hisse'}
                    onClick={(e) => doluHisse(e, kurban.hisse.length)}
                    state={{ kurban_id: kurban._id, kurban_no: kurban.kurban_no, hissedar_count: kurban.hisse.length }}
                    className={`inline-flex items-center mt-1 px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${kurban.hisse.length > 6 ? 'text-red-500 bg-red-200 hover:bg-red-200' : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'}`}>
                    Hissedar Ekle+
                  </NavLink>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    title="Kurban bilgileri"
                    aria-label="Kurban bilgilerini görüntüle"
                    className="p-2 cursor-pointer text-blue-500 bg-blue-100 rounded-full hover:bg-blue-200">
                    <Icon name="info" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openSendSMS(kurban)}
                    title="SMS gönder"
                    aria-label="Hissedarlara SMS gönder"
                    className="p-2 cursor-pointer text-purple-500 bg-purple-100 rounded-full hover:bg-purple-200">
                    <ChatIcon className='w-5 h-5' />
                  </button>
                  <NavLink to={"/kurum/edit-buyukbas"} state={kurban} title="Kurbanı düzenle" aria-label="Kurbanı düzenle">
                    <div className="p-2 cursor-pointer text-orange-500 bg-orange-100 rounded-full hover:bg-orange-200">
                      <Icon name="edit" />
                    </div>
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => askModal(kurban)}
                    title="Kurbanı sil"
                    aria-label="Kurbanı sil"
                    className="ml-auto p-2 cursor-pointer text-red-500 bg-red-100 rounded-full hover:bg-red-200">
                    <Icon name="delete" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination className={`${loading || kurbans?.length === 0 ? "hidden" : ""}`} />

          <div className={` ${loading ? "" : "hidden"} py-10`}>
            <Loading loading={loading} />
          </div>
          
          <div className={` ${kurbans?.length === 0 && !loading ? "" : "hidden"} py-10`}>
            <span className='text-gray-400 block text-center'>Henüz bir kurban kaydı oluşturmadınız..</span>
          </div>

          <Modal result={modalResult} data={isModal} />
        </div>
      </>
    );
}

export default BuyukBasKurbanList;