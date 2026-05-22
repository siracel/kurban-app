import Loading from '../../../components/Loading';
import HisseGroupService from "../../../../services/HisseGroupService";
import { useEffect, useState } from "react";
import {useSelector} from "react-redux"
import {Icon} from "../../../../utils/SVG";
import Modal from '../../../molecules/modal';
import {NavLink} from 'react-router-dom'

function ProcessList() {
  const active_project_id = useSelector(state => state.kurum.active_project_id)

  const [hisse_groups, setHisseGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState('');

  const [deleteObj, setDeleteObj] = useState({});
  const [isModal, setModal] = useState({isOpen: false, title: '', message: ''});

  useEffect(() => {
    const getHisseGroup = async () => {
      const request = await HisseGroupService.getByProject({project_id: active_project_id});
      if(request.status === 200) {
        setLoading(false)
        setHisseGroup(request.data)
      }
    }
    getHisseGroup()
    
  }, [])

  /* Delete Process */
  const askModal = (item) => {
    console.log(item)
    setDeleteObj({})
    setDeleteObj(item)
    setModal({isOpen: true, title: 'İşlem Adımı Sil', message: `[${item.hisse_group_title}] - hisse grubunu silmek istediğinize emin misiniz?`})
  }

  const modalResult = async (result) => {
    setModal({isOpen: false})
    if(result) {
      setDeleteLoading(deleteObj._id)
      const deleteRecord = await HisseGroupService.delete(deleteObj._id);
      if(deleteRecord.status === 200) {
        setHisseGroup( hisse_groups.filter( e => e._id !== deleteRecord.data._id  ) );
        setDeleteLoading(false)
      }
    }
  }
  
    return (
      <>
        <div className={`${loading || hisse_groups.length === 0 ? "hidden" : ""} w-full overflow-x-auto`}>
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50" lang="tr">
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Hisse Grubu</th>
                <th className="px-5 py-3 text-center" colSpan={2}>İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 dark:bg-gray-800">
            {hisse_groups && hisse_groups.map((hisse_group, index) =>  (
                <tr className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/40" key={hisse_group._id}>
                  <td className="px-5 py-3 text-sm text-gray-400">{index+1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{hisse_group.hisse_group_title}</td>
                  <td className="py-3 text-sm w-16">
                    <div className='flex items-center justify-center'>
                      <NavLink to={"/kurum/edit-hisse-grup"} state={hisse_group} title="Düzenle" aria-label="Hisse grubunu düzenle">
                        <div className="p-2.5 cursor-pointer text-orange-500 bg-orange-100 rounded-full hover:bg-orange-200 dark:text-orange-100 dark:bg-orange-500">
                          <Icon name="edit" size={5} />
                        </div>
                      </NavLink>
                    </div>
                  </td>
                  <td className="py-3 pr-5 text-sm w-16">
                    <div className='flex items-center justify-center'>
                      <button
                        type="button"
                        onClick={() => askModal(hisse_group)}
                        title="Sil"
                        aria-label="Hisse grubunu sil"
                        className="p-2.5 cursor-pointer text-red-500 bg-red-100 rounded-full hover:bg-red-200 dark:text-orange-100 dark:bg-red-500">
                        <span className={`animate-spin ${deleteLoading === hisse_group._id ? "" : "hidden"}`}>
                          <Icon name={"spin_loader_1"} size={5} />
                        </span>
                        <span className={`${deleteLoading === hisse_group._id ? "hidden" : ""}`}>
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

        <div className={`${hisse_groups.length === 0 && !loading ? "" : "hidden"} py-12`}>
          <span className='text-gray-400 block text-center'>Henüz bir hisse grubu oluşturmadınız.</span>
        </div>

        <Modal result={modalResult} data={isModal} />
      </>
    );
}

export default ProcessList;