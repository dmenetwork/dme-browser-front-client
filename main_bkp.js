/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  session,
  webContents,
} = require("electron")
const express = require("express")
const path = require("path")
const {
  default: installExtension,
  REDUX_DEVTOOLS,
} = require("electron-devtools-installer")
const sqlite3 = require("sqlite3").verbose()
const { autoUpdater } = require("electron-updater")
const log = require("electron-log")
require("events").EventEmitter.defaultMaxListeners = 15

// autoUpdater configuration and log
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "info"

let envConfig = null
let ENVIROMENT = "development"
let ELECTRON_MODE = "build"
let GH_TOKEN = ""

log.info("----- START MAIN JS -----")

try {
  // Try to load the configuration from different possible locations
  try {
    envConfig = require("./env-config")

    log.info("ENV from env-config.js: ", envConfig)

    ENVIROMENT = process.env.NODE_ENV || envConfig.NODE_ENV
    ELECTRON_MODE = process.env.ELECTRON_MODE || envConfig.ELECTRON_MODE
    GH_TOKEN = process.env.GH_TOKEN || envConfig.GH_TOKEN
  } catch (e) {
    // Si falla, intenta con la ruta absoluta
    envConfig = require(path.join(process.cwd(), "env-config"))

    log.info("ENV from process.cwd env-config.js: ", envConfig)

    ENVIROMENT = process.env.NODE_ENV || envConfig.NODE_ENV
    ELECTRON_MODE = process.env.ELECTRON_MODE || envConfig.ELECTRON_MODE
    GH_TOKEN = process.env.GH_TOKEN || envConfig.GH_TOKEN
  }
} catch (error) {
  console.warn("Could not load env-config.js, using fallback values:", error)

  // getting env from dotenv
  envConfig = require("dotenv").config({
    path: path.join(__dirname, ".env"),
  })

  log.info("ENV from dotenv: ", envConfig)

  ENVIROMENT = process.env.NODE_ENV || envConfig.parsed.NODE_ENV
  ELECTRON_MODE = process.env.ELECTRON_MODE || envConfig.parsed.ELECTRON_MODE
  GH_TOKEN = process.env.GH_TOKEN || envConfig.parsed.GH_TOKEN
}

const IS_BUILDING =
  ENVIROMENT === "production" || ELECTRON_MODE === "build" ? true : false

log.info("ENVIROMENT: ", ENVIROMENT)
log.info("ELECTRON_MODE: ", ELECTRON_MODE)
log.info("GH_TOKEN: ", GH_TOKEN)

const WINDOWS_TITLE =
  ENVIROMENT === "production"
    ? "dME Browser (beta)"
    : ENVIROMENT === "qa"
    ? `dME Browser - qa`
    : `dME Browser - dev`

let mainWindow = null
let server = null
const logo = path.join(__dirname, "./public/img/dme-logo.png")

let splashWindow = null // Ventana para el Splash Screen

const port = IS_BUILDING ? 3333 : 3003
const startUrl = `http://localhost:${port}`

if (ENVIROMENT === "production") {
  autoUpdater.setFeedURL({
    provider: "github",
    owner: "dmenetwork",
    repo: "browser-front",
    private: true,
    token: GH_TOKEN,
  })
}

