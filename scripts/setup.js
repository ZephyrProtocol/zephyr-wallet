const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const { clientDir } = config.paths;

function runCommand(command, args, options = {}) {
    console.log(`Running: ${command} ${args.join(' ')}`);

    const result = spawnSync(command, args, {
        stdio: 'inherit',
        ...options
    });

    if (result.status !== 0) {
        console.error(`Command failed with exit code ${result.status}`);
        return false;
    }

    return true;
}

async function setup() {
    console.log('Setting up Zephyr Wallet...');

    const publicDir = path.join(clientDir, 'public');

    if (!fs.existsSync(publicDir)) {
        console.log('Creating public directory...');
        fs.mkdirSync(publicDir, { recursive: true });
    }

    console.log('\nInstalling root dependencies...');
    if (!runCommand('npm', ['install'])) {
        return false;
    }

    console.log('\nCopying Zephyr core files...');
    if (!runCommand('npm', ['run', 'copy-zephyr-core'])) {
        return false;
    }

    console.log('\nSetup completed successfully!');
    console.log('\nAvailable commands:');
    console.log('  npm run start:web       (Start web wallet development server)');
    console.log('  npm run build:web       (Build web wallet for production)');
    console.log('  npm run start:desktop   (Start desktop wallet development server)');
    console.log('  npm run build:desktop   (Build desktop wallet)');
    console.log('  npm run develop         (Start desktop app in development mode)');
    console.log('  npm run make            (Build desktop app)');
    console.log('  npm run package         (Package desktop app)');

    return true;
}

if (require.main === module) {
    setup().catch(err => {
        console.error('Unhandled error:', err);
        process.exit(1);
    });
}

module.exports = setup;