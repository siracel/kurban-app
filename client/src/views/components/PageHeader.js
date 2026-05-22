import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/outline'

/**
 * Tutarlı sayfa başlığı: geri butonu + başlık + opsiyonel aksiyon butonu.
 * Tüm kurum liste/detay sayfalarında kullanılır.
 */
export default function PageHeader({ title, subtitle, actionLabel, actionTo, backTo, actions }) {
  const navigate = useNavigate()

  const goBack = () => {
    if (backTo) navigate(backTo)
    else navigate(-1)
  }

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={goBack}
          aria-label="Geri"
          className="p-1.5 -ml-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 truncate">{subtitle}</p>}
        </div>
      </div>

      {actions ? (
        <div className="flex-shrink-0 flex items-center gap-2">{actions}</div>
      ) : actionLabel && actionTo ? (
        <NavLink
          to={actionTo}
          className="flex-shrink-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          {actionLabel}
        </NavLink>
      ) : null}
    </div>
  )
}
