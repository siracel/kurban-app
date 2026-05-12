import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ChatIcon, XIcon } from '@heroicons/react/outline'

export default function SMSPreview(props) {
  const { data, onConfirm, onCancel } = props
  const [open, setOpen] = useState(data.isOpen)
  const cancelRef = useRef(null)

  useEffect(() => {
    setOpen(data.isOpen)
  }, [data])

  const hissedars = data?.hissedars || []
  const messageText = data?.message?.message_content || data?.message?.message_title || ""

  const close = () => {
    setOpen(false)
    if (onCancel) onCancel()
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-[999]" initialFocus={cancelRef} onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    aria-label="Kapat"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={close}
                  >
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ChatIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      SMS Gönderimini Onayla
                    </Dialog.Title>
                    <p className="mt-1 text-sm text-gray-500">
                      {data?.kurban_no ? `${data.kurban_no} no'lu kurbanın ` : ""}
                      <strong>{hissedars.length}</strong> hissedarına aşağıdaki mesaj gönderilecektir.
                    </p>

                    {messageText && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                        {messageText}
                      </div>
                    )}

                    {hissedars.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-1">Alıcılar:</div>
                        <ul className="text-sm text-gray-700 max-h-32 overflow-y-auto">
                          {hissedars.map((h, i) => (
                            <li key={h._id || i} className="py-0.5">
                              {h.hissedar_full_name} — {h.hissedar_gsm}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => onConfirm && onConfirm()}
                  >
                    Gönder
                  </button>
                  <button
                    type="button"
                    ref={cancelRef}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={close}
                  >
                    İptal
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
