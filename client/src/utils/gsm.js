// Telefon numarası standardı (Türkiye GSM)
// - digitsOnly: sadece rakamlar
// - normalizeGsm: 10 haneli ulusal forma indirger (baştaki 90 / 0 atılır)
// - formatGsm: okunur biçim "0XXX XXX XX XX"

export function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "")
}

export function normalizeGsm(value) {
  let d = digitsOnly(value)
  if (d.startsWith("90")) d = d.slice(2)
  if (d.startsWith("0")) d = d.slice(1)
  return d.slice(0, 10) // en fazla 10 hane
}

export function formatGsm(value) {
  const d = normalizeGsm(value)
  if (d.length !== 10) return value ? String(value) : "" // tam değilse olduğu gibi göster
  return `0${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`
}

// input yazarken canlı formatla (kısmi de olsa)
export function formatGsmInput(value) {
  const d = normalizeGsm(value)
  if (!d) return ""
  let out = "0" + d.slice(0, 3)
  if (d.length > 3) out += " " + d.slice(3, 6)
  if (d.length > 6) out += " " + d.slice(6, 8)
  if (d.length > 8) out += " " + d.slice(8, 10)
  return out
}

export function isValidGsm(value) {
  return normalizeGsm(value).length === 10
}
