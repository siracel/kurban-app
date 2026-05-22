import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { MoonIcon, SunIcon, CogIcon, LogoutIcon, ChevronDownIcon, PlusIcon, MenuIcon } from '@heroicons/react/outline'
import { kurumLogout } from '../../../store/reducers/auth'
import { setMobileMenu, setDark } from '../../../store/reducers/kurum.dashboard'

function Header() {
  const dispatch = useDispatch()
  const location = useLocation()
  const kurum = useSelector(state => state.auth.kurum)
  const mobileMenu = useSelector(state => state.kurum.mobileMenu)
  const isDark = useSelector(state => state.kurum.isDark)
  const active_project_id = useSelector(state => state.kurum.active_project_id)
  const [isAccountMenu, setIsAccountMenu] = useState(false)

  const logout = () => dispatch(kurumLogout())
  const toggleMobileMenu = () => dispatch(setMobileMenu(!mobileMenu))

  const html = document.querySelector('html')
  const toggleDarkTheme = () => {
    const next = !isDark
    dispatch(setDark(next))
    html.classList.toggle('dark', next)
  }

  useEffect(() => {
    html.classList.toggle('dark', isDark === true)
    dispatch(setMobileMenu(false))
  }, [])

  useEffect(() => { setIsAccountMenu(false) }, [location])

  const initial = (kurum.full_name || kurum.kurum_name || "?").charAt(0).toLocaleUpperCase('tr')

  return (
    <header className="z-10 bg-white shadow-sm md:rounded-2xl border-b md:border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">

        {/* Sol: marka */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="p-2 -ml-1 rounded-lg text-gray-500 md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Menü"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          <span className="hidden sm:flex flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white items-center justify-center text-sm font-bold">
            {initial}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">{kurum.kurum_name}</p>
            <p className="hidden sm:block text-xs text-gray-400 leading-tight">Yönetim Paneli</p>
          </div>
        </div>

        {/* Sağ: aksiyonlar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {active_project_id && (
            <NavLink
              to="/kurum/create-buyukbas"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Kurban Oluştur</span>
              <span className="sm:hidden">Kurban</span>
            </NavLink>
          )}

          <button
            onClick={toggleDarkTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Tema değiştir"
          >
            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* Hesap menüsü */}
          <div className="relative">
            <button
              onClick={() => setIsAccountMenu(v => !v)}
              className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-sm font-semibold">
                {initial}
              </span>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[8rem] truncate">{kurum.full_name}</span>
              <ChevronDownIcon className={`hidden md:block w-4 h-4 text-gray-400 transition-transform ${isAccountMenu ? "rotate-180" : ""}`} />
            </button>

            {isAccountMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsAccountMenu(false)} />
                <div className="absolute right-0 z-20 w-60 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{kurum.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{kurum.email}</p>
                  </div>
                  <div className="p-1.5">
                    <NavLink to="/kurum/setting" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <CogIcon className="w-5 h-5" /> Ayarlar
                    </NavLink>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogoutIcon className="w-5 h-5" /> Çıkış
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
