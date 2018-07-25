/*
 * Project: electron-is
 * Version: 3.0.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: MIT
 * GitHub: https://github.com/delvedor/electron-is
 */
'use strict'

const semver = require('semver')
const gt = semver.gt
const lt = semver.lt
const release = require('os').release
const isDev = require('electron-is-dev')

module.exports = {
  // Checks if we are in renderer process
  renderer: function () {
    return process.type === 'renderer'
  },
  // Checks if we are in main process
  main: function () {
    return process.type === 'browser'
  },
  // Checks if we are under Mac OS
  osx: function () {
    return process.platform === 'darwin'
  },
  // Checks if we are under Mac OS
  macOS: function () {
    return this.osx()
  },
  // Checks if we are under Windows OS
  windows: function () {
    return process.platform === 'win32'
  },
  // Checks if we are under Linux OS
  linux: function () {
    return process.platform === 'linux'
  },
  // Checks if we are the processor's arch is x86
  x86: function () {
    return process.arch === 'ia32'
  },
  // Checks if we are the processor's arch is x64
  x64: function () {
    return process.arch === 'x64'
  },
  // Checks if the env is setted to 'production'
  production: function () {
    return !isDev
  },
  // Checks if the env is setted to 'dev'
  dev: function () {
    return isDev
  },
  // Checks if the app is running in a sandbox on macOS
  sandbox: function () {
    return 'APP_SANDBOX_CONTAINER_ID' in process.env
  },
  // Checks if the app is running as a Mac App Store build
  mas: function () {
    return process.mas === true
  },
  // Checks if the app is running as a Windows Store (appx) build
  windowsStore: function () {
    return process.windowsStore === true
  },
  // checks if all the 'is functions' passed as arguments are true
  all: function () {
    const isFunctions = new Array(arguments.length)
    for (var i = 0; i < isFunctions.length; i++) {
      isFunctions[i] = arguments[i]
    }
    if (!isFunctions.length) return
    for (i = 0; i < isFunctions.length; i++) {
      if (!isFunctions[i]()) return false
    }
    return true
  },
  // checks if all the 'is functions' passed as arguments are false
  none: function () {
    const isFunctions = new Array(arguments.length)
    for (var i = 0; i < isFunctions.length; i++) {
      isFunctions[i] = arguments[i]
    }
    if (!isFunctions.length) return
    for (i = 0; i < isFunctions.length; i++) {
      if (isFunctions[i]()) return false
    }
    return true
  },
  // returns true if one of the 'is functions' passed as argument is true
  one: function () {
    const isFunctions = new Array(arguments.length)
    for (var i = 0; i < isFunctions.length; i++) {
      isFunctions[i] = arguments[i]
    }
    if (!isFunctions.length) return
    for (i = 0; i < isFunctions.length; i++) {
      if (isFunctions[i]()) return true
    }
    return false
  },
  // checks the if the given release is the same of the OS
  release: function (requested) {
    if (this.osx()) {
      return requested === osxRelease()
    } else if (this.windows()) {
      requested = requested.split('.')
      const actual = release().split('.')
      if (requested.length === 2) {
        return `${actual[0]}.${actual[1]}` === `${requested[0]}.${requested[1]}`
      }
      return `${actual[0]}.${actual[1]}.${actual[2]}` === `${requested[0]}.${requested[1]}.${requested[2]}`
    } else {
      // Not implemented for Linux yet
      return null
    }
  },
  // checks if the given release is greater than the current OS release
  gtRelease: function (requested) {
    if (this.osx()) {
      return gt(requested, osxRelease())
    } else if (this.windows()) {
      requested = requested.split('.')
      const actual = release().split('.')
      if (requested.length === 2) {
        return gt(`${requested[0]}.${requested[1]}.0`, `${actual[0]}.${actual[1]}.0`)
      }
      return gt(`${requested[0]}.${requested[1]}.${requested[2]}`, `${actual[0]}.${actual[1]}.${actual[2]}`)
    } else {
      // Not implemented for Linux yet
      return null
    }
  },
  // checks if the given release is less than the current OS release
  ltRelease: function (requested) {
    if (this.osx()) {
      return lt(requested, osxRelease())
    } else if (this.windows()) {
      requested = requested.split('.')
      const actual = release().split('.')
      if (requested.length === 2) {
        return lt(`${requested[0]}.${requested[1]}.0`, `${actual[0]}.${actual[1]}.0`)
      }
      return lt(`${requested[0]}.${requested[1]}.${requested[2]}`, `${actual[0]}.${actual[1]}.${actual[2]}`)
    } else {
      // Not implemented for Linux yet
      return null
    }
  }
}

// returns the current osx release
function osxRelease () {
  const actual = release().split('.')
  return `10.${actual[0] - 4}.${actual[1]}`
}