// Ruta a la base de datos SQLite
const dbPath = path.join(
  app.getPath("userData"),
  // IS_BUILDING ? "database.db" : "database-dev.db"
  ENVIROMENT === "production" ? "database.db" : "database-dev.db"
)

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error al abrir la base de datos:", err)
        reject(err)
      } else {
        // Crear tablas en serie
        db.serialize(() => {
          db.run(
            `CREATE TABLE IF NOT EXISTS bookmarks (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              bookmarkId TEXT UNIQUE,
              url TEXT,
              icon TEXT,
              title TEXT,
              isBookmark INTEGER
            )`,
            (err) => {
              if (err) {
                console.error("Error al crear la tabla bookmarks:", err)
                reject(err)
              } else {
                console.log("Tabla bookmarks lista")
              }
            }
          )

          db.run(
            `CREATE TABLE IF NOT EXISTS allHistory (
              historyId INTEGER PRIMARY KEY AUTOINCREMENT,
              tabId TEXT,
              workspaceId TEXT,
              icon TEXT,
              url TEXT,
              title TEXT,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
              updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            (err) => {
              if (err) {
                console.error("Error al crear la tabla allHistory:", err)
                reject(err)
              } else {
                console.log("Tabla allHistory lista")
                db.close()
                resolve()
              }
            }
          )

          db.run(
            `CREATE TABLE IF NOT EXISTS workspaces (
              WorkspaceId TEXT PRIMARY KEY,
              Position INTEGER,
              Icon TEXT,
              Title TEXT,
              Color TEXT,
              IsActive INTEGER DEFAULT 0
            )`,
            (err) => {
              if (err) {
                console.error("Error al crear la tabla workspaces:", err)
                reject(err)
              } else {
                console.log("Tabla workspaces lista")
                db.close()
                resolve()
              }
            }
          )

          db.run(
            `CREATE TABLE IF NOT EXISTS lastSession (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              workspaceId TEXT,
              tabId TEXT,
              lastUrl TEXT,
              isActive INTEGER DEFAULT 0,
              createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
              updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
            )`,
            (err) => {
              if (err) {
                console.error("Error al crear la tabla lastSession:", err)
                reject(err)
              } else {
                console.log("Tabla lastSession lista")
                db.close()
                resolve()
              }
            }
          )
        })
      }
    })
  })
}

if (IS_BUILDING) {
  // EXPRESS CONFIGURATION FOR PRODUCTION BUILDING
  server = express()

  // Middleware para parsear JSON y URL-encoded
  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  // Serve static files from "out" folder
  server.use(express.static(path.join(__dirname, "out")))

  // Handle any missing routes by redirecting to index.html
  server.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "out", "index.html"))
  })
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    minWidth: 800,
    minHeight: 800,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
  })

  splashWindow.loadFile(path.join(__dirname, "splash.html"))

  splashWindow.on("closed", () => {
    splashWindow = null
  })
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,

    height: 950,
    minWidth: 800,
    minHeight: 300,
    frame: false,
    icon: logo,
    show: false,
    title: WINDOWS_TITLE,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      nativeWindowOpen: true,
      webviewTag: true,
      enableRemoteModule: false,
      session: session.fromPartition("persist:browser"),
    },
  })

  mainWindow.webContents.setMaxListeners(20)

  mainWindow.loadURL(startUrl)

  mainWindow.once("ready-to-show", () => {
    if (splashWindow) {
      splashWindow.close()
    }
    mainWindow.show()
  })

  mainWindow.on("close", (event) => {
    if (mainWindow) {
      console.log("Enviando app-closing al frontend antes de cerrar la ventana")

      // Enviar evento al frontend para que guarde la sesión
      mainWindow.webContents.send("app-closing")

      // Prevenir cierre inmediato para dar tiempo al frontend
      event.preventDefault()

      // Después de 1 segundo (u otro intervalo), cerrar la ventana
      setTimeout(() => {
        mainWindow.destroy()
      }, 200)
    }
  })

  mainWindow.on("closed", () => {
    mainWindow = null
    // Remove all associated listeners
    ipcMain.removeAllListeners("window-control")
    ipcMain.removeHandler("is-window-maximized")
  })

  if (ENVIROMENT !== "production") {
    // Habilitar herramientas de desarrollador
    mainWindow.webContents.on("context-menu", (event) => {
      event.preventDefault()
      const contextMenu = Menu.buildFromTemplate([
        {
          label: "Open DevTools",
          click: () => {
            mainWindow.webContents.openDevTools({ mode: "bottom" })
          },
        },
      ])

      contextMenu.popup(mainWindow)
    })
  }

  ipcMain.on("window-control", (event, command) => {
    if (!mainWindow) return

    switch (command) {
      case "minimize":
        mainWindow.minimize()
        break
      case "maximize":
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize()
        } else {
          mainWindow.maximize()
        }
        break
      case "close":
        mainWindow.close()
        break
    }
  })

  ipcMain.handle("is-window-maximized", () => {
    if (!mainWindow) return false
    return mainWindow.isMaximized()
  })
}

// Global error handler
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error)
  // Add logging or error reporting here
})

app.whenReady().then(async () => {
  if (ENVIROMENT === "production") {
    autoUpdater.checkForUpdatesAndNotify()
  }

  try {
    await initializeDatabase()

    if (IS_BUILDING && server) {
      await new Promise((resolve) => server.listen(port, resolve))
    }
    createSplashWindow()
    createWindow()
    if (ENVIROMENT !== "production") {
      await installExtension(REDUX_DEVTOOLS)
    }
  } catch (error) {
    console.error("Error during app initialization:", error)
  }

  // IPC Handlers
  ipcMain.handle(
    "get-cookies",
    async (event, { webContentsId = null, url = null, cookieName = null }) => {
      try {
        let cookies = null
        if (webContentsId) {
          const webviewWebContents = webContents.fromId(webContentsId)

          if (webviewWebContents && !webviewWebContents.isDestroyed()) {
            const currentURL = webviewWebContents.getURL()
            cookies = await session.defaultSession.cookies.get({
              url: currentURL,
            })
          } else {
            console.warn("Webview is not available or destroyed.")
            return []
          }
        } else if (url) {
          cookies = await session.defaultSession.cookies.get({ url })
        } else {
          cookies = await session.defaultSession.cookies.get({})
        }

        if (cookieName) {
          return cookies.filter((e) => e.name === cookieName)
        } else {
          return cookies
        }
      } catch (error) {
        console.error("Error in get-cookies handler:", error)
        throw error
      }
    }
  )

  ipcMain.handle(
    "delete-cookies",
    async (event, { webContentsId = null, url = null, cookieName = null }) => {
      try {
        let cookies = []
        if (webContentsId) {
          const webviewWebContents = webContents.fromId(webContentsId)

          if (webviewWebContents && !webviewWebContents.isDestroyed()) {
            const currentURL = webviewWebContents.getURL()
            cookies = await session.defaultSession.cookies.get({
              url: currentURL,
            })
          } else {
            throw new Error("Webview is not available or destroyed.")
          }
        } else if (url) {
          cookies = await session.defaultSession.cookies.get({ url })
        } else {
          cookies = await session.defaultSession.cookies.get({})
        }

        const cookiesToDelete = cookieName
          ? cookies.filter((cookie) => cookie.name === cookieName)
          : cookies

        await Promise.all(
          cookiesToDelete.map((cookie) =>
            session.defaultSession.cookies.remove(
              `http${cookie.secure ? "s" : ""}://${cookie.domain}${
                cookie.path
              }`,
              cookie.name
            )
          )
        )

        return true
      } catch (error) {
        console.error("Error deleting cookies:", error)
        throw error
      }
    }
  )

  ipcMain.handle(
    "get-localstorage",
    async (event, { webContentsId = null, url = null, key = null }) => {
      try {
        let wc
        if (webContentsId) {
          wc = webContents.fromId(webContentsId)
        } else if (url) {
          wc = webContents
            .getAllWebContents()
            .find((wc) => wc.getURL().startsWith(url))
        }

        if (!wc) {
          wc = event.sender
        }

        const result = await wc.executeJavaScript(`
        (() => {
          const localStorageData = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            localStorageData[key] = localStorage.getItem(key);
          }
          return localStorageData;
        })();
      `)

        if (key) {
          return result[key] || null
        }

        return result
      } catch (error) {
        console.error("Error in get-localstorage handler:", error)
        throw error
      }
    }
  )

  ipcMain.handle(
    "delete-localstorage",
    async (event, { webContentsId = null, key = null }) => {
      try {
        if (!webContentsId) {
          await mainWindow.webContents.session.clearStorageData({
            storages: ["localstorage"],
          })
          console.log("Local storage eliminated")
          return { success: true }
        }

        const webviewWebContents = webContents.fromId(webContentsId)

        if (webviewWebContents && !webviewWebContents.isDestroyed()) {
          if (key) {
            await webviewWebContents.executeJavaScript(
              `localStorage.removeItem("${key}");`
            )
          } else {
            await webviewWebContents.executeJavaScript(`localStorage.clear();`)
          }

          // Devolver todos los localStorage si no se proporciona `key`
          return result
        }
      } catch (error) {
        console.error("Error deleting local storage:", error)
        throw error
      }
    }
  )

  // Asocia cada TabId con su webContentsId
  let tabMap = new Map()

  ipcMain.on("webview-loaded", (event, { webContentsId, isMiniApp, TabId }) => {
    if (!webContentsId) {
      console.warn("Invalid webContentsId received")
      return
    }

    tabMap.set(TabId, webContentsId)
    // console.log("tabMap: ", tabMap)
    // console.log("TabId: ", TabId)

    const currentWebContentsId = tabMap.get(TabId)
    // console.log("currentWebContentsId: ", currentWebContentsId)

    // const webContentsInstance = webContents.fromId(webContentsId)
    const webContentsInstance = webContents.fromId(currentWebContentsId)

    if (webContentsInstance && !webContentsInstance.isDestroyed()) {
      webContentsInstance.setWindowOpenHandler((details) => {
        const { url, frameName, features, disposition, referrer, postBody } =
          details

        // console.log("----------------")
        // console.log("webContentsId: ", webContentsId)
        // console.log("TabId: ", TabId)
        // console.log("url: ", url)

        try {
          if (frameName && frameName !== "") {
            const popupWindow = new BrowserWindow({
              width: 600,
              height: 500,
              frame: true,
              icon: logo,
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
              },
            })

            popupWindow.loadURL(url)
            popupWindow.webContents.openDevTools({ mode: "bottom" })

            return { action: "deny" }
          } else {
            event.sender.send("new-tab-url", {
              url,
              frameName,
              features,
              disposition,
              referrer,
              postBody,
              isMiniApp,
              webContentsId,
              TabId,
            })
            return { action: "deny" }
          }
        } catch (err) {
          console.log("webview-loaded err: ", err)
          return { action: "deny" }
        }
      })
    } else {
      console.warn("WebContents not available or destroyed")
    }
  })

  // Guardar un Bookmark
  ipcMain.handle("save-bookmark", async (event, bookmarkData) => {
    const { bookmarkId, url, icon, title, isBookmark } = bookmarkData
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO bookmarks (bookmarkId, url, icon, title, isBookmark) VALUES (?, ?, ?, ?, ?)",
        [bookmarkId, url, icon, title, isBookmark ? 1 : 0],
        function (err) {
          if (err) {
            console.error("Error al guardar el bookmark:", err)
            reject(new Error("Error al guardar el bookmark: " + err.message))
          } else {
            resolve({ success: true, id: this.lastID, bookmarkId })
          }
        }
      )

      db.close()
    })
  })

  // Eliminar un Bookmark
  ipcMain.handle("delete-bookmark", async (event, bookmarkId) => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM bookmarks WHERE bookmarkId = ?",
        [bookmarkId],
        function (err) {
          if (err) {
            console.error("Error al eliminar el bookmark:", err)
            reject(new Error("Error al eliminar el bookmark: " + err.message))
          } else if (this.changes === 0) {
            reject(
              new Error("No se encontró el bookmark con el ID proporcionado.")
            )
          } else {
            resolve({
              success: true,
              message: `Bookmark con ID ${bookmarkId} eliminado exitosamente.`,
            })
          }
        }
      )

      db.close()
    })
  })

  // Actualizar un Bookmark
  ipcMain.handle("edit-bookmark", async (event, { bookmarkId, newTitle }) => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE bookmarks SET title = ? WHERE bookmarkId = ?",
        [newTitle, bookmarkId],
        function (err) {
          if (err) {
            console.error("Error al actualizar el bookmark:", err)
            reject(new Error("Error al actualizar el bookmark: " + err.message))
          } else if (this.changes === 0) {
            reject(
              new Error("No se encontró el bookmark con el ID proporcionado.")
            )
          } else {
            resolve({
              success: true,
              message: `Bookmark con ID ${bookmarkId} actualizado exitosamente.`,
            })
          }
        }
      )

      db.close()
    })
  })

  // Obtener Todos los Bookmarks
  ipcMain.handle("get-all-bookmarks", async (event) => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM bookmarks", [], (err, rows) => {
        if (err) {
          console.error("Error al obtener los bookmarks:", err)
          reject(new Error("Error al obtener los bookmarks: " + err.message))
        } else {
          resolve({ success: true, bookmarks: rows })
        }
      })

      db.close()
    })
  })

  // Guardar una Entrada de Historial
  ipcMain.handle("save-history", async (event, historyEntry) => {
    const { tabId, workspaceId, icon, url, title } = historyEntry
    const db = new sqlite3.Database(dbPath)

    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO allHistory (tabId, workspaceId, icon, url, title) VALUES (?, ?, ?, ?, ?)",
        [tabId, workspaceId, icon, url, title],
        function (err) {
          if (err) {
            console.error("Error al guardar la entrada de historial:", err)
            reject(
              new Error(
                "Error al guardar la entrada de historial: " + err.message
              )
            )
          } else {
            resolve({ success: true, lastID: this.lastID })
          }
        }
      )

      db.close()
    })
  })

  // Obtener Todo el Historial
  ipcMain.handle("get-all-history", async (event) => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM allHistory ORDER BY createdAt DESC",
        [],
        (err, rows) => {
          if (err) {
            console.error("Error al obtener el historial:", err)
            reject(new Error("Error al obtener el historial: " + err.message))
          } else {
            resolve({ success: true, allHistory: rows })
          }
        }
      )

      db.close()
    })
  })

  // Eliminar Todo el Historial
  ipcMain.handle("delete-all-history", async (event) => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM allHistory", function (err) {
        if (err) {
          console.error("Error al eliminar todo el historial:", err)
          reject(
            new Error("Error al eliminar todo el historial: " + err.message)
          )
        } else {
          resolve({ success: true, changes: this.changes })
        }
      })

      db.close()
    })
  })

  // Actualizar el Campo updatedAt de una Entrada en el Historial
  ipcMain.handle("update-history", async (event, tabId) => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE allHistory
       SET updatedAt = CURRENT_TIMESTAMP
       WHERE historyId = (
         SELECT historyId FROM allHistory
         WHERE tabId = ?
         ORDER BY createdAt DESC
         LIMIT 1
       )`,
        [tabId],
        function (err) {
          if (err) {
            console.error("Error al actualizar la entrada de historial:", err)
            reject(
              new Error(
                "Error al actualizar la entrada de historial: " + err.message
              )
            )
          } else if (this.changes === 0) {
            reject(
              new Error(
                "No se encontró una entrada de historial con el tabId proporcionado."
              )
            )
          } else {
            resolve({
              success: true,
              message: `Entrada de historial con tabId ${tabId} actualizada exitosamente.`,
            })
          }
        }
      )

      db.close()
    })
  })

  // Función para guardar múltiples workspaces (eliminando los anteriores)
  ipcMain.handle("save-workspace", (event, workspaces) => {
    const db = new sqlite3.Database(dbPath)

    return new Promise((resolve, reject) => {
      const queryInsert = `INSERT INTO workspaces (WorkspaceId, Position, Icon, Title, Color, IsActive) 
      VALUES (?, ?, ?, ?, ?, ?)`

      // Inicia una transacción para eliminar e insertar workspaces
      db.serialize(() => {
        db.run("BEGIN TRANSACTION")

        // Primero, eliminar todos los registros anteriores
        db.run("DELETE FROM workspaces", (err) => {
          if (err) {
            console.error("Error al eliminar los workspaces anteriores:", err)
            db.run("ROLLBACK") // Deshacer si hay un error
            return reject(err)
          }

          // Ahora, insertar los nuevos workspaces
          workspaces.forEach((workspace) => {
            const { WorkspaceId, Position, Icon, Title, Color, IsActive } =
              workspace
            db.run(
              queryInsert,
              [WorkspaceId, Position, Icon, Title, Color, IsActive ? 1 : 0],
              function (err) {
                if (err) {
                  console.error("Error al guardar el workspace:", err)
                  db.run("ROLLBACK") // Deshacer si hay un error
                  return reject(err)
                }
              }
            )
          })

          // Finalizamos la transacción
          db.run("COMMIT", (err) => {
            if (err) {
              console.error("Error al hacer commit de la transacción:", err)
              reject(err)
            } else {
              resolve({ success: true })
            }
          })
        })
      })
    })
  })

  // Función para obtener todos los workspaces
  ipcMain.handle("get-all-workspaces", () => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM workspaces ORDER BY position ASC`,
        [],
        (err, rows) => {
          if (err) {
            console.error("Error al obtener los workspaces:", err)
            reject(err)
          } else {
            resolve({ success: true, workspaces: rows })
          }
        }
      )
    })
  })

  // Función para eliminar un workspace
  ipcMain.handle("delete-workspace", (event, workspaceId) => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM workspaces WHERE workspaceId = ?`,
        [workspaceId],
        function (err) {
          if (err) {
            console.error("Error al eliminar el workspace:", err)
            reject(err)
          } else {
            resolve({ success: true })
          }
        }
      )
    })
  })

  // Función para actualizar un workspace
  ipcMain.handle("edit-workspace", (event, workspace) => {
    const db = new sqlite3.Database(dbPath)
    const { WorkspaceId, Icon, Title, Color } = workspace
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE workspaces SET icon = ?, title = ?, color = ? WHERE workspaceId = ?`,
        [Icon, Title, Color, WorkspaceId],
        function (err) {
          if (err) {
            console.error("Error al editar el workspace:", err)
            reject(err)
          } else {
            resolve({ success: true })
          }
        }
      )
    })
  })

  // Función para establecer el workspace activo
  ipcMain.handle("set-active-workspace", (event, workspaceId) => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(`UPDATE workspaces SET isActive = 0`) // Desactiva todos
        db.run(
          `UPDATE workspaces SET isActive = 1 WHERE workspaceId = ?`,
          [workspaceId],
          function (err) {
            if (err) {
              console.error("Error al actualizar el workspace activo:", err)
              reject(err)
            } else {
              resolve({ success: true })
            }
          }
        )
      })
    })
  })

  //SESSION HANDLERS

  // Guardar la última sesión en SQLite
  // Escuchar cuando se quiera guardar la sesión desde el frontend
  ipcMain.handle("save-session", async (event, { tabs }) => {
    try {
      saveSessionToDB(tabs)
      return { success: true }
    } catch (err) {
      console.error("Error al guardar la sesión:", err)
      return { success: false, error: err }
    }
  })

  // Restaurar la última sesión desde SQLite
  ipcMain.handle("restore-last-session", () => {
    const db = new sqlite3.Database(dbPath)
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM lastSession`, [], (err, rows) => {
        if (err) {
          reject(err)
        } else {
          const tabs = rows.map((row) => ({
            TabId: row.tabId,
            WorkspaceId: row.workspaceId,
            URL: row.lastUrl,
            IsActive: row.isActive === 1,
          }))

          resolve({ tabs })
        }
      })
    })
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// En el evento before-quit, capturamos el estado y guardamos la sesión
const saveSessionToDB = (tabs) => {
  const db = new sqlite3.Database(dbPath)

  // Limpia la tabla antes de guardar la nueva sesión
  db.run("DELETE FROM lastSession", (err) => {
    if (err) {
      console.error("Error al limpiar la tabla lastSession:", err)
    }

    // Insertar las tabs luego
    tabs.forEach((tab) => {
      db.run(
        `INSERT INTO lastSession (workspaceId, tabId, lastUrl, isActive) VALUES (?, ?, ?, ?)`,
        [tab.WorkspaceId, tab.TabId, tab.URL, tab.IsActive ? 1 : 0],
        (err) => {
          if (err) {
            console.error("Error al guardar tab en lastSession:", err)
          }
        }
      )
    })
  })

  db.close()
}

