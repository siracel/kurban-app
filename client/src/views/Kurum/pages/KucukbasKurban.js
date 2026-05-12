import Card from "../../components/Card"
import Title from "../../components/Title"
import Prev from "../../components/Prev"

function KucukbasKurban() {
  return (
    <Card>
      <div className="flex items-center justify-start mb-2">
        <Prev />
        <Title title={"Küçükbaş Kurban"} />
      </div>

      <div className="py-12 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Küçükbaş kurban yönetimi yakında hizmetinizde.
        </p>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
          Bu bölüm şu anda geliştirme aşamasındadır.
        </p>
      </div>
    </Card>
  )
}

export default KucukbasKurban
