import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { CheckCircleIcon } from "@heroicons/react/solid"

import BKurbanService from "../../../services/BKurbanService"
import HisseGroupService from "../../../services/HisseGroupService"
import ProcessService from "../../../services/ProcessService"
import MessageService from "../../../services/MessageService"
import { Icon } from "../../../utils/SVG"

/**
 * Always-visible setup shortcuts shown on the dashboard.
 * - No counts (UX preference: stats not wanted).
 * - When a section has no content yet, shows an empty-circle marker so the
 *   user can spot what still needs setup. When populated, shows a green check.
 */
export default function WorkflowSteps({ project_id }) {
  const kurum = useSelector((state) => state.auth.kurum)
  const [status, setStatus] = useState({
    hisseGroups: null,
    processes: null,
    templates: null,
    hissedars: null,
  })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [hg, pr, mt, kb] = await Promise.all([
          HisseGroupService.getByProject({ project_id }),
          ProcessService.getAll({ kurum_id: kurum._id }),
          MessageService.getAll({ kurum_id: kurum._id }),
          BKurbanService.getAll({ kurum_id: kurum._id, project_id }),
        ])
        if (cancelled) return
        const hasHissedars = (kb?.data || []).some(k => (k.hisse || []).length > 0)
        setStatus({
          hisseGroups: (hg?.data?.length ?? 0) > 0,
          processes: (pr?.data?.length ?? 0) > 0,
          templates: (mt?.data?.length ?? 0) > 0,
          hissedars: hasHissedars,
        })
      } catch (_) { /* silent */ }
    }
    load()
    return () => { cancelled = true }
  }, [project_id, kurum._id])

  const shortcuts = [
    { key: "hisseGroups", label: "Hisse Grupları", to: `/kurum/hisse-grup/${project_id}`, iconName: "hissedar_group", done: status.hisseGroups },
    { key: "hissedars", label: "Hissedarlar", to: "/kurum/hissedar", iconName: "hissedar", done: status.hissedars },
    { key: "processes", label: "İşlem Adımları", to: "/kurum/process", iconName: "process", done: status.processes },
    { key: "templates", label: "Mesaj Şablonları", to: "/kurum/message-template", iconName: "message_template", done: status.templates },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-2">
      {shortcuts.map((s) => (
        <NavLink
          key={s.key}
          to={s.to}
          className="group flex items-center gap-3 px-3 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-sm transition-all"
        >
          <span className="flex-shrink-0 text-gray-500 group-hover:text-purple-600 dark:text-gray-400">
            <Icon name={s.iconName} />
          </span>
          <span className="flex-grow text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {s.label}
          </span>
          {s.done === true ? (
            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" aria-label="Tamamlandı" />
          ) : s.done === false ? (
            <span className="w-3 h-3 rounded-full border-2 border-orange-300 flex-shrink-0" aria-label="Eksik" />
          ) : null}
        </NavLink>
      ))}
    </div>
  )
}
