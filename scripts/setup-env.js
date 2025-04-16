const fs = require('fs');
const path = require('path');
const readline = require('readline');
const config = require('./config');

const { clientDir } = config.paths;
const { defaultNetTypeId, version } = config.defaults;
const { netTypeId: NET_TYPE_ID, appVersion, zephyrDirectHost } = config.envVars;

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

async function setupEnvironment() {
    try {
        let selectedNetTypeId = process.env.NET || process.env[NET_TYPE_ID];

        if (!selectedNetTypeId) {
            try {
                selectedNetTypeId = await promptForNetwork();
            } catch (err) {
                console.error('Error during network selection prompt:', err);
                console.log(`Defaulting to mainnet (${defaultNetTypeId})`);
                selectedNetTypeId = defaultNetTypeId;
            }
        }

        process.env[NET_TYPE_ID] = selectedNetTypeId;
        console.log(`Using network type: ${selectedNetTypeId}`);

        const envPath = path.join(clientDir, '.env');
        const envContent =
            `${NET_TYPE_ID}=${selectedNetTypeId}
${appVersion}=${process.env.npm_package_version || version}
${zephyrDirectHost}=localhost:3000
`;

        try {
            fs.writeFileSync(envPath, envContent);
            console.log(`Environment configuration saved to ${envPath}`);
        } catch (err) {
            console.error(`Error writing to ${envPath}:`, err);
            console.log('Will continue using environment variables in memory.');
        }

        return selectedNetTypeId;
    } catch (err) {
        console.error('Unexpected error in setupEnvironment:', err);
        console.log(`Defaulting to mainnet (${defaultNetTypeId})`);
        process.env[NET_TYPE_ID] = defaultNetTypeId;
        return defaultNetTypeId;
    }
}

if (require.main === module) {
    setupEnvironment().catch(err => {
        console.error('Unhandled error:', err);
        process.exit(1);
    });
}

module.exports = setupEnvironment;