import MessageService from "../../../../services/MessageService";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader"
import {Icon} from "../../../../utils/SVG";
import { NavLink } from "react-router-dom";
import {useSelector} from "react-redux"
import Loading from '../../../components/Loading';
import Modal from '../../../molecules/modal';

function MessageTemplate() {

  const kurum = useSelector(state => state.auth.kurum)

  const [messageTemplates, setMessageTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState('');
  const [deleteObj, setDeleteObj] = useState({});
  const [isModal, setModal] = useState({isOpen: false, title: '', message: ''});

  useEffect(() => {
    const getMessageTemplate = async () => {
      console.log(kurum)
      const request = await MessageService.getAll({kurum_id: kurum._id});
      if(request.status === 200) {
        setLoading(false)
        setMessageTemplates(request.data)
      }
    }
    getMessageTemplate()
    
  }, [])

  /* Delete Process */
  const askModal = (item) => {
    console.log(item)
    setDeleteObj({})
    setDeleteObj(item)
    setModal({isOpen: true, title: 'Mesaj Şablonu Sil', message: `[${item.message_title}] - şablonunu silmek istediğinize emin misiniz?`})
  }

  const modalResult = async (result) => {

    setModal({isOpen: false})

    if(result) {
      setDeleteLoading(deleteObj._id)
      const deleteRecord = await MessageService.delete(deleteObj._id);
      if(deleteRecord.status === 200) {
        setMessageTemplates( messageTemplates.filter( e => e._id !== deleteRecord.data._id  ) );
        setDeleteLoading(false)
      }
    }
  }
    return (
      <>
        <PageHeader
          title="Mesaj Şablonları"
          actionLabel="Mesaj Şablonu Oluştur+"
          actionTo="/kurum/create-message-template"
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {messageTemplates.map((message) => (
            <li key={message._id} className="col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
              <div className="flex-1 p-5">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <Icon name="message_template" size={5} />
                  </span>
                  <h3 className="text-gray-900 dark:text-gray-100 text-sm font-semibold pt-1.5 truncate">{message.message_title}</h3>
                </div>
                <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{message.message_content}</p>
              </div>
              <div className="flex divide-x divide-gray-100 dark:divide-gray-700 border-t border-gray-100 dark:border-gray-700">
                <NavLink state={message} to={"/kurum/edit-message-template"} className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-sm text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-bl-xl">
                  <Icon name="edit" size="5" />
                  Düzenle
                </NavLink>
                <button type="button" onClick={() => askModal(message)} className="flex-1 inline-flex items-center justify-center gap-2 py-3 text-sm text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-br-xl">
                  <Icon name="delete" size="5" className={`${deleteLoading === message._id ? 'hidden' : ''}`} />
                  <Icon name="spin_loader_1" size="5" className={`${deleteLoading === message._id ? 'animate-spin' : 'hidden'}`} />
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className={`${messageTemplates.length === 0 && !loading ? "" : "hidden"} py-12`}>
          <span className='text-gray-400 block text-center'>Henüz bir mesaj şablonu oluşturmadınız.</span>
        </div>

        <Loading loading={loading} />

        <Modal result={modalResult} data={isModal} />
      </>
    );
}

export default MessageTemplate;