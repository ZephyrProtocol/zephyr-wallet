# Zephyr Frontend for Web and Desktop

Official Zephyr Frontend Monorepository for Zephyr Desktop and Zephyr Web Version.
Originally forked from: https://github.com/haven-protocol-org/haven-web-app

**Main Libraries:** React, Redux, Electron, Styled Components

**Languages:** Typescript, Javascript

## Getting Started

### Setup

Run the setup script to install and configure all dependencies:

```bash
npm run setup
```

This will:
- Install all node dependencies (root, client, and desktop app)
- Copy the necessary Zephyr core files
- Set up the environment configuration

## Web Version

### Build & Develop

```bash
# Start the web version in development mode
npm run start:web

# Or build the web version for production
npm run build:web
```

By default, the app will use mainnet. To use a different network, set the REACT_APP_NET_TYPE_ID environment variable:
- 0: Mainnet (default)
- 1: Testnet
- 2: Stagenet

## Desktop Version

### Build & Develop

```bash
# Start the desktop version in development mode (runs both the React app and Electron)
npm run start:desktop   # In one terminal window
npm run develop         # In another terminal window

# Build the desktop app for distribution
npm run build:desktop   # Build the React app for desktop
npm run copy-build      # Copy the build to the desktop app directory
```

### Packaging Options

There are two ways to package the desktop application:

```bash
# Option 1: Create installers (.exe, .dmg, .deb) for distribution
npm run make

# Option 2: Create portable packages (loose files, no installer required)
npm run package
```

When packaging for distribution, you'll be prompted to select a network unless one is specified:
- 0: Mainnet (default)
- 1: Testnet
- 2: Stagenet

## Docker Version

### Build & Run with Docker

The project includes Docker support for easy deployment of the web version:

```bash
# Build with default settings (mainnet)
docker build -t zephyr-wallet -f .docker/Dockerfile .

# Build for a specific network
docker build -t zephyr-wallet:testnet -f .docker/Dockerfile --build-arg REACT_APP_NET_TYPE_ID=1 .
```

### Using Docker Compose

For simplicity, you can use Docker Compose:

```bash
# Start with default settings (mainnet)
docker compose up -d

# Alternatively if you want to start with specific network
REACT_APP_NET_TYPE_ID=1 NETWORK_TYPE=testnet docker compose up -d

# Stop the container
docker compose down
```

### Configuration Options

The Docker setup supports these arguments/environmental variables:

- `REACT_APP_NET_TYPE_ID`: Network type (0=Mainnet, 1=Testnet, 2=Stagenet)
- `REACT_APP_ZEPHYR_DIRECT_HOST`: Node URL for direct connections
- `PORT`: Host port to map (default: 80)
- `NETWORK_TYPE`: Tag for the image (mainnet, testnet, stagenet)