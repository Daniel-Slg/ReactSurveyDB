# ReactSurveyDB

ReactSurveyDB is a survey web app built with the **PERN stack** – **PostgreSQL**, **Express**, **React**, and **Node.js**. This app allows users to fill out surveys, while admins can create and manage surveys with different question types like **Yes/No**, **Multiple Choice**, or **Free Text**. 

### Key Features:
- Users can fill out surveys and submit responses.
- Admins can create surveys with various question types.
- Survey results are visualized with graphs.
- Everything is containerized with Docker for smooth setup and deployment.

### Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Daniel-Slg/ReactSurveyDB.git

2. **Install Backend Dependencies**:
   Navigate to the `server` directory and install the necessary Node.js packages:
   ```bash
   cd server
   npm install
3. **NPM install dependencies in \client**:
   Navigate to the `client` directory and install the necessary Node.js packages:
   ```bash
   cd client
   npm install
5. **Start Docker and compose inside the root folder**:
   Navigate back to the root directory and run the following Docker compose:
    ```bash
   docker-compose up

### Accessing the Application

Once the application is running with Docker, you can access both the frontend and backend locally:

- **Frontend (React)**:
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
   - This will take you to the React-based user interface where you can interact with the survey application, fill out surveys, view results, and more.
   - To connect you can use either user: testuser & pwuser || admin: testadmin & pwadmin

- **Backend (API)**:
   - The backend API is available at [http://localhost:5000](http://localhost:5000).
   - This is where the Express-based API is running. It handles requests from the frontend.
