const { execSync } = require('child_process');
const path = require('path');
const readline = require('readline');
const config = require('./config');

const { desktopAppDir } = config.paths;
const { defaultNetTypeId } = config.defaults;
const { desktopDevelopment, netTypeId, nodeInstaller } = config.envVars;

function promptForNetwork() {
    return new Promise((resolve) => {
        console.log('Please select network type:');
        console.log('1. Mainnet (0)');
        console.log('2. Testnet (1)');
        console.log('3. Stagenet (2)');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter choice (1-3): ', (answer) => {
            rl.close();

            let selectedNetTypeId;
            switch (answer.trim()) {
                case '1':
                    selectedNetTypeId = '0';
                    break;
                case '2':
                    selectedNetTypeId = '1';
                    break;
                case '3':
                    selectedNetTypeId = '2';
                    break;
                default:
                    console.log(`Invalid selection, defaulting to mainnet (${defaultNetTypeId})`);
                    selectedNetTypeId = defaultNetTypeId;
            }

            resolve(selectedNetTypeId);
        });
    });
}

async function packageApp() {
    console.log('Packaging Zephyr Desktop App...');

    try {
        let selectedNetTypeId = process.argv[2] || process.env[netTypeId];

        if (!selectedNetTypeId) {
            selectedNetTypeId = await promptForNetwork();
        }

        console.log(`Using network type: ${selectedNetTypeId}`);

        process.env[desktopDevelopment] = 'false';
        process.env[netTypeId] = selectedNetTypeId;
        process.env[nodeInstaller] = 'npm';

        const desktopPath = path.normalize(desktopAppDir);

        console.log(`Running npm run package in ${desktopPath}`);

        execSync('npm run package', {
            stdio: 'inherit',
            cwd: desktopPath
        });

        console.log('Packaging completed successfully!');
    } catch (error) {
        console.error('Error during packaging:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    packageApp().catch(err => {
        console.error('Unhandled error:', err);
        process.exit(1);
    });
}

module.exports = packageApp;