pipeline {
    agent any

    // Define the local server directory here at the top level
    environment {
        localServerDir = '/var/www/html/newWeb'
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

        stage('Deploy to Local Server') {
            steps {
                // Remove existing files (optional)
                sh "rm -rf ${localServerDir}*"

                // Copy all files and directories from the workspace to the local server directory
                sh "cp -r * ${localServerDir}"

                // Restart the Nginx web server on the local server
                sh 'sudo systemctl restart nginx'

                echo "Website deployed to ${localServerDir}"
            }
        }

    }

    post {
        always {
            cleanWs()
        }
    }
}
