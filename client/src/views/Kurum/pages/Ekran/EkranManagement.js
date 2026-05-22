import { NavLink } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { useEffect, useState } from "react";
import EkranService from "../../../../services/EkranService";
import {useSelector} from "react-redux"

//import {NavLink} from 'react-router-dom'
function Ekran() {

  const kurum = useSelector((state) => state.auth.kurum)
  const [loading, setLoading] = useState(true);
  const [ekran, setEkran] = useState([]);

  useEffect(() => {
    const getEkran = async () => {
      const request = await EkranService.getAll({kurum_id: kurum._id});
      setLoading(false)
      if(request.status === 200) setEkran(request.data)
    }
    getEkran()
  }, [])

    return (
      <>
        <PageHeader
          title="Ekran Yönetimi"
          actions={
            <>
              <NavLink to={"/kurum/create-ekran-static"} className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                Statik Ekran+
              </NavLink>
              <NavLink to={"/kurum/create-ekran-dynamic"} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                Dinamik Ekran+
              </NavLink>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ekran.map((screen) => (
            <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm" key={screen._id}>
              <div className="p-5 font-medium text-gray-800 dark:text-gray-200">
                {screen.screen_title}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/40 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer">
                  Sil
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={`${loading ? "" : "hidden"} py-12 text-center text-gray-400`}>
          <span>Yükleniyor...</span>
        </div>

        <div className={`${!loading && ekran.length === 0 ? "" : "hidden"} py-12 text-center text-gray-400`}>
          <span>Henüz bir ekran oluşturmadınız.</span>
        </div>
      </>
    );
  }
  
  export default Ekran;
  