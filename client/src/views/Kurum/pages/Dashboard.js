import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { ChevronLeftIcon } from "@heroicons/react/outline"
import { NavLink } from "react-router-dom"

import BuyukBasKurbanList from "./BuyukBasKurban/BuyukBasKurbanList"
import ProjectService from "../../../services/ProjectService"
import { setActiveProjectID } from "../../../store/reducers/kurum.dashboard"

function Dashboard() {
  const dispatch = useDispatch()
  const { project_id } = useParams()
  const [projectName, setProjectName] = useState("")

  useEffect(() => {
    dispatch(setActiveProjectID(project_id))

    const loadProject = async () => {
      try {
        const res = await ProjectService.get(project_id)
        if (res?.data?.project_name) setProjectName(res.data.project_name)
      } catch (_) { /* silent */ }
    }
    loadProject()
  }, [project_id])

  return (
    <>
      <div className="flex items-center gap-2 mb-5">
        <NavLink
          to="/kurum/project"
          aria-label="Projelere dön"
          className="p-1.5 -ml-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </NavLink>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {projectName || " "}
        </h1>
      </div>

      <BuyukBasKurbanList project_id={project_id} />
    </>
  )
}

export default Dashboard
