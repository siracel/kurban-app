import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
 
import Card from "../../components/Card"
import PageHeader from "../../components/PageHeader"
import HissedarService from "../../../services/HissedarService";
// import {setHissedars} from "../../../store/reducers/hissedar"
import Modal from '../../molecules/modal';
import {Icon} from "../../../utils/SVG";
import Loading from '../../components/Loading';

function Hissedar() {
  const kurum = useSelector(state => state.auth.kurum)
  const [loading, setLoading] = useState(false);
  const [hissedars, setHissedars] = useState([]);
  const [isDeleteModal, setDeleteModal] = useState({isOpen: false});
  const [currentHissedar, setCurrentHissedar] = useState({});
  const [itemDeletingId, setItemDeleting] = useState('');
  

  useEffect(() => {
    const getHissedars = async () => {
      setLoading(true)
      const request = await HissedarService.getAll({kurum_id: kurum._id});
      if(request.status === 200) {
        console.log(request.data);
          setLoading(false)
          // dispatch(setHissedars(request.data))
          setHissedars(request.data)
      }
    }
    getHissedars()
  }, [])

  const deleteItem = async (result) => {
    setDeleteModal({isOpen: false})

    if(result) {
      setItemDeleting(currentHissedar._id)
      const deleteRecord = await HissedarService.delete({id: currentHissedar._id});
      if(deleteRecord.status === 200) {
        const newHissedars = hissedars.filter( e => e._id !== currentHissedar._id  )
        // dispatch(setHissedars(newHissedars))
        setHissedars(newHissedars)
        setItemDeleting('')
      }
    }
  }

  const askDeleteModal = (hissedar) => {
    setCurrentHissedar(hissedar)
    setDeleteModal({isOpen: true, title: 'Hissedar Sil', message: `[${hissedar.hissedar_full_name}] silmek istediğinize emin misiniz?`})
  }
  
    return (
      <>
        <PageHeader title="Hissedarlar" subtitle={hissedars.length > 0 ? `${hissedars.length} kayıt` : null} />

        <Card className="!p-0 overflow-hidden">
          <Modal result={deleteItem} data={isDeleteModal} />

          <div className={`${loading || hissedars?.length === 0 ? "hidden" : ""} w-full overflow-x-auto`}>
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50" lang="tr">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Hissedar</th>
                  <th className="px-5 py-3">GSM</th>
                  <th className="px-5 py-3 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800">
              {hissedars && hissedars?.map((hissedar, index) =>  (
                  <tr className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/40" key={`hissedar_${index}`}>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      <span className={`${itemDeletingId === hissedar._id ? "hidden" : ""}`}>{index+1}</span>
                      <span className='text-pink-800'>
                        <Icon name="spin_loader_1" size={5} className={`animate-spin ${itemDeletingId === hissedar._id ? "" : "hidden"}`}/>
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">
                      {hissedar.hissedar_full_name}
                    </td>
                    <td className="px-5 py-3 text-sm">
                      {hissedar.hissedar_gsm}
                    </td>
                    <td className="px-5 py-3">
                      <div className='flex items-center justify-center'>
                        <button
                          type="button"
                          onClick={() => askDeleteModal(hissedar)}
                          title="Hissedarı sil"
                          aria-label="Hissedarı sil"
                          className="p-2.5 cursor-pointer text-red-500 bg-red-100 rounded-full hover:bg-red-200 dark:text-orange-100 dark:bg-red-500">
                          <Icon name="delete" size={5} />
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

          <div className={`${hissedars?.length === 0 && !loading ? "" : "hidden"} py-12`}>
            <span className='text-gray-400 block text-center'>Henüz bir hissedar kaydı yok.</span>
          </div>
        </Card>
      </>
    );
}

export default Hissedar;