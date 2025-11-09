pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "scanshield_frontend"
    }

    stages {
        stage('Clone Frontend') {
            steps {
                git branch: 'main', url: 'https://github.com/Dhananjaydk15/ScanShield.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --legacy-peer-deps'
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build & Run using Docker Compose') {
            steps {
                sh """
                docker compose down
                docker compose build
                docker compose up -d
                """
            }
        }
    }

    post {
        success {
            echo "Frontend deployed successfully using Docker Compose"
        }
        failure {
            echo "Frontend deployment failed"
        }
    }
}
