import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom';
import LeftMenuContent from './LeftMenuContent';
import { setMobileMenu } from "../../../store/reducers/admin"
import { useEffect } from 'react';

function LeftMenu() {
    const mobileMenu = useSelector(state => state.admin.mobileMenu)
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
      dispatch(setMobileMenu(false))
    }, [location]);

    return (
      <>
        {/* Desktop */}
        <aside className="z-20 hidden md:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <span className="font-bold text-gray-800 dark:text-gray-100">Kurban App</span>
            <span className="block text-xs text-gray-400">Yönetim Paneli</span>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <LeftMenuContent />
          </div>
        </aside>

        {/* Mobile */}
        <div className={`${mobileMenu ? "" : "hidden"} fixed inset-y-0 left-0 z-20 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl md:hidden`}>
          <div className="py-4">
            <LeftMenuContent />
          </div>
        </div>
      </>
    );
}

export default LeftMenu;
