// import {NavLink} from 'react-router-dom'
import {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { kurumLogout } from '../../../store/reducers/auth'
import { setMobileMenu, setDark } from '../../../store/reducers/kurum.dashboard'

function Header() {
    const dispatch = useDispatch()
    const location = useLocation()
    const kurum = useSelector(state => state.auth.kurum)
    const [isAccountMenu, setIsAccountMenu] = useState(false)
    //const isKurum = useSelector(state => state.auth.isKurum)
    //const kurum = useSelector(state => state.auth.kurum)
    
    const logout = () => {
      dispatch(kurumLogout())
    }

    const mobileMenu = useSelector(state => state.kurum.mobileMenu)
    const isDark = useSelector(state => state.kurum.isDark)
    const active_project_id = useSelector(state => state.kurum.active_project_id)

    const toggleMobileMenu = () => {
      let status = mobileMenu ? false : true
      dispatch(setMobileMenu(status))
    }

    let html = document.querySelector('html'); 

    const toggleDarkTheme = () => {
      if(isDark === true) {
        dispatch(setDark(false))
        html.classList.remove('dark')
      } else {
        dispatch(setDark(true))
        html.classList.add('dark')
      }
    }

    useEffect(() => {
      if(isDark === true) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }

      dispatch(setMobileMenu(false))
    }, [])

    useEffect(() => {
      setIsAccountMenu(false)
    }, [location]);

    return (
        <header className="z-10 bg-white shadow-sm md:rounded-2xl border-b md:border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <div
            className="flex items-center justify-between h-16 px-6 text-purple-600 dark:text-purple-300"
          >

            <div className="flex items-center min-w-0">
              <button
                className="p-1 -ml-1 mr-3 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  ></path>
                </svg>
              </button>

              <span className="font-bold text-gray-800 dark:text-gray-100 truncate">
                {kurum.kurum_name}
              </span>
            </div>

            <ul className={`flex items-center flex-shrink-0 space-x-4 sm:space-x-6`}>
              {active_project_id ? (
                <li className="flex">
                  <NavLink
                    to="/kurum/create-buyukbas"
                    className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                  >
                    Kurban Oluştur+
                  </NavLink>
                </li>
              ) : null}
            <li className="flex">
                <button onClick={toggleDarkTheme} className="rounded-md focus:outline-none focus:shadow-outline-purple" aria-label="Toggle color mode">
                  <span className={`${isDark ? "hidden" : ""}`}>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                  </span>
                  
                  <span className={`${isDark ? "" : "hidden"}`}>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
                    </svg>
                  </span>
                </button>
              </li>
      
              <li className={` relative`}>
                <button
                  className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none p-1 px-2 ring-1 ring-purple-500/20"
                  onClick={() => {isAccountMenu ? setIsAccountMenu(false) : setIsAccountMenu(true)}}
                >
                  <span className='rounded-full'>
                    {kurum.full_name.charAt(0).toUpperCase()}
                  </span>
                </button>

                  <ul
                    className={` ${isAccountMenu ? '' : 'hidden'} absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700`}
                    aria-label="submenu"
                  >
                    <li className="flex cursor-pointer">
                      <span
                        className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
     
                      >
                        <svg
                          className="w-4 h-4 mr-3 stroke-2"
                          aria-hidden="true"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                        <span>Profil</span>
                      </span>
                    </li>
                    <li className="flex cursor-pointer">
                      <NavLink 
                        to={'/kurum/setting'}
                        className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      >
                        <svg
                          className="w-4 h-4 mr-3 stroke-2"
                          aria-hidden="true"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          ></path>
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>Ayarlar</span>
                      </NavLink>
                    </li>
                    <li className="flex cursor-pointer">
                      <span
                        className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        onClick={logout}
                      >
                        <svg
                          className="w-4 h-4 mr-3 stroke-2"
                          aria-hidden="true"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          ></path>
                        </svg>
                        <span>Çıkış</span>
                      </span>
                    </li>
                  </ul>
                
              </li>
            </ul>
          </div>
        </header>
    );
  }
  
  export default Header;
  