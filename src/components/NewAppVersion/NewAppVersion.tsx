"use client"
import { memo, useEffect, useState } from "react"

const NewAppVersion = () => {
  const [updateStatus, setUpdateStatus] = useState<string>("")

  console.log("NewAppVersion...")

  useEffect(() => {
    if (window?.electronAPI) {
      console.log("-NewAppVersion onUpdateStatus-")

      // Suscribirse a actualizaciones de estado
      // window?.electronAPI.onUpdateStatus((status) => {
      //   console.log("NewAppVersion onUpdateStatus: ", status)
      // setUpdateStatus(status)
      setUpdateStatus("")
      // })

      // Verificar actualizaciones al montar el componente
      // window?.electronAPI.checkForUpdates()
    }

    return () => {
      // Cleanup si es necesario
    }
  }, [])

  const handleInstallUpdate = () => {
    // window.electronAPI.quitAndInstall()
  }

  if (!updateStatus) return null

  return (
    <>
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4">
        <p className="mb-2">{updateStatus}</p>
        {updateStatus.includes("descargada") && (
          <button
            onClick={handleInstallUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Instalar y Reiniciar
          </button>
        )}
      </div>
    </>
  )
}

export default memo(NewAppVersion)
