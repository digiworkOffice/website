

pipeline {
    agent any
    stages {

        stage('Transfer') {
            steps {
                dir('webfrontend'){
                    sh 'npm install && npm run build'
                    //sh 'scp -r webfrontend/build var/www/html/newWeb'
                    echo 'build completed'
                }
                    
                }
                
            }
        }
    }



