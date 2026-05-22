import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Header from './components/Header'
import LeftMenu from './components/LeftMenu'
import ErrorBoundary from '../components/ErrorBoundary'

function AdminLayout() {

  const isAdminAuth = useSelector((state) => state.admin.isAdmin)
  const admin = useSelector((state) => state.admin)
  if (isAdminAuth) axios.defaults.headers.common['Authorization'] = `Bearer ${admin.admin.token}`;

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900 md:p-4 md:gap-4'>

      <LeftMenu />

      <div className="flex flex-col flex-1 min-w-0 md:gap-4">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-2 dark:text-gray-200">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>

    </div>
  );
}

export default AdminLayout;
