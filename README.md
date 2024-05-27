# Gone Gourmet

Gone Gourmet is a project that provides information about restaurants and their unavailable items. The project is divided into two main parts: the backend and the frontend. It used nodejs v16.13.2 for development.

## Backend

The backend is a Node.js server that uses Express.js for routing and PostgreSQL for database management. It provides several API endpoints for retrieving unique restaurant brands, locations, and unavailable items.

To run the backend, navigate to the backend directory and run the following command:

```sh
npm start
```

## Frontend

The frontend is a simple web interface that allows users to select a restaurant brand and location, and view the unavailable items for the selected restaurant. The frontend is created using html, css, javascript and jquery.

To run the frontend, navigate to the frontend directory and run the following command:

```sh
npm start
```

## Dependencies

The backend uses the following dependencies:
 - express
 - cors
 - pg
The frontend uses the following dependencies:
 - live-server

## Batch Scripts

There are two batch scripts included in this project to help with setting up and running the application:

- `install-gone-gourmet.bat`: This script installs the necessary dependencies for both the backend and frontend. To run it, navigate to the project directory in the command prompt and type `install-gone-gourmet.bat`.

- `start-gone-gourmet.bat`: This script starts both the backend and frontend. To run it, navigate to the project directory in the command prompt and type `start-gone-gourmet.bat`.

Please note that these scripts assume that you have Node.js and npm installed and that your `package.json` files are located in the `backend` and `frontend` directories.
