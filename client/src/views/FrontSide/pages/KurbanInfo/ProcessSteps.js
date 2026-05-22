import { CheckIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProcessSteps({ process, currentID }) {
  const [currentIndex, setCurrentIndex] = useState(-1)

  useEffect(() => {
    process.forEach((element, index) => {
      if (element._id === currentID) setCurrentIndex(index)
    })
  }, [process, currentID])

  return (
    <nav aria-label="Süreç" className="pl-1">
      <ol className="overflow-hidden">
        {process?.map((step, stepIdx) => {
          const isLast = stepIdx === process.length - 1
          const isDone = stepIdx < currentIndex
          const isCurrent = step._id === currentID

          return (
            <li key={step._id} className={classNames(!isLast ? 'pb-8' : '', 'relative')}>
              {/* connector line */}
              {!isLast && (
                <div
                  className={classNames(
                    '-ml-px absolute mt-0.5 top-5 left-4 w-0.5 h-full',
                    isDone ? 'bg-teal-500' : 'bg-gray-200'
                  )}
                  aria-hidden="true"
                />
              )}

              <div className="relative flex items-center" aria-current={isCurrent ? 'step' : undefined}>
                <span className="flex items-center">
                  {isDone ? (
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-teal-500 rounded-full">
                      <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                    </span>
                  ) : isCurrent ? (
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-teal-500 rounded-full ring-4 ring-teal-100">
                      <span className="h-2.5 w-2.5 bg-teal-500 rounded-full animate-pulse" />
                    </span>
                  ) : (
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-200 rounded-full">
                      <span className="h-2.5 w-2.5 bg-transparent rounded-full" />
                    </span>
                  )}
                </span>

                <span className="ml-4 min-w-0 flex flex-col">
                  <span className={classNames(
                    'text-sm font-semibold',
                    isCurrent ? 'text-teal-600' : isDone ? 'text-gray-700' : 'text-gray-400'
                  )}>
                    {step.process_title}
                  </span>
                  {isCurrent && (
                    <span className="text-xs text-gray-400 mt-0.5">Kurbanınız şu anda bu aşamada</span>
                  )}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
