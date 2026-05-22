import { useState } from 'react'
import { UserIcon, UsersIcon, DocumentTextIcon } from '@heroicons/react/outline'
import Input from "../../components/Input"
import Button from "../../components/Button"
import Textarea from "../../components/Textarea"
import { formatGsmInput, formatGsm, normalizeGsm } from "../../../utils/gsm"

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </span>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      {children}
    </div>
  )
}

/**
 * Hissedar ekleme/ortak formu. Kendi durumunu yönetir, submit'te
 * normalize edilmiş veriyi onSubmit(data) ile üst bileşene verir.
 */
export default function HissedarForm({ hissedars = [], loading, errors = [], onSubmit, submitLabel = "Hissedar Ekle", compact = false }) {
  const [showList, setShowList] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [formData, setFormData] = useState({
    hissedar_full_name: "",
    hissedar_address: "",
    hissedar_gsm: '',
    hissedar_note: "",
    referans_full_name: "",
    referans_gsm: '',
    kapora: 0,
    is_vekalet: false
  })
  const { hissedar_full_name, hissedar_address, hissedar_gsm, referans_full_name, referans_gsm, kapora, hissedar_note, is_vekalet } = formData

  const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const onChangeGsm = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: formatGsmInput(e.target.value) }))

  const onChangeHissedarName = (e) => {
    const value = e.target.value
    setFormData((prev) => ({ ...prev, hissedar_full_name: value }))
    const normalized = value.toLocaleLowerCase('tr')
    setSuggestions(hissedars.filter((h) => (h.hissedar_full_name || "").toLocaleLowerCase('tr').includes(normalized)))
    setShowList(true)
  }

  const selectSuggestion = (h) => {
    setFormData((prev) => ({ ...prev, hissedar_full_name: h.hissedar_full_name, hissedar_gsm: formatGsmInput(h.hissedar_gsm) }))
    setShowList(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      hissedar_full_name,
      hissedar_gsm: normalizeGsm(hissedar_gsm),
      hissedar_address,
      kapora,
      referans_full_name,
      referans_gsm: normalizeGsm(referans_gsm),
      is_vekalet,
      hissedar_note,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.key && (
        <div className="mb-4 p-3 rounded-lg bg-pink-50 border border-pink-200 text-sm text-pink-700">{errors.key}</div>
      )}

      <SectionCard icon={UserIcon} title="Hissedar Bilgileri">
        <div id="hissedar-autocomplete" className="relative">
          <Input
            value={hissedar_full_name}
            title="Hissedar Adı Soyadı"
            name="hissedar_full_name"
            onChange={onChangeHissedarName}
            onFocus={() => { setSuggestions(hissedars); setShowList(true) }}
            onBlur={() => setTimeout(() => setShowList(false), 150)}
            autoComplete="off"
            errors={errors}
            required
          />
          {showList && suggestions.length > 0 && (
            <ul className="absolute z-30 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-56 overflow-auto -mt-2">
              {suggestions.map((h) => (
                <li
                  key={h._id}
                  className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                  onMouseDown={() => selectSuggestion(h)}
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200">{h.hissedar_full_name}</span>
                  <span className="text-xs text-gray-400">{formatGsm(h.hissedar_gsm)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Input type="tel" value={hissedar_gsm} title="GSM" pholder="0XXX XXX XX XX" name="hissedar_gsm" onChange={onChangeGsm} errors={errors} required />
          <Input type="number" min={0} value={kapora} title="Kapora (₺)" name="kapora" onChange={onChange} errors={errors} />
        </div>

        {!compact && <Textarea value={hissedar_address} title="Adres" name="hissedar_address" onChange={onChange} errors={errors} />}
      </SectionCard>

      <SectionCard icon={UsersIcon} title="Referans (opsiyonel)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Input value={referans_full_name} title="Referans Adı Soyadı" name="referans_full_name" onChange={onChange} errors={errors} />
          <Input type="tel" value={referans_gsm} title="Referans GSM" pholder="0XXX XXX XX XX" name="referans_gsm" onChange={onChangeGsm} errors={errors} />
        </div>
      </SectionCard>

      <SectionCard icon={DocumentTextIcon} title="Notlar">
        <Textarea value={hissedar_note} title="Hissedar Notu" name="hissedar_note" onChange={onChange} errors={errors} />
        <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={is_vekalet}
            onChange={(e) => setFormData((prev) => ({ ...prev, is_vekalet: e.target.checked }))}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Vekaleti alınmıştır</span>
        </label>
      </SectionCard>

      <Button className="w-full py-3" disabled={loading}>
        {loading ? 'Ekleniyor...' : submitLabel}
      </Button>
    </form>
  )
}
