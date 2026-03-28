# Hotel Management Ordering App

This project is a full-stack hotel ordering system where customers can browse a menu and place orders from the menu.

## Project Structure

- `backend/` - Spring Boot API for menu items and customer orders
- `frontend/` - React + Vite customer ordering interface

## Features

- Display hotel menu items by category
- Select item quantities for an order
- Capture customer name, table number, and special instructions
- Submit customer orders to a Spring Boot API
- Store orders in an in-memory H2 database
- Seed sample menu items automatically on startup

## Backend Stack

- Spring Boot 3
- Spring Web
- Spring Data JPA
- H2 Database
- Jakarta Validation

## Frontend Stack

- React 18
- Vite 5
- Plain CSS

## API Endpoints

### Get Menu

- `GET /api/menu`

### Place Order

- `POST /api/orders`

Example request body:

```json
{
  "customerName": "Rahul",
  "tableNumber": "T-12",
  "specialInstructions": "Less spicy",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 4,
      "quantity": 1
    }
  ]
}
```

## How To Run

You will need these tools installed locally:

- Java 21 or newer
- Maven 3.9+
- Node.js 18+ with npm

### Start the backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

H2 console:

- `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:hotel_management`
- Username: `sa`
- Password: leave blank

### Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Deploy On Render

This repository includes:

- `Dockerfile` to build the React frontend and package the Spring Boot WAR
- `render.yaml` to create a Render web service

Render deployment steps:

1. Push this project to GitHub.
2. In Render, click `New +` and choose `Blueprint`.
3. Connect the GitHub repository.
4. Render will detect `render.yaml` and create the `hotel-management` web service.
5. Deploy the service.

After deployment, Render will:

- build the frontend with Vite
- bundle the frontend into Spring Boot static files
- package the backend as a WAR
- run the WAR with `java -jar`

Important note:

- The app currently uses in-memory H2, so order data resets whenever the Render service restarts or redeploys.

## Notes

- The backend currently uses an in-memory database, so orders reset when the server restarts.
- The current project is a strong starter template for expanding into admin dashboards, payment flow, or kitchen order tracking.

## Current Environment Limitation

This workspace currently has Java available, but Maven and Node.js are not installed, so the app was scaffolded without running the backend or frontend locally here.
