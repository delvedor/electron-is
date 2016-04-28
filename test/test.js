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

  assert.equal(is.mac(), process.platform === 'darwin', 'is.mac() not ok!')
  assert.equal(is.windows(), process.platform === 'win32', 'is.windows() not ok!')
  assert.equal(is.linux(), process.platform === 'linux', 'is.linux() not ok!')

  assert.equal(is.ia32(), process.arch === 'ia32', 'is.ia32() not ok!')
  assert.equal(is.x64(), process.arch === 'x64', 'is.x64() not ok!')

  assert.equal(is.production(), (process.env.NODE_ENV || 'dev') === 'production', 'is.production() not ok!')
  assert.equal(is.dev(), (process.env.NODE_ENV || 'dev') === 'dev', 'is.dev() not ok!')

  assert.equal(is.all(is.mac, is.x64), is.mac() && is.x64(), 'is.all() 1 not ok!')
  assert.equal(is.all(is.mac, is.ia32), is.mac() && is.ia32(), 'is.all() 2 not ok!')
  assert.equal(is.none(is.windows, is.ia32), !is.windows() && !is.ia32(), 'is.none() 1 not ok!')
  assert.equal(is.none(is.windows, is.x64), !is.windows() && !is.x64(), 'is.none() 2 not ok!')

  if (is.mac()) {
    // mac el capitan
    assert.equal(is.release('10.11.4'), true, 'is.release() not ok!')

    assert.equal(is.gtRelease('10.11.4'), false, 'is.gtRelease() 1 not ok!')
    assert.equal(is.gtRelease('10.12.0'), null, 'is.gtRelease() 2 not ok!')
    assert.equal(is.gtRelease('10.8.0'), false, 'is.gtRelease() 3 not ok!')

    assert.equal(is.ltRelease('10.11.4'), false, 'is.ltRelease() 1 not ok!')
    assert.equal(is.ltRelease('10.12.0'), null, 'is.ltRelease() 2 not ok!')
    assert.equal(is.ltRelease('10.8.0'), true, 'is.ltRelease() 3 not ok!')
  } else if (is.windows()) {
    // tests Windows 10
    assert.equal(is.release('10.0'), true, 'is.release() not ok!')
    assert.equal(is.release('10.0.10586'), true, 'is.release() not ok!')
  } else {
    assert.equal(is.release('1.2.3'), null, 'is.release() not ok!')
  }

  callback()
}
