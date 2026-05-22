import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HomeIcon, ChatIcon, LogoutIcon } from '@heroicons/react/outline'
import { adminLogout } from '../../../store/reducers/admin'

const menu = [
    { _id: 1, path: "/admin", icon: HomeIcon, title: "Kurumlar", end: true },
    { _id: 2, path: "/admin/message-api", icon: ChatIcon, title: "Mesaj API", end: false },
]

export default function LeftMenuContent() {
    const dispatch = useDispatch()

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`

    return (
        <div className="flex flex-col h-full">
            <nav className="flex-1 space-y-1">
                {menu.map((item) => (
                    <NavLink key={item._id} to={item.path} end={item.end} className={linkClass}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-3 pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => dispatch(adminLogout())}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span>Çıkış</span>
                </button>
            </div>
        </div>
    )
}
