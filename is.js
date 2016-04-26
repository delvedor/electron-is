/*
 * Project: is-electron
 * Version: 1.0.1
 * Author: delvedor
 * Twitter: @delvedor
 * License: MIT
 * GitHub: https://github.com/delvedor/is-electron
 */

'use strict'

;(() => {
  // Constructor
  function IsApi () {}

  // Checks if we are in renderer process
  IsApi.prototype.renderer = () => {
    return process.type === 'renderer'
  }

  // Checks if we are in main process
  IsApi.prototype.main = () => {
    return process.type === 'browser'
  }

  // Checks if we are under Mac OS
  IsApi.prototype.mac = () => {
    return process.platform === 'darwin'
  }

  // Checks if we are under Windows OS
  IsApi.prototype.windows = () => {
    return process.platform === 'win32'
  }

  // Checks if we are under Linux OS
  IsApi.prototype.linux = () => {
    return process.platform === 'linux'
  }

  // Checks if we are the processor's arch is is32
  IsApi.prototype.ia32 = () => {
    return process.arch === 'ia32'
  }

  // Checks if we are the processor's arch is x64
  IsApi.prototype.x64 = () => {
    return process.arch === 'x64'
  }

  // Checks if the env is setted to 'production'
  IsApi.prototype.production = () => {
    return (process.env.NODE_ENV || 'dev') === 'production'
  }

  // Checks if the env is setted to 'dev'
  IsApi.prototype.dev = () => {
    return (process.env.NODE_ENV || 'dev') === 'dev'
  }

  // checks if all the 'is functions' passed as arguments are true
  IsApi.prototype.all = (...isFunctions) => {
    if (!isFunctions.length) return
    for (let i = 0; i < isFunctions.length; i++) {
      if (!isFunctions[i]()) return false
    }
    return true
  }

  // checks if all the 'is functions' passed as arguments are false
  IsApi.prototype.none = (...isFunctions) => {
    if (!isFunctions.length) return
    for (let i = 0; i < isFunctions.length; i++) {
      if (isFunctions[i]()) return false
    }
    return true
  }

  // new instace
  const is = new IsApi()

  // exports
  if (is.renderer() && window) {
    if (!window.is) window.is = is
    window.isElectron = is
  } else {
    module.exports = is
  }
})()
