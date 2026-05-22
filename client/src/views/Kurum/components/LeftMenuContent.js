import { NavLink } from 'react-router-dom'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import MenuService from "../../../services/MenuService"
import { Icon } from '../../../utils/SVG'

export default function LeftMenuContent () {
    const project_id = useSelector(state => state.kurum.active_project_id)
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

    const disabledClass = "flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 dark:text-gray-600 cursor-not-allowed"

    return (
        <nav className="space-y-1">
            {menus && menus.map((menu) => {
                // Proje-bağlı öğeler (örn. Hisse Grupları) aktif proje seçili değilken devre dışı
                const needsProject = !!menu.project_id
                if (needsProject && !project_id) {
                    return (
                        <span key={menu._id} className={disabledClass} title="Önce bir proje seçin">
                            <Icon name={menu.svg_title} size={5} />
                            <span>{menu.menu_title}</span>
                        </span>
                    )
                }
                return (
                    <NavLink
                        key={menu._id}
                        to={`${menu.path}${needsProject ? "/" + project_id : ""}`}
                        className={linkClass}
                    >
                        <Icon name={menu.svg_title} size={5} />
                        <span>{menu.menu_title}</span>
                    </NavLink>
                )
            })}
        </nav>
    )
}
