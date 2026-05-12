import { useEffect, useState, useMemo } from "react";
import { NavLink } from 'react-router-dom'
import { useSelector } from "react-redux"
import { PlusIcon, ArrowRightIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/outline';

import Loading from '../../../components/Loading';
import ProjectService from "../../../../services/ProjectService";
import { Icon } from "../../../../utils/SVG";
import Modal from '../../../molecules/modal';

function ProjectList() {
  const kurum = useSelector(state => state.auth.kurum)

  const [projects, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState('');
  const [isDeleteModal, setDeleteModal] = useState({ isOpen: false });
  const [deleteID, setDeleteID] = useState('');

  useEffect(() => {
    const getProjects = async () => {
      const request = await ProjectService.getAll({ kurum_id: kurum._id });
      if (request.status === 200) {
        setLoading(false)
        setProject(request.data)
      }
    }
    getProjects()
  }, [])

  const { activeProject, pastProjects } = useMemo(() => {
    if (!projects || projects.length === 0) return { activeProject: null, pastProjects: [] }
    const sorted = [...projects].sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime()
      const bDate = new Date(b.createdAt || 0).getTime()
      return bDate - aDate
    })
    return { activeProject: sorted[0], pastProjects: sorted.slice(1) }
  }, [projects])

  const askDelete = (id) => {
    setDeleteID(id)
    setDeleteModal({ isOpen: true, title: 'Proje Sil', message: 'Bu proje ve ilgili kurban kayıtlarını silmek istediğinize emin misiniz?' })
  }

  const deleteProject = async (result) => {
    setDeleteModal({ isOpen: false })
    if (!result) return

    setDeleteLoading(deleteID)
    const res = await ProjectService.delete({ kurum_id: kurum._id, id: deleteID });
    if (res.status === 200 && !res.data.error) {
      setProject(prev => prev.filter((p) => p._id !== deleteID))
    }
    setDeleteLoading('')
  }

  if (projects.length === 0 && !loading) {
    return (
      <>
        <div className="text-center py-14 px-4 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
            <PlusIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-100">Henüz bir proje oluşturmadınız</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Kurban kesim dönemine başlamak için önce bir proje oluşturun. Her proje; hisse grupları, kurbanlar ve hissedar bilgilerini bir arada tutar.
          </p>
          <NavLink
            to="/kurum/create-project"
            className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            İlk projeyi oluştur
          </NavLink>
        </div>
        <Modal result={deleteProject} data={isDeleteModal} />
      </>
    )
  }

  return (
    <>
      <Loading loading={loading} />

      {activeProject && (
        <NavLink
          to={`/kurum/dashboard/${activeProject._id}`}
          className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-md transition-all p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-block text-xs uppercase tracking-wider font-medium text-purple-600 dark:text-purple-400 mb-1">
                Aktif Proje
              </span>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {activeProject.project_name}
              </h2>
            </div>
            <ArrowRightIcon className="w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
        </NavLink>
      )}

      {pastProjects.length > 0 && (
        <details className="mt-8 group">
          <summary className="flex items-center justify-between cursor-pointer list-none px-1 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <span>Geçmiş projeler ({pastProjects.length})</span>
            <ChevronDownIcon className="w-4 h-4 group-open:rotate-180 transition-transform" />
          </summary>

          <ul className="mt-2 space-y-1">
            {pastProjects.map((project) => (
              <li
                key={project._id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <NavLink
                  to={`/kurum/dashboard/${project._id}`}
                  className="flex-grow px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {project.project_name}
                </NavLink>

                <span className={`animate-spin text-gray-500 text-xs px-2 ${deleteLoading === project._id ? "" : "hidden"}`}>
                  <Icon name="spin_loader_1" />
                </span>

                <button
                  type="button"
                  onClick={() => askDelete(project._id)}
                  title="Projeyi sil"
                  aria-label={`${project.project_name} projesini sil`}
                  className={`mr-2 p-1.5 text-gray-400 hover:text-red-500 rounded ${deleteLoading === project._id ? "hidden" : ""}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      <Modal result={deleteProject} data={isDeleteModal} />
    </>
  );
}

export default ProjectList;
