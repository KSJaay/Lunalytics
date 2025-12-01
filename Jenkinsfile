pipeline {
    agent any

    stages {

        stage('Source Checkout') {
            steps {
                echo "Checking out source code from GitHub..."
                git branch: 'dev', url: 'https://github.com/ayesha-3/Lunalytics.git'
            }
        }

        stage('Build') {
            steps {
                echo "Running build stage..."
                 sh 'npm install'
                 sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo "Running test stage..."
                // Add your test commands here
                // Example:
                 sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deployment step (optional)..."
                // Add deployment commands if needed
            }
        }
    }

    post {
        success {
            echo "Build completed successfully!"
        }
        failure {
            echo "Build failed!"
        }
    }
}
