

pipeline {
    agent any
    stages {

        stage('Transfer') {
            steps {
                dir('webfrontend'){
                    sh 'npm install'
                    //sh 'scp -r webfrontend/build var/www/html/newWeb'
                    echo 'build completed'
                }
                    
                }
                
            }
        }
    }