app.on("will-quit", () => {
  // Remove all listeners
  ipcMain.removeAllListeners()
  // Close all windows
  BrowserWindow.getAllWindows().forEach((window) => window.close())
})

// Desactivar la política de seguridad CORS de Chromium
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors")

if (ENVIROMENT === "production") {
  /*** Eventos del actualizador ***/
  // Manejo de eventos
  autoUpdater.on("checking-for-update", () => {
    console.log("Verificando actualizaciones...")
    // sendStatusToWindow("Checking for update...")
  })

  autoUpdater.on("update-available", (info) => {
    console.log("Una nueva versión está disponible:", info)
    // sendStatusToWindow("Update available.")
  })

  autoUpdater.on("update-not-available", (info) => {
    console.log("No hay actualizaciones disponibles.", info)
    // sendStatusToWindow("Update not available.")
  })

  autoUpdater.on("error", (err) => {
    console.error("Error en el proceso de actualización:", err)
    // sendStatusToWindow("Error in auto-updater. " + err)
  })

  autoUpdater.on("download-progress", (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond
    log_message = log_message + " - Downloaded " + progressObj.percent + "%"
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")"
    console.log(log_message)
    // sendStatusToWindow(log_message)
  })

  autoUpdater.on("update-downloaded", (info) => {
    console.log(
      "Actualización descargada; se instalará en el próximo reinicio.",
      info
    )
    // sendStatusToWindow("Update downloaded")
  })
}

log.info("----- END MAIN JS -----")
