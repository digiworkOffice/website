pipeline {
    agent any

    // Define the local server directory here at the top level
    environment {
        localServerDir = '/var/www/html/'
    }

    stages {
        stage('Deploy to Local Server') {
            steps {
                // Define the local server directory where you want to deploy your website
                def localServerDir = '/var/www/html/'

                // Remove existing files (optional)
                sh "rm -rf ${localServerDir}*"

                // Copy all files and directories from the workspace to the local server directory
                sh "cp -r * ${localServerDir}"
                // Restart the Nginx web server
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

