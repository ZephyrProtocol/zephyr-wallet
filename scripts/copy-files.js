const fs = require('fs');
const path = require('path');
const config = require('./config');

const { clientDir, clientPublicDir, clientBuildDir, desktopAppDir, desktopClientDir } = config.paths;
const zephyrCoreFilesPattern = config.defaults.zephyrCoreFilesPattern;
const zephyrBuildFilesPattern = config.defaults.zephyrBuildFilesPattern;

function removeDir(dirPath) {
    if (!fs.existsSync(dirPath)) return true;

    try {
        fs.rmSync(dirPath, { recursive: true, force: true });
        return true;
    } catch (err) {
        console.error(`Error removing directory ${dirPath}:`, err);
        return false;
    }
}

function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return true;

    try {
        fs.rmSync(filePath, { force: true });
        return true;
    } catch (err) {
        console.error(`Error removing file ${filePath}:`, err);
        return false;
    }
}

function copyFile(source, destination) {
    try {
        fs.copyFileSync(source, destination);
        return true;
    } catch (err) {
        console.error(`Failed to copy ${source} to ${destination}:`, err);
        return false;
    }
}

function copyDirectory(source, destination) {
    try {
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        let count = 0;
        const items = fs.readdirSync(source, { withFileTypes: true });

        for (const item of items) {
            const srcPath = path.join(source, item.name);
            const destPath = path.join(destination, item.name);

            if (item.isDirectory()) {
                count += copyDirectory(srcPath, destPath);
            } else {
                if (copyFile(srcPath, destPath)) {
                    count++;
                }
            }
        }

        return count;
    } catch (err) {
        console.error('Error copying directory:', err);
        return 0;
    }
}

function copyZephyrCore() {
    console.log('Copying Zephyr core files...');

    try {
        const sourceDir = path.join(clientDir, 'node_modules', 'zephyr-javascript', 'dist');

        if (!fs.existsSync(clientPublicDir)) {
            fs.mkdirSync(clientPublicDir, { recursive: true });
        }

        if (!fs.existsSync(sourceDir)) {
            console.error('Error: Source directory not found!');
            console.log('Make sure zephyr-javascript is installed in client/node_modules.');
            return false;
        }

        let count = 0;
        const files = fs.readdirSync(sourceDir).filter(zephyrCoreFilesPattern);

        if (files.length === 0) {
            console.error('Error: No Zephyr core files found in source directory!');
            console.log('Check if the file pattern in config.js matches the actual files in the source directory.');
            return false;
        }

        for (const file of files) {
            const sourceFile = path.join(sourceDir, file);
            const destFile = path.join(clientPublicDir, file);

            if (copyFile(sourceFile, destFile)) {
                count++;
                console.log(`Copied ${file}`);
            }
        }

        console.log(`Successfully copied ${count} Zephyr core files to public directory.`);
        return count > 0;
    } catch (err) {
        console.error('Error copying Zephyr core files:', err);
        return false;
    }
}

function copyClientBuild() {
    console.log('Copying client build to desktop app...');

    try {
        if (!fs.existsSync(clientBuildDir)) {
            console.error('Error: Build directory does not exist!');
            console.log('Run build:desktop first to create the build.');
            return false;
        }

        if (!fs.existsSync(desktopAppDir)) {
            console.error('Error: Desktop app directory not found!');
            console.log('Make sure zephyr-desktop-app directory exists at the same level as client.');
            return false;
        }

        if (fs.existsSync(desktopClientDir)) {
            console.log('Removing existing desktop client directory...');
            if (!removeDir(desktopClientDir)) {
                console.log('Continuing with copy operation...');
            }
        }

        try {
            const buildFiles = fs.readdirSync(clientBuildDir);
            for (const file of buildFiles) {
                if (zephyrBuildFilesPattern(file)) {
                    const filePath = path.join(clientBuildDir, file);
                    console.log(`Removing ${file} from build directory...`);
                    if (fs.existsSync(filePath)) {
                        if (fs.lstatSync(filePath).isDirectory()) {
                            removeDir(filePath);
                        } else {
                            removeFile(filePath);
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error removing files from build directory:', err);
            console.log('Continuing with copy operation...');
        }

        const count = copyDirectory(clientBuildDir, desktopClientDir);

        if (count > 0) {
            console.log(`Successfully copied ${count} files to desktop app.`);
            return true;
        } else {
            console.error('No files were copied to desktop app.');
            return false;
        }
    } catch (err) {
        console.error('Error copying client build:', err);
        return false;
    }
}

function main() {
    const args = process.argv.slice(2);
    const coreOnly = args.includes('--core-only');
    const buildOnly = args.includes('--build-only');

    let success = true;

    if (!buildOnly) {
        success = copyZephyrCore() && success;
    }

    if (!coreOnly) {
        success = copyClientBuild() && success;
    }

    if (!success) {
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    copyZephyrCore,
    copyClientBuild
};