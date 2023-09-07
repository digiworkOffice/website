pipeline {
    agent any

    // Define the local server directory here at the top level
    environment {
        localServerDir = '/var/www/html/newWeb'
        sshCredentials = 'a7a2cd42-6104-43a3-adfd-247591813cde' // Replace with your SSH credentials ID
        serverUser = 'ubuntu' // Replace with the SSH username for the server
        serverAddress = '43.204.233.165' // Replace with the server address
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    def scmVars = checkout([$class: 'GitSCM', branches: [[name: '*/dev']], doGenerateSubmoduleConfigurations: false, extensions: [], userRemoteConfigs: [[url: 'https://github.com/digiworkOffice/website.git']]])
                    echo "Checked out 'dev' branch"
                }
            }
        }

        stage('frontend deploy') {
            steps {
                dir('webfronend') {
                    script {
                        // Run npm install and npm build on the server using SSH
                        sshagent(credentials: [sshCredentials]) {
                            sh "ssh ${serverUser}@${serverAddress} 'cd ${localServerDir}/webfrontend && sudo npm install'"
                            sh "ssh ${serverUser}@${serverAddress} 'cd ${localServerDir}/webfrontend && sudo npm run build'"
                        }
                    }
                }
            }
        }

        stage('backend deploy') {
            steps {
                dir('server') {
                    script {
                        // Run npm install on the server using SSH
                        sshagent(credentials: [sshCredentials]) {
                            sh "ssh ${serverUser}@${serverAddress} 'cd ${localServerDir}/server && sudo npm install'"
                        }
                    }
                }
            }
        }

        stage('deploy') {
            steps {
                // Add your SSH key to the agent's environment
                sshagent(credentials: [sshCredentials]) {
                    // Use SSH to copy files and restart services on the server
                    sh "rsync -avz webfrontend/build ${serverUser}@${serverAddress}:${localServerDir}"
                    sh "rsync -avz server ${serverUser}@${serverAddress}:${localServerDir}"

                    sh "ssh ${serverUser}@${serverAddress} 'sudo pm2 restart ${localServerDir}/server.js'"
                    sh "ssh ${serverUser}@${serverAddress} 'sudo systemctl restart nginx'"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
