pipeline {
    agent any

    stages {

        stage('Source Checkout') {
            steps {
                git branch: 'dev', url: 'https://github.com/ayesha-3/Lunalytics.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

    }

    post {
        success {
            echo 'CI Pipeline Completed Successfully!'
        }
        failure {
            echo 'CI Pipeline Failed!'
        }
    }
}
