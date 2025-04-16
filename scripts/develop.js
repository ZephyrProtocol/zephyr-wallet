const { execSync } = require('child_process');
const path = require('path');
const setupEnvironment = require('./setup-env');
const config = require('./config');

const { desktopAppDir } = config.paths;
const { desktopDevelopment, nodeInstaller } = config.envVars;

async function develop() {
    try {
        await setupEnvironment();

        console.log('Starting Zephyr Desktop App in development mode...');
        console.log('NOTE: Make sure the React dev server is running with "npm run start:desktop" in another terminal!');

        process.env[desktopDevelopment] = 'true';
        process.env.BROWSER = 'none';
        process.env[nodeInstaller] = 'npm';

        const desktopPath = path.normalize(desktopAppDir);

        console.log(`Starting Electron app in development mode in ${desktopPath}`);

        execSync('npm run build && npx --no -- electron-forge start', {
            stdio: 'inherit',
            cwd: desktopPath
        });
    } catch (error) {
        console.error('Error executing command:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    develop().catch(err => {
        console.error('Unhandled error:', err);
        process.exit(1);
    });
}

module.exports = develop;