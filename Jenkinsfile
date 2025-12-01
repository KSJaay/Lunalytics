pipeline {
    agent any

    stages {

        stage('Source Checkout') {
            steps {
                git branch: 'dev', url: 'https://github.com/ayesha-3/Lunalytics.git'
            }
        }

        stage('Setup Python Environment') {
            steps {
                bat '''
                python --version
                python -m venv venv
                venv\\Scripts\\activate && pip install --upgrade pip
                venv\\Scripts\\activate && pip install -r requirements.txt
                '''
            }
        }

        stage('Run Django Checks') {
            steps {
                bat '''
                venv\\Scripts\\activate && python manage.py check
                '''
            }
        }

        stage('Run Tests') {
            steps {
                bat '''
                venv\\Scripts\\activate && python manage.py test
                '''
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
