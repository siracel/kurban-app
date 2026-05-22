import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import HisseService from '../../../services/HisseService'
import HissedarService from '../../../services/HissedarService'
import HissedarForm from './HissedarForm'

export default function AddHissedarModal({ kurban, projectId, kurumId, onClose, onAdded }) {
  const open = !!kurban
  const [hissedars, setHissedars] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setError] = useState([])

  useEffect(() => {
    if (!kurban) return
    setError([])
    HissedarService.getAll({ kurum_id: kurumId })
      .then((r) => { if (r.status === 200) setHissedars(r.data) })
      .catch(() => {})
  }, [kurban, kurumId])

  const submit = async (formData) => {
    setError([])
    setLoading(true)
    try {
      const res = await HisseService.create({ kurum_id: kurumId, project_id: projectId, kurban_id: kurban._id, ...formData })
      if (res.status === 200 && !res.data.error) {
        setLoading(false)
        onAdded()
      } else {
        setLoading(false)
        setError({ key: res.data?.error || "Kayıt eklenemedi." })
      }
    } catch (err) {
      setLoading(false)
      const status = err?.response?.status
      setError({ key: status === 401 ? "Oturumunuz geçersiz. Lütfen çıkış yapıp tekrar giriş yapın." : "Bir hata oluştu. Lütfen tekrar deneyin." })
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-[999] inset-0" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start sm:items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-800 rounded-t-2xl border-b border-gray-100 dark:border-gray-700">
                  <Dialog.Title className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Hissedar Ekle
                    {kurban && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        {kurban.kurban_no}. Kurban · {(kurban.hisse?.length || 0) + 1}/7
                      </span>
                    )}
                  </Dialog.Title>
                  <button type="button" onClick={onClose} aria-label="Kapat" className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 max-h-[75vh] overflow-y-auto">
                  {kurban && (
                    <HissedarForm
                      key={kurban._id}
                      hissedars={hissedars}
                      loading={loading}
                      errors={errors}
                      onSubmit={submit}
                    />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
