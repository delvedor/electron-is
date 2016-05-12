/*
 * Project: electron-is
 * Version: 2.0.0
 * Author: delvedor
 * Twitter: @delvedor
 * License: MIT
 * GitHub: https://github.com/delvedor/electron-is
 */

'use strict'

;(function () {
  const { gt, lt } = require('semver')
  const { release } = require('os')
  const isDev = require('electron-is-dev')
  const macReleases = {
    // osx: darwin
    '10.5.0': '9.0',
    '10.5.8': '9.8',
    '10.6.0': '10.0',
    '10.6.8': '10.8',
    '10.7.0': '11.0.0',
    '10.7.5': '11.4.2',
    '10.8.0': '12.0.0',
    '10.8.5': '12.6.0',
    '10.9.0': '13.0.0',
    '10.9.5': '13.4.0',
    '10.10.0': '14.0.0',
    '10.10.5': '14.5.0',
    '10.11.0': '15.0.0',
    '10.11.4': '15.4.0'
  }

  // Constructor
  function IsApi () {}

  // Checks if we are in renderer process
  IsApi.prototype.renderer = function () {
    return process.type === 'renderer'
  }

  // Checks if we are in main process
  IsApi.prototype.main = function () {
    return process.type === 'browser'
  }

  // Checks if we are under Mac OS
  IsApi.prototype.osx = function () {
    return process.platform === 'darwin'
  }

  // Checks if we are under Windows OS
  IsApi.prototype.windows = function () {
    return process.platform === 'win32'
  }

  // Checks if we are under Linux OS
  IsApi.prototype.linux = function () {
    return process.platform === 'linux'
  }

  // Checks if we are the processor's arch is x86
  IsApi.prototype.x86 = function () {
    return process.arch === 'ia32'
  }

  // Checks if we are the processor's arch is x64
  IsApi.prototype.x64 = function () {
    return process.arch === 'x64'
  }

  // Checks if the env is setted to 'production'
  IsApi.prototype.production = function () {
    return !isDev
  }

  // Checks if the env is setted to 'dev'
  IsApi.prototype.dev = function () {
    return isDev
  }

  // checks if all the 'is functions' passed as arguments are true
  IsApi.prototype.all = function (...isFunctions) {
    if (!isFunctions.length) return
    for (let i = 0; i < isFunctions.length; i++) {
      if (!isFunctions[i]()) return false
    }
    return true
  }

  // checks if all the 'is functions' passed as arguments are false
  IsApi.prototype.none = function (...isFunctions) {
    if (!isFunctions.length) return
    for (let i = 0; i < isFunctions.length; i++) {
      if (isFunctions[i]()) return false
    }
    return true
  }

  // returns true if one of the 'is functions' passed as argument is true
  IsApi.prototype.one = function (...isFunctions) {
    if (!isFunctions.length) return
    for (let i = 0; i < isFunctions.length; i++) {
      if (isFunctions[i]()) return true
    }
    return false
  }

  // checks the if the given release is the same of the OS
  IsApi.prototype.release = function (requested) {
    if (this.osx() && macReleases[requested]) {
      return release() === macReleases[requested]
    } else if (this.windows()) {
      let requested = requested.split('.')
      let actual = release().split('.')
      if (requested.length === 2) {
        return `${actual[0]}.${actual[1]}` === `${requested[0]}.${requested[1]}`
      }
      return `${actual[0]}.${actual[1]}.${actual[2]}` === `${requested[0]}.${requested[1]}.${requested[2]}`
    } else {
      // Not implemented for Linux yet
      return null
    }
  }

  // checks if the given release is greater than the current OS release
  IsApi.prototype.gtRelease = function (requested) {
    if (this.osx() && macReleases[requested]) {
      return gt(macReleases[requested], release())
    } else if (this.windows()) {
      let requested = requested.split('.')
      let actual = release().split('.')
      if (requested.length === 2) {
        return gt(`${requested[0]}.${requested[1]}.0`, `${actual[0]}.${actual[1]}.0`)
      }
      return gt(`${requested[0]}.${requested[1]}.${requested[2]}`, `${actual[0]}.${actual[1]}.${actual[2]}`)
    } else {
      // Not implemented for Linux yet
      return null
    }
  }

  // checks if the given release is less than the current OS release
  IsApi.prototype.ltRelease = function (requested) {
    if (this.osx() && macReleases[requested]) {
      return lt(macReleases[requested], release())
    } else if (this.windows()) {
      let requested = requested.split('.')
      let actual = release().split('.')
      if (requested.length === 2) {
        return lt(`${requested[0]}.${requested[1]}.0`, `${actual[0]}.${actual[1]}.0`)
      }
      return lt(`${requested[0]}.${requested[1]}.${requested[2]}`, `${actual[0]}.${actual[1]}.${actual[2]}`)
    } else {
      // Not implemented for Linux yet
      return null
    }
  }

  // new instace
  const is = new IsApi()

  // exports
  module.exports = is
})()
