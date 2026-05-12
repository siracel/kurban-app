import { NavLink } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { useEffect } from 'react'
import ProjectList from './ProjectList'
import { setActiveProjectID } from "../../../../store/reducers/kurum.dashboard"

function Project() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setActiveProjectID(""))
  }, [])

  return (
    <>
      <div className="flex items-center justify-end mt-2 mb-4">
        <NavLink
          to={'/kurum/create-project'}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Proje Oluştur+
        </NavLink>
      </div>

      <ProjectList />
    </>
  );
}

export default Project;
