const fs = require('fs');
const path = require('path');
const config = require('./config');

const { rootDir } = config.paths;
const { required: requiredDeps } = config.dependencies;

function checkDependencies() {
    const nodeModulesPath = path.join(rootDir, 'node_modules');
    const missingDeps = [];

    if (!fs.existsSync(nodeModulesPath)) {
        console.error(`Error: node_modules directory not found at ${nodeModulesPath}`);
        return false;
    }

    for (const dep of requiredDeps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (!fs.existsSync(depPath)) {
            missingDeps.push(dep);
        }
    }

    if (missingDeps.length > 0) {
        console.log(`Missing dependencies: ${missingDeps.join(', ')}`);
        return false;
    }

    return true;
}

async function bootstrap() {
    console.log('Checking Zephyr Wallet dependencies...');

    if (checkDependencies()) {
        console.log('Dependencies already installed, running setup...');

        try {
            const setup = require('./setup.js');
            if (typeof setup === 'function') {
                if (setup.constructor.name === 'AsyncFunction') {
                    await setup();
                } else {
                    setup();
                }
            }
        } catch (err) {
            console.error('Error loading setup script:', err.message);
            showManualInstructions();
            return false;
        }
    } else {
        console.log('Dependencies not found. Please install them manually:');
        showManualInstructions();
    }

    return true;
}

function showManualInstructions() {
    console.log('\nPlease run these commands manually:');
    console.log('1. npm install');
    console.log('2. node scripts/setup.js');
    console.log('\nIf you encounter any issues, try:');
    console.log('- Ensuring you have Node.js (version 14+) installed');
    console.log('- Running the commands with administrator privileges');
    console.log('- Checking npm cache: npm cache clean --force');
}

if (require.main === module) {
    bootstrap().catch(err => {
        console.error('Unhandled error:', err.message);
        showManualInstructions();
        process.exit(1);
    });
}

module.exports = bootstrap;