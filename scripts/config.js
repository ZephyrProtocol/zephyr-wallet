const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const clientDir = path.join(rootDir, 'client');
const desktopAppDir = path.join(rootDir, 'zephyr-desktop-app');

const clientPublicDir = path.join(clientDir, 'public');
const clientBuildDir = path.join(clientDir, 'build');
const desktopClientDir = path.join(desktopAppDir, 'client');

const requiredDependencies = ['cross-env'];

const defaultSettings = {
    version: '2.1.1',
    defaultNetTypeId: '0', // 0 = Mainnet, 1 = Testnet, 2 = Stagenet
    zephyrCoreFilesPattern: file => file.startsWith('MoneroWebWorker') || file.startsWith('monero'),
    zephyrBuildFilesPattern: file => file.startsWith('ZephyrWebWorker') || file.startsWith('zephyr')
};

const envVars = {
    netTypeId: 'REACT_APP_NET_TYPE_ID',
    desktopDevelopment: 'ZEPHYR_DESKTOP_DEVELOPMENT',
    nodeInstaller: 'NODE_INSTALLER',
    appVersion: 'REACT_APP_VERSION',
    zephyrDirectHost: 'REACT_APP_ZEPHYR_DIRECT_HOST'
};

module.exports = {
    paths: {
        rootDir,
        clientDir,
        desktopAppDir,
        clientPublicDir,
        clientBuildDir,
        desktopClientDir
    },
    dependencies: {
        required: requiredDependencies
    },
    defaults: defaultSettings,
    envVars
};