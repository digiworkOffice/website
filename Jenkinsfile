pipeline {
    agent any

    // Define the local server directory here at the top level
    environment {
        localServerDir = '/var/www/html/newWeb/'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    def scmVars = checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: [], userRemoteConfigs: [[url: 'https://github.com/digiworkOffice/website.git']]])
                    echo "Checked out 'main' branch"
                }
            }
        }

        stage( 'frontend deploy' ){
            steps{
                dir('webfronend'){
                    sh 'sudo npm install'
                    sh 'sudo npm run build'
                }
            }
        }  
        
        stage( 'backend deploy' ){
            steps{
                dir('server'){
                    sh 'sudo npm install'
                 
                }
            }
        }  

        
        stage( ' deploy' ){
            steps{

                sh 'rsync -avz webfrontend/build /var/www/html/newWeb/'

                sh 'rsync -avz server /var/www/html/newWeb/'

                
                    sh 'sudo pm2 restart server.js'
                    sh 'sudo systemctl restart nginx'

            
            }
        }  


        


    }

    post {
        always {
            cleanWs()
        }
    }
}
