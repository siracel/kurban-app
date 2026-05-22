import { useState } from "react";
import PageHeader from "../../../components/PageHeader"
import AccountSettings from "./components/AccountSettings"
import GeneralSettings from "./components/GeneralSettings"
import MessageSettings from "./components/MessageSettings"

const tabs = [
  { id: "tab1", label: "Hesap Ayarları" },
  { id: "tab2", label: "Genel Ayarlar" },
  { id: "tab3", label: "Mesaj Ayarları" },
]

export default function Index() {
  const [activeTab, setActiveTab] = useState("tab1")

  return (
    <>
      <PageHeader title="Ayarlar" />

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t.id
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "tab1" && <AccountSettings />}
        {activeTab === "tab2" && <GeneralSettings />}
        {activeTab === "tab3" && <MessageSettings />}
      </div>
    </>
  )
}
