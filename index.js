const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const command = process.argv[2];

global.PATHS = {};
global.PATHS.build = path.join(__dirname, 'static');
global.PATHS.app = path.join(__dirname, 'app');
global.PATHS.server = path.join(__dirname, 'server');
global.PATHS.appDependencies = path.join(PATHS.app, 'node_modules');
global.PATHS.serverDependencies = path.join(PATHS.server, 'node_modules');

function testPaths({ install = true, build = true }) {
    if (install && !fs.existsSync(`${PATHS.appDependencies}`)) {
        console.error('ERROR: '
            + `react.js app dependencies at '${PATHS.appDependencies}' not found'\n`
            + '  run `npm run install` in your project root'
        );
        process.exit(1);
    }

    if (install && !fs.existsSync(`${PATHS.serverDependencies}`)) {
        console.error('ERROR: '
            + `express.js server dependencies at '${PATHS.serverDependencies}' not found\n`
            + '  run `npm run install` in your project root'
        );
        process.exit(1);
    }

    if (build && !fs.existsSync(PATHS.build)) {
        console.error('ERROR: '
            + `build path at '${PATHS.build}' not found\n`
            + '  run `npm run build` in your project root'
        );
        process.exit(1);
    }
}

function install() {
    execSync('npm install', { cwd: 'app', stdio: 'inherit' });
    execSync('npm install', { cwd: 'server', stdio: 'inherit' });
}

function build() {
    testPaths({ install: true, build: false });
    execSync('npm run build', { cwd: 'app', stdio: 'inherit' });
}

function start() {
    testPaths({ install: true, build: true });
    try {
        execSync('npm start', { cwd: 'server', stdio: 'inherit' });
    } catch (e) {}
}

function dev() {
    testPaths({ install: true, build: false });
    execSync('npm run dev', { cwd: 'app', stdio: 'inherit' });
    start();
}

switch (command) {
    case 'install':
        install();
        break;
    case 'build':
        build();
        break;
    case 'start':
        start();
        break;
    case 'dev':
        dev();
        break;
    default:
        console.error(`invalid command: ${command}`);
        break;
}
