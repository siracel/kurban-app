import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux"
import { SearchIcon } from "@heroicons/react/outline"

import Card from "../../components/Card"
import PageHeader from "../../components/PageHeader"
import HissedarService from "../../../services/HissedarService";
import Modal from '../../molecules/modal';
import { Icon } from "../../../utils/SVG";
import Loading from '../../components/Loading';
import { formatGsm, digitsOnly } from "../../../utils/gsm"

function Hissedar() {
  const kurum = useSelector(state => state.auth.kurum)
  const [loading, setLoading] = useState(true);
  const [hissedars, setHissedars] = useState([]);
  const [q, setQ] = useState("")
  const [isDeleteModal, setDeleteModal] = useState({ isOpen: false });
  const [currentHissedar, setCurrentHissedar] = useState({});
  const [itemDeletingId, setItemDeleting] = useState('');

  useEffect(() => {
    const getHissedars = async () => {
      const request = await HissedarService.getAll({ kurum_id: kurum._id });
      if (request.status === 200) {
        setHissedars(request.data)
      }
      setLoading(false)
    }
    getHissedars()
  }, [])

  const deleteItem = async (result) => {
    setDeleteModal({ isOpen: false })
    if (result) {
      setItemDeleting(currentHissedar._id)
      const deleteRecord = await HissedarService.delete({ id: currentHissedar._id });
      if (deleteRecord.status === 200) {
        setHissedars(hissedars.filter(e => e._id !== currentHissedar._id))
        setItemDeleting('')
      }
    }
  }

  const askDeleteModal = (hissedar) => {
    setCurrentHissedar(hissedar)
    setDeleteModal({ isOpen: true, title: 'Hissedar Sil', message: `[${hissedar.hissedar_full_name}] silmek istediğinize emin misiniz?` })
  }

  const filtered = useMemo(() => {
    const s = q.toLocaleLowerCase('tr')
    const sd = digitsOnly(q)
    return hissedars
      .filter(h => {
        const nameMatch = (h.hissedar_full_name || "").toLocaleLowerCase('tr').includes(s)
        const phoneMatch = sd && digitsOnly(h.hissedar_gsm).includes(sd)
        return nameMatch || phoneMatch
      })
      .sort((a, b) => (a.hissedar_full_name || "").localeCompare(b.hissedar_full_name || "", 'tr', { sensitivity: 'base' }))
  }, [hissedars, q])

  return (
    <>
      <PageHeader title="Hissedarlar" subtitle={hissedars.length > 0 ? `${hissedars.length} kayıt` : null} />

      {/* Arama */}
      {hissedars.length > 0 && (
        <div className="relative mb-4">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="İsim veya telefon ile ara…"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
      )}

      <Card className="!p-0 overflow-hidden">
        <Modal result={deleteItem} data={isDeleteModal} />

        <div className={`${loading || filtered.length === 0 ? "hidden" : ""} divide-y divide-gray-100 dark:divide-gray-700`}>
          {filtered.map((hissedar) => (
            <div key={hissedar._id} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/40">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 flex items-center justify-center text-sm font-semibold">
                {(hissedar.hissedar_full_name || "?").charAt(0).toLocaleUpperCase('tr')}
              </span>

              <div className="flex-grow min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{hissedar.hissedar_full_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <a href={`tel:${digitsOnly(hissedar.hissedar_gsm)}`} className="hover:text-purple-600">{formatGsm(hissedar.hissedar_gsm)}</a>
                  {hissedar.referans_full_name && (
                    <span className="text-gray-400"> · Ref: {hissedar.referans_full_name}</span>
                  )}
                </p>
              </div>

              {itemDeletingId === hissedar._id ? (
                <span className="text-pink-700"><Icon name="spin_loader_1" size={5} className="animate-spin" /></span>
              ) : (
                <button
                  type="button"
                  onClick={() => askDeleteModal(hissedar)}
                  title="Hissedarı sil"
                  aria-label="Hissedarı sil"
                  className="flex-shrink-0 p-2.5 cursor-pointer text-red-500 bg-red-100 rounded-full hover:bg-red-200 dark:text-orange-100 dark:bg-red-500"
                >
                  <Icon name="delete" size={5} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className={`${loading ? "" : "hidden"} py-12`}>
          <Loading loading={loading} />
        </div>

        <div className={`${!loading && hissedars.length === 0 ? "" : "hidden"} py-12`}>
          <span className='text-gray-400 block text-center'>Henüz bir hissedar kaydı yok.</span>
        </div>

        <div className={`${!loading && hissedars.length > 0 && filtered.length === 0 ? "" : "hidden"} py-12`}>
          <span className='text-gray-400 block text-center'>Aramanızla eşleşen hissedar bulunamadı.</span>
        </div>
      </Card>
    </>
  );
}

export default Hissedar;
