import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom';
import LeftMenuContent from '../components/LeftMenuContent';
import {setMobileMenu} from  "../../../store/reducers/kurum.dashboard"
import { useEffect } from 'react';

function LeftMenu() {

    const mobileMenu = useSelector(state => state.kurum.mobileMenu)

    const dispatch = useDispatch()
    const location = useLocation()


    useEffect(() => {
      //const currentPath = location.pathname;
      //const searchParams = new URLSearchParams(location.search);
      dispatch(setMobileMenu(false))
    }, [location]);
    
    
    return (
      <>
        {/* Desktop */}
        <aside className="z-20 hidden md:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
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