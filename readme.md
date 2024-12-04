
# User Administration Web Application

This project is a **web application** for managing users, built with **React** for the frontend and **TypeScript** for the backend. It supports user creation, deletion, and retrieval, with persistent storage in a database. A **retry mechanism** is implemented to handle database unavailability.

```mermaid
graph TD;
    A[User Interface (React)] -->|Makes API Requests| B[Server (Node.js + TypeScript)];
    B -->|Handles Requests| C[Database (SQLite)];
    B -->|Business Logic| D[Business Logic Layer];
    D -->|Database Operations| C;

    subgraph UI
        A
    end

    subgraph Server
        B
        D
    end

    subgraph Database
        C
    end

    style UI fill:#f9f,stroke:#333,stroke-width:2px;
    style Server fill:#bbf,stroke:#333,stroke-width:2px;
    style Database fill:#acf,stroke:#333,stroke-width:2px;
```

## Features

- **Create New Users**: Add users with their first name, last name, email address, and password.
- **Delete Users**: Remove existing users from the database.
- **List Users**: View all users in the database.
- **Retry Mechanism**: Automatically retries database operations if the database is temporarily unavailable.

---

## Prerequisites

To run this project, ensure you have the following installed:

- **Node.js** (v16+)
- **npm** or **yarn**
- **SQLite** (or another DB of your choice; this project uses SQLite)
- **TypeScript**

---

## Project Structure

```
root/
├── client/               # React frontend
│   ├── src/              # Source files for React
│   └── package.json      # React app dependencies
├── server/               # TypeScript backend
│   ├── src/              # Source files for the server
│   ├── dist/             # Compiled backend files
│   └── package.json      # Backend dependencies
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/user-administration.git
cd user-administration
```

### 2. Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

### 3. Configure the Database

This project uses SQLite by default. The database will be automatically created in the `server/` directory during the first run. If you want to switch databases, modify the `data-source.ts` file in the server.

---

## Running the Application

### Start the Server

```bash
cd server
npm run start
```

### Start the Client

```bash
cd client
npm start
```

The server runs on `http://localhost:3002` and the client runs on `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint        | Description               | Body Example |
|--------|-----------------|---------------------------|--------------|
| GET    | `/users`        | Fetch all users           | -            |
| POST   | `/users`        | Create a new user         | `{ "FirstName": "John", "LastName": "Doe", "EmailAddress": "john@example.com", "Password": "securepassword" }` |
| DELETE | `/users/:id`    | Delete a user by ID       | -            |

---

## Retry Mechanism

A retry mechanism is implemented to handle database failures. The system attempts each database operation up to 3 times with exponential backoff. This ensures resilience against temporary unavailability of the database.

---

## Tech Stack

### Frontend:
- **React** (for UI)
- **Axios** (for API communication)
- **React Router** (for navigation)

### Backend:
- **TypeScript**
- **Express** (for API endpoints)
- **TypeORM** (for database operations)
- **SQLite** (default database)

---

## Deployment

To deploy the application:
1. Build the client:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the server and build output from the client to your hosting provider of choice (e.g., AWS, Heroku).

---

## Testing

1. **Unit Testing**: Use tools like `Jest` to test backend logic.
2. **Integration Testing**: Use tools like `Postman` to test API endpoints.

---

## Improvements

Possible improvements for future development:
- Add authentication with JWT for secure access.
- Add pagination for user listing.
- Support more databases via configuration.

---

### Running Your Tests
You can run your tests using the following command:

```bash
npx jest
```
