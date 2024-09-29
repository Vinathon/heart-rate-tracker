# Heart Rate Tracker

A Node.js application to track heart rate data using Bull queues, Redis, and PostgreSQL.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Docker Compose Services](#docker-compose-services)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.
- Access to a PostgreSQL database.

## Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Vinathon/heart-rate-tracker.git
   cd heart-rate-tracker

2. **Start the Services**
Run Docker Compose to start all services.

    docker-compose up -d

3. **Verify Containers Are Running**
Check the status of your containers to ensure they're up and running without issues.
    
    docker-compose ps

4. **Access the Application**
    Server API: http://localhost:3000
    Worker: Runs in the background, processing jobs from the Bull queue.

    API Endpoints
    The Heart Rate Tracker exposes the following API endpoints to interact with clinical data.

    POST /v1/clinical-data
    Description: Submit clinical data to be processed and aggregated.
    RequestBody: Paste the sample file provided

    Endpoint:
    POST http://localhost:3000/v1/clinical-data

    Response:
      {
        "requestId": "7d0629f4-1157-4516-8a12-00f81dc34c76",
        "message": "Data is being processed."
      }

    GET http://localhost:3000/v1/clinical-data/:requestId  
    example: 
        http://localhost:3000/v1/clinical-data/7d0629f4-1157-4516-8a12-00f81dc34c76

    Response:
      {
        "requestId": "930e8a66-1a6e-4a5a-a00a-145dfd9ce90a",
        "data": {
          "BP": {
            "uom": "mmHg",
            "name": "Blood Pressure"
          },
          "STEPS": {
            "uom": "",
            "data": [
              {
                "on_date": "2020-10-05T13:00:00.000000Z",
                "measurement": "11031"
              }
            ],
            "name": "Steps"
          },
          "HEIGHT": {
            "uom": "cm",
            "name": "Height"
          },
          "WEIGHT": {
            "uom": "Kg",
            "name": "Weight"
          },
          "HEART_RATE": {
            "uom": "beats/min",
            "data": [
              {
                "to_date": "2020-10-07T07:30:00.000Z",
                "from_date": "2020-10-07T07:10:00.000Z",
                "measurement": {
                  "low": 69,
                  "high": 83
                }
              }
            ],
            "name": "Heart Rate"
          },
          "BLOOD_GLUCOSE_LEVELS": {
            "uom": "mmol/L",
            "name": "Blood Glucose"
          }
        }
      }