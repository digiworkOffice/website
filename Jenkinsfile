

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
                    remoteServer.host = '52.66.248.118'
                    remoteServer.user = 'ubuntu'
                    def remoteFolderPathClientSSR = '/var/www/html/newWeb/front'
                    def remoteFolderPathServer = '/var/www/html/newWeb/server'
                    sshagent(['f190f019-b6ec-4aa9-9223-4909a2b6a584']) {
                            // sh "ssh -tt -o StrictHostKeyChecking=no ${remoteServer.user}@${remoteServer.host} 'mkdir -p ${remoteFolderPathClientSSR} && mkdir -p ${remoteFolderPathServer}'"

                            sh "scp -r * ${remoteServer.user}@${remoteServer.host}:/var/www/html/newWeb/"

                            // sh "scp -r ./server ${remoteServer.user}@${remoteServer.host}:/var/www/html/newWeb/"
                                          echo "completed"


                            // sh "ssh -tt -o StrictHostKeyChecking=no ${remoteServer.user}@${remoteServer.host} 'cd ${remoteFolderPathServer}  && sudo pm2 reload ./pm2.json && cd ${remoteFolderPathClientSSR}  && sudo pm2 reload ./pm2.json'"
                            
                    }
                    
                }
                
            }
        }
    }
}


