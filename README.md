# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```bash
git clone https://github.com/skylive-skl/nodejs2025Q2-service.git

cd nodejs2025Q2-service

git checkout develop
```

## Installing NPM modules

```bash
npm install
```

## Environment variables
You can copy the example environment file to create your own `.env` file.
```bash
cp .env.example .env
```

## Building the application
```bash
npm run build
```
This will compile the TypeScript code into JavaScript and place it in the `dist` directory.


## Running application

```bash
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Running application in development mode
To run the application in development mode with hot-reloading, use the following command:
```bash
npm run start:dev
```

## Testing

**To run tests, you need to have the application running in the background.**
You can run the application in development mode or in production mode.
To run the application in production mode, use the following command:
```bash
npm run build && npm run start
```

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

**`test:auth` and `test:refresh` not supported**

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
