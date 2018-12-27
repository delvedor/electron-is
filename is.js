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

const isOSX = process.platform === 'darwin'

module.exports = {
  // Checks if we are in renderer process
  renderer: process.type === 'renderer',
  // Checks if we are in main process
  main: process.type === 'browser',
  // Checks if we are under Mac OS
  osx: isOSX,
  // Checks if we are under Mac OS
  macOS: isOSX,
  // Checks if we are under Windows OS
  windows: process.platform === 'win32',
  // Checks if we are under Linux OS
  linux: process.platform === 'linux',
  // Checks if we are the processor's arch is x86
  x86: process.arch === 'ia32',
  // Checks if we are the processor's arch is x64
  x64: process.arch === 'x64',
  // Checks if the env is setted to 'production'
  production: !isDev,
  // Checks if the env is setted to 'dev'
  dev: isDev,
  // Checks if the app is running in a sandbox on macOS
  sandbox: 'APP_SANDBOX_CONTAINER_ID' in process.env,
  // Checks if the app is running as a Mac App Store build
  mas: process.mas === true,
  // Checks if the app is running as a Windows Store (appx) build
  windowsStore: process.windowsStore === true,
  // checks if all the arguments are true
  all: function () {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] !== true) return false
    }
    return true
  },
  // checks if all the arguments are false
  none: function () {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] !== false) return false
    }
    return true
  },
  // returns true if one of the arguments is true
  one: function () {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] === true) return true
    }
    return false
  },
  // checks the if the given release is the same of the OS
  release: function (requested) {
    if (this.osx) {
      return requested === osxRelease()
    } else if (this.windows) {
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
    if (this.osx) {
      return gt(requested, osxRelease())
    } else if (this.windows) {
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
    if (this.osx) {
      return lt(requested, osxRelease())
    } else if (this.windows) {
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
