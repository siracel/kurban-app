import { useDispatch, useSelector } from 'react-redux'
import { adminLogout, setMobileMenu } from '../../../store/reducers/admin'

function Header() {
  const dispatch = useDispatch()
  const mobileMenu = useSelector(state => state.admin.mobileMenu)

  return (
    <header className="z-10 bg-white shadow-sm md:rounded-2xl border-b md:border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            className="p-1 -ml-1 mr-3 rounded-md md:hidden text-purple-600 focus:outline-none"
            onClick={() => dispatch(setMobileMenu(!mobileMenu))}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
            </svg>
          </button>
          <span className="font-bold text-gray-800 dark:text-gray-100">Admin Paneli</span>
        </div>

        <button
          type="button"
          onClick={() => dispatch(adminLogout())}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Çıkış
        </button>
      </div>
    </header>
  );
}

export default Header;
