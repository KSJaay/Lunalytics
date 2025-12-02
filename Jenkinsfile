pipeline {
    agent any

    stages {

        stage('Source Checkout') {
            steps {
                echo "Checking out source code from GitHub..."
                git branch: 'dev', url: 'https://github.com/ayesha-3/Lunalytics.git'
            }
        }

        stage('Test') {
            steps {
                echo "Running test stage..."
                script {
                    try {
                        bat 'npm test'
                    } catch (Exception e) {
                        echo "Tests not yet implemented: ${e.message}"
                    }
                }
            }
        }

        stage('Test') {
            steps {
                echo "Running test stage..."
                // Add your test commands here
                // Example:
                 bat 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo "Deployment step to be implemented later (optional)..."
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
