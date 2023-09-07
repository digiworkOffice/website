

pipeline {
    agent any
    stages {

        // stage('Build') {
        //     steps {
        //         sh 'cd webfrontend && npm install && npm run build'
        //     }
        // }
        stage('Transfer') {
            steps {
                script {
                    def remoteServer = [:]
                    remoteServer.name = 'RemoteServer'
                    remoteServer.allowAnyHosts = true
                    remoteServer.host = '103.90.86.38'
                    remoteServer.user = 'ubuntu'
                    // def remoteFolderPathClientSSR = '/var/www/html/newWeb/front'
                    // def remoteFolderPathServer = '/var/www/html/newWeb/server'
                    sshagent(['540997d2-d5b4-450d-b863-2030aa5b52cb']) {
                            // sh "ssh -tt -o StrictHostKeyChecking=no ${remoteServer.user}@${remoteServer.host} 'mkdir -p ${remoteFolderPathClientSSR} && mkdir -p ${remoteFolderPathServer}'"

                            sh "scp -r * ubuntu@103.90.86.38:/home/ubuntu/test_jenkins/newWeb"

                                          echo "completed"


                            // sh "ssh -tt -o StrictHostKeyChecking=no ${remoteServer.user}@${remoteServer.host} 'cd ${remoteFolderPathServer}  && sudo pm2 reload ./pm2.json && cd ${remoteFolderPathClientSSR}  && sudo pm2 reload ./pm2.json'"
                            
                    }
                    
                }
                
            }
        }
    }
}


