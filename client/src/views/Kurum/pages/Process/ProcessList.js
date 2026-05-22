import Loading from '../../../components/Loading';
import ProcessService from "../../../../services/ProcessService";
import React, { useEffect, useState } from "react";
import {useSelector} from "react-redux"
import {Icon} from "../../../../utils/SVG";
import Modal from '../../../molecules/modal';
import {NavLink} from 'react-router-dom'

 
function ProcessList() {
 
  const kurum = useSelector(state => state.auth.kurum)

  const [processes, setProcess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState('');

  const [deleteObj, setDeleteObj] = useState({});
  const [isModal, setModal] = useState({isOpen: false, title: '', message: ''});

  const getProcess = async () => {
    console.log(kurum)
    const request = await ProcessService.getAll({kurum_id: kurum._id});
    if(request.status === 200) {
      setLoading(false)
      setProcess(request.data)
    }
  }

  useEffect(() => {
    
    getProcess()
    
  }, [])

  const askModal = (item) => {
    console.log(item)
    setDeleteObj({})
    setDeleteObj(item)
    setModal({isOpen: true, title: 'İşlem Adımı Sil', message: `[${item?.process_title}] - işlem adımını silmek istediğinize emin misiniz?`})
  }

  const modalResult = async (result) => {

    setModal({isOpen: false})

    if(result) {
      setDeleteLoading(deleteObj._id)
      const deleteRecord = await ProcessService.delete(deleteObj._id);
      if(deleteRecord.status === 200) {
        setProcess( processes.filter( e => e._id !== deleteRecord.data._id  ) );
        setDeleteLoading(false)
      }
    }
  }

  const changeOrder = async (process, status) => {
    console.log(processes)
    const data = {
      _id: process._id,
      kurum_id: kurum._id,
      process_order: process.process_order,
      status: status,
      countProcess: processes.length
    }
    const response = await ProcessService.update(data);

    if(response.status === 200 && !response.data.error) {
      // geçici çözüm yeniden get request
      getProcess()
      if(status === "up") {

      }

      if(status === "down") {

      }
    } else if(response.data.error) {
      console.log(response.data.error)
    }
  }
  
    return (
      <>
        <div className={`${loading || processes?.length === 0 ? "hidden" : ""} w-full overflow-x-auto`}>
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50" lang="tr">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">İşlem Başlığı</th>
                <th className="px-5 py-3">Mesaj Şablonu</th>
                <th className="px-5 py-3 text-center">Sıra</th>
                <th className="px-5 py-3 text-center" colSpan={2}>İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800">
            {processes && processes?.map((process, index) =>  (
                <tr className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/40" key={process._id}>
                  <td className="px-5 py-3 text-sm text-gray-400">{index+1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{process?.process_title}</td>
                  <td className="px-5 py-3 text-sm">{process.message_template ? process.message_template.message_title : '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1 text-gray-400">
                      <button type="button" onClick={() => changeOrder(process, 'up')} aria-label="Yukarı taşı" className="p-1 rounded hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button type="button" onClick={() => changeOrder(process, 'down')} aria-label="Aşağı taşı" className="p-1 rounded hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className={`${process?.process_title === "KAYIT" ? "invisible" : ""} py-3 text-sm w-16`}>
                    <div className='flex items-center justify-center'>
                      <NavLink to={"/kurum/edit-process"} state={process} title="Düzenle" aria-label="İşlem adımını düzenle">
                        <div className="p-2.5 cursor-pointer text-orange-500 bg-orange-100 rounded-full hover:bg-orange-200 dark:text-orange-100 dark:bg-orange-500">
                          <Icon name="edit" size={5} />
                        </div>
                      </NavLink>
                    </div>
                  </td>
                  <td className={`${process?.process_title === "KAYIT" ? "invisible" : ""} py-3 pr-5 text-sm w-16`}>
                    <div className='flex items-center justify-center'>
                      <button
                        type="button"
                        onClick={() => askModal(process)}
                        title="Sil"
                        aria-label="İşlem adımını sil"
                        className="p-2.5 cursor-pointer text-red-500 bg-red-100 rounded-full hover:bg-red-200 dark:text-orange-100 dark:bg-red-500">
                        <span className={`${deleteLoading === process._id ? "" : "hidden"}`}>
                          <Icon name={"spin_loader_1"} size={5} className="animate-spin" />
                        </span>
                        <span className={`${deleteLoading === process._id ? "hidden" : ""}`}>
                          <Icon name={"delete"} size={5} />
                        </span>
                      </button>
                    </div>
                  </td>
              </tr>)
            )}
            </tbody>
          </table>
        </div>

        <div className={`${loading ? "" : "hidden"} py-10`}>
          <Loading loading={loading} />
        </div>

        <div className={`${processes?.length === 0 && !loading ? "" : "hidden"} py-12`}>
          <span className='text-gray-400 block text-center'>Henüz bir işlem adımı oluşturmadınız.</span>
        </div>

        <Modal result={modalResult} data={isModal} />
      </>
    );
}

export default ProcessList;