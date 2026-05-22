import { useEffect, useState, useMemo } from "react";
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { PlusIcon, ArrowRightIcon, TrashIcon, CalendarIcon, PencilIcon } from '@heroicons/react/outline';

import Loading from '../../../components/Loading';
import ProjectService from "../../../../services/ProjectService";
import { Icon } from "../../../../utils/SVG";
import Modal from '../../../molecules/modal';
import { setActiveProjectID } from "../../../../store/reducers/kurum.dashboard";

const fmtDate = (d) => {
  if (!d) return ""
  try {
    return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
  } catch (_) { return "" }
}

function ProjectList() {
  const kurum = useSelector(state => state.auth.kurum)
  const dispatch = useDispatch()

  const [projects, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState('');
  const [isDeleteModal, setDeleteModal] = useState({ isOpen: false });
  const [deleteID, setDeleteID] = useState('');
  const [rename, setRename] = useState({ isOpen: false, id: '', value: '' });
  const [renameLoading, setRenameLoading] = useState(false);

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

  const { activeProject, otherProjects } = useMemo(() => {
    if (!projects || projects.length === 0) return { activeProject: null, otherProjects: [] }
    const sorted = [...projects].sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
    return { activeProject: sorted[0], otherProjects: sorted.slice(1) }
  }, [projects])

  // Aktif (en son) projeyi global olarak seçili tut — böylece proje-bağlı
  // menüler (Hisse Grupları) her zaman aktif kalır.
  useEffect(() => {
    if (activeProject?._id) dispatch(setActiveProjectID(activeProject._id))
  }, [activeProject, dispatch])

  const askDelete = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
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

  const openRename = (e, project) => {
    e.preventDefault()
    e.stopPropagation()
    setRename({ isOpen: true, id: project._id, value: project.project_name })
  }

  const saveRename = async (e) => {
    e.preventDefault()
    const name = rename.value.trim()
    if (!name) return
    setRenameLoading(true)
    const res = await ProjectService.update(rename.id, { project_name: name })
    if (res.status === 200 && !res.data.error) {
      setProject(prev => prev.map(p => p._id === rename.id ? { ...p, project_name: name } : p))
      setRename({ isOpen: false, id: '', value: '' })
    }
    setRenameLoading(false)
  }

  if (loading) return <div className="py-16"><Loading loading={loading} /></div>

  if (projects.length === 0) {
    return (
      <>
        <div className="text-center py-14 px-4 bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
            <PlusIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-100">Henüz bir proje oluşturmadınız</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Kurban kesim dönemine başlamak için önce bir proje oluşturun. Her proje; hisse grupları, kurbanlar ve hissedar bilgilerini bir arada tutar.
          </p>
          <NavLink to="/kurum/create-project" className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
            İlk projeyi oluştur
          </NavLink>
        </div>
        <Modal result={deleteProject} data={isDeleteModal} />
      </>
    )
  }

  return (
    <>
      {/* Aktif proje — büyük, belirgin */}
      {activeProject && (
        <NavLink
          to={`/kurum/dashboard/${activeProject._id}`}
          className="group relative block overflow-hidden rounded-2xl p-6 sm:p-8 mb-8 bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Aktif Proje
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold truncate">{activeProject.project_name}</h2>
              {activeProject.createdAt && (
                <p className="mt-2 text-sm text-white/70 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" /> {fmtDate(activeProject.createdAt)}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => openRename(e, activeProject)}
                title="Yeniden adlandır"
                aria-label="Projeyi yeniden adlandır"
                className="p-2 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 text-sm font-medium backdrop-blur group-hover:bg-white/25 transition-colors">
                Yönet
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </NavLink>
      )}

      {/* Diğer projeler — görünür grid */}
      {otherProjects.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Diğer Projeler</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherProjects.map((project) => (
              <NavLink
                key={project._id}
                to={`/kurum/dashboard/${project._id}`}
                className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-md transition-all p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 pr-6 truncate">{project.project_name}</h4>
                  <ArrowRightIcon className="w-5 h-5 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                {project.createdAt && (
                  <p className="mt-2 text-xs text-gray-400 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" /> {fmtDate(project.createdAt)}
                  </p>
                )}

                <span className={`absolute bottom-4 right-4 animate-spin text-gray-400 ${deleteLoading === project._id ? "" : "hidden"}`}>
                  <Icon name="spin_loader_1" size={5} />
                </span>
                <div className={`absolute bottom-3 right-3 flex items-center gap-1 ${deleteLoading === project._id ? "hidden" : ""}`}>
                  <button
                    type="button"
                    onClick={(e) => openRename(e, project)}
                    title="Yeniden adlandır"
                    aria-label={`${project.project_name} projesini yeniden adlandır`}
                    className="p-1.5 text-gray-300 hover:text-purple-600 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => askDelete(e, project._id)}
                    title="Projeyi sil"
                    aria-label={`${project.project_name} projesini sil`}
                    className="p-1.5 text-gray-300 hover:text-red-500 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </NavLink>
            ))}
          </div>
        </>
      )}

      {rename.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-gray-500/75" onClick={() => setRename({ isOpen: false, id: '', value: '' })}>
          <form
            onSubmit={saveRename}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Projeyi Yeniden Adlandır</h3>
            <input
              autoFocus
              value={rename.value}
              onChange={(e) => setRename((p) => ({ ...p, value: e.target.value }))}
              placeholder="Proje adı"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRename({ isOpen: false, id: '', value: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={renameLoading || !rename.value.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {renameLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}

      <Modal result={deleteProject} data={isDeleteModal} />
    </>
  );
}

export default ProjectList;
