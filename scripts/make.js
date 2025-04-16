const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('./config');

const { desktopAppDir } = config.paths;
const { desktopDevelopment, nodeInstaller } = config.envVars;

function cleanOutputDir() {
    console.log('Cleaning output directory...');
    const outDir = path.join(desktopAppDir, 'out');

    if (fs.existsSync(outDir)) {
        try {
            fs.rmSync(outDir, { recursive: true, force: true });
            console.log('Output directory cleaned successfully');
        } catch (err) {
            console.warn(`Warning: Could not clean output directory: ${err.message}`);
        }
    }
}

function make() {
    console.log('Building Zephyr Desktop App...');

    try {
        process.env[desktopDevelopment] = 'false';
        process.env[nodeInstaller] = 'npm';

        cleanOutputDir();

        const desktopPath = path.normalize(desktopAppDir);

        if (os.platform() === 'darwin' || process.env.ACTION_OS === 'macOS-latest') {
            console.log('Building for macOS with separate architecture steps...');

            console.log('Building for arm64 architecture...');
            execSync('npm run build && npx --no -- electron-forge make --arch=arm64', {
                stdio: 'inherit',
                cwd: desktopPath
            });

            console.log('Building for x64 architecture...');
            execSync('npm run build && npx --no -- electron-forge make --arch=x64', {
                stdio: 'inherit',
                cwd: desktopPath
            });

            console.log('Both architectures built successfully');
        } else {
            execSync('npm run make', {
                stdio: 'inherit',
                cwd: desktopPath
            });
        }

        console.log('Build completed successfully!');
    } catch (error) {
        console.error('Error during build:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    make();
}

module.exports = make;