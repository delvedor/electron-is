'use strict'

const path = require('path')
const assert = require('assert')
const electron = require('electron')

const ipc = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const is = require('../is')
let mainWindow

app.on('ready', function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300
  })
  mainWindow.loadURL(path.join('file://', __dirname, '/test.html'))
  mainWindow.openDevTools()
  mainWindow.on('closed', function windowClosed () {
    app.quit()
  })
})

ipc.on('all-test-passed', (event) => {
  assertions(() => {
    console.log('All test passed!')
    setTimeout(() => {
      app.quit()
    }, 1000)
  })
})

function assertions (callback) {
  assert.equal(is.main(), process.type === 'browser', 'is.main() not ok!')
  assert.equal(is.renderer(), process.type === 'renderer', 'is.renderer() not ok!')
  assert.equal(is.standardBrowser(), false, 'is.standardBrowser() not ok!')

  assert.equal(is.osx(), process.platform === 'darwin', 'is.osx() not ok!')
  assert.equal(is.macOS(), process.platform === 'darwin', 'is.macOS() not ok!')
  assert.equal(is.windows(), process.platform === 'win32', 'is.windows() not ok!')
  assert.equal(is.linux(), process.platform === 'linux', 'is.linux() not ok!')

  assert.equal(is.x86(), process.arch === 'ia32', 'is.x86() not ok!')
  assert.equal(is.x64(), process.arch === 'x64', 'is.x64() not ok!')

  assert.equal(is.production(), (process.env.NODE_ENV || 'dev') === 'production', 'is.production() not ok!')
  assert.equal(is.dev(), (process.env.NODE_ENV || 'dev') === 'dev', 'is.dev() not ok!')

  assert.equal(is.sandbox(), ('APP_SANDBOX_CONTAINER_ID' in process.env), 'is.sandbox() not ok!')
  assert.equal(is.mas(), process.mas === true, 'is.mas() not ok!')
  assert.equal(is.windowsStore(), process.windowsStore === true, 'is.windowsStore() not ok!')

  assert.equal(is.all(is.osx, is.x64), is.osx() && is.x64(), 'is.all() 1 not ok!')
  assert.equal(is.all(is.osx, is.x86), is.osx() && is.x86(), 'is.all() 2 not ok!')
  assert.equal(is.none(is.windows, is.x86), !is.windows() && !is.x86(), 'is.none() 1 not ok!')
  assert.equal(is.none(is.windows, is.x64), !is.windows() && !is.x64(), 'is.none() 2 not ok!')
  assert.equal(is.one(is.windows, is.osx), is.windows() || is.osx(), 'is.one() 1 not ok!')
  assert.equal(is.one(is.windows, is.linux), is.windows() || is.linux(), 'is.one() 2 not ok!')

  if (is.osx()) {
    // mac el capitan
    assert.equal(is.release('10.11.6'), true, 'is.release() not ok!')

    assert.equal(is.gtRelease('10.11.6'), false, 'is.gtRelease() 1 not ok!')
    assert.equal(is.gtRelease('10.12.0'), true, 'is.gtRelease() 2 not ok!')
    assert.equal(is.gtRelease('10.8.0'), false, 'is.gtRelease() 3 not ok!')

    assert.equal(is.ltRelease('10.11.6'), false, 'is.ltRelease() 1 not ok!')
    assert.equal(is.ltRelease('10.12.0'), false, 'is.ltRelease() 2 not ok!')
    assert.equal(is.ltRelease('10.8.0'), true, 'is.ltRelease() 3 not ok!')
  } else if (is.windows()) {
    // tests Windows 10 AU
    assert.equal(is.release('10.0'), true, 'is.release() not ok!')
    assert.equal(is.release('10.0.14393'), true, 'is.release() not ok!')
  } else {
    assert.equal(is.release('1.2.3'), false, 'is.release() not ok!')
  }

  callback()
}
