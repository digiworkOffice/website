

pipeline {
    agent any
    stages {

        stage('Transfer') {
            steps {
                dir('webfrontend'){
                    sh 'npm install'
                    sh 'npm run deploy'
                }
                    
                }
                
            }
        }
    }



