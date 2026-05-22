import { NavLink } from 'react-router-dom'
import { useSelector } from "react-redux"
import ProjectList from './ProjectList'

function Project() {
  const kurum = useSelector((state) => state.auth.kurum)

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Projeler</h1>
          <p className="text-sm text-gray-400">{kurum?.kurum_name}</p>
        </div>
        <NavLink
          to={'/kurum/create-project'}
          className="inline-flex items-center self-start sm:self-auto px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Proje Oluştur+
        </NavLink>
      </div>

      <ProjectList />
    </>
  );
}

export default Project;
