import { NavLink } from 'react-router-dom'

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 text-white">
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
        KURBAN TAKİP
      </h1>
      <p className="mt-5 max-w-md text-base sm:text-lg text-white/80">
        Kurban organizasyonunuzu kolayca yönetin; hissedarları kaydedin,
        süreci takip edin ve bilgilendirme mesajlarını tek yerden gönderin.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <NavLink
          to="/kurum/login"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-teal-700 font-semibold hover:bg-white/90 transition-colors"
        >
          Kurum Girişi
        </NavLink>
        <NavLink
          to="/kurum/register"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/60 text-white font-semibold hover:bg-white/10 transition-colors"
        >
          Kurum Kaydı
        </NavLink>
      </div>
    </div>
  )
}
