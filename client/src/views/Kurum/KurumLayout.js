import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

//import 'alpinejs';

import Header from './components/Header'
import LeftMenu from './components/LeftMenu';
import ErrorBoundary from '../components/ErrorBoundary';

function Kurum() {

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if(location.pathname === "/kurum" || location.pathname === "/kurum/") {
      navigate("/kurum/project")
    }
  }, [])

  // Kurum Layout içinde kurum token'ı Front Layout içinde user token'ı gönder - ikisi de aynı anda login olması durumunda token'ı ezmemesi için
  const isKurumAuth = useSelector((state) => state.auth.isKurum)
  const kurum = useSelector((state) => state.auth.kurum)
  if(isKurumAuth) axios.defaults.headers.common['Authorization'] = `Bearer ${kurum.token}`;

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      
      {isKurumAuth ? <LeftMenu /> : null}
      
      <div className="flex flex-col flex-1">
        {isKurumAuth ? <Header /> : null}
        
        <main className="h-full pb-16 overflow-y-auto">
          <div className="container p-6 mx-auto grid dark:text-gray-200">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
      
    </div>
  );
}

export default Kurum;
