Heart Rate API Application
Description
This application provides an API for processing and retrieving clinical data, specifically heart rate data. It exposes endpoints to receive clinical data via POST requests and retrieve processed data via GET requests.

Prerequisites
Docker installed on your machine.
(Optional) A PostgreSQL database for storing and retrieving clinical data.
Getting Started
Cloning the Repository
First, clone the repository to your local machine:

Copy code
git clone https://github.com/Vinathon/heart-rate-tracker
cd test-projects
Environment Variables
The application uses environment variables for configuration. Create a .env file in the project root directory with the following content:

makefile
Copy code
# Database configuration
DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name

# Other configuration variables
INTERVAL_DURATION_MINUTES=15
Note: If you don't have a database setup, you can skip setting the database variables. In this case, the GET endpoint will not retrieve data from the database and will respond with an appropriate message.
Certificates (Optional)
If your application requires certificates to connect securely to the PostgreSQL database, ensure that the certificates are placed in the certs directory and that the paths are correctly specified in your .env file.

Building the Docker Image
Build the Docker image using the following command:

bash
Copy code
docker build -t heart-rate-app .
Running the Docker Container
Run the Docker container with the following command:

bash
Copy code
docker run -d \
  --name heart-rate-app \
  -p 3000:3000 \
  --env-file .env \
  heart-rate-app
This command starts the application in a Docker container, mapping port 3000 of the container to port 3000 on your local machine.
It uses the .env file for configuration.
Usage
API Endpoints
The API is accessible at http://localhost:3000/api/clinical-data.

POST /api/clinical-data
Description: Receives clinical data and processes it.
Request Body: JSON payload containing clinical data.
Response: Processed clinical data.


GET /api/clinical-data/:patientId
Description: Retrieves the latest processed clinical data for the specified patient.
Parameters:
patientId: The ID of the patient whose data you want to retrieve.
Response: The latest clinical data for the patient if available.
Note: The GET endpoint will only work if the database connection is successful. If the database is not connected or no data is available for the specified patient, it will respond with a message indicating that no data is available.