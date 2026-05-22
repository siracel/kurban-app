import { NavLink } from 'react-router-dom'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { CalendarIcon, ExternalLinkIcon } from '@heroicons/react/outline'
import MenuService from "../../../services/MenuService"
import { Icon } from '../../../utils/SVG'

export default function LeftMenuContent () {
    const project_id = useSelector(state => state.kurum.active_project_id)
    const kurum = useSelector(state => state.auth.kurum)
    const [menus, setMenus] = useState([])

    useEffect(() => {
        const getMenus = async () => {
            const request = await MenuService.getAll()
            setMenus(request.data)
        }
        getMenus()
    }, [])

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`

    return (
        <div className="flex flex-col h-full">
            <nav className="flex-1 space-y-1">
                {menus && menus.map((menu) => (
                    <NavLink
                        key={menu._id}
                        to={`${menu.path}${menu.project_id ? "/" + project_id : ""}`}
                        className={linkClass}
                    >
                        <Icon name={menu.svg_title} size={5} />
                        <span>{menu.menu_title}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-3 pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 space-y-1">
                <NavLink to={'/kurum/project'} className={linkClass}>
                    <CalendarIcon className="w-5 h-5" />
                    <span>Projeler</span>
                </NavLink>

                <a
                    href={`${window.location.origin}/onkayit/${kurum._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 mx-0 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <ExternalLinkIcon className="w-5 h-5" />
                    <span>Ön Kayıt Sayfası</span>
                </a>
            </div>
        </div>
    )
}
