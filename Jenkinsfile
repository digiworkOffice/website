// pipeline {
//     agent any

//     // Define the local server directory here at the top level
//     environment {
//         localServerDir = '/var/www/html/newWeb'
//         sshCredentials = 'ace90236-ae8c-4957-812a-753a67f6b929' // Replace with your SSH credentials ID
//         serverUser = 'ubuntu' // Replace with the SSH username for the server
//         serverAddress = '43.204.233.165' // Replace with the server address
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 script {
//                     def scmVars = checkout([$class: 'GitSCM', branches: [[name: '*/dev']], doGenerateSubmoduleConfigurations: false, extensions: [], userRemoteConfigs: [[url: 'https://github.com/digiworkOffice/website.git']]])
//                     echo "Checked out 'dev' branch"
//                 }
//             }
//         }

//         stage('frontend deploy') {
//             steps {
//                 dir('webfronend') {
//                     script {
//                         // Run npm install and npm build on the server using SSH
//                         sshagent(credentials: [sshCredentials]) {
//                             // sh "ssh ${serverUser}@${serverAddress} 'cd ${localServerDir}/webfrontend && sudo npm install'"
//                             // sh "ssh ${serverUser}@${serverAddress} 'cd ${localServerDir}/webfrontend && sudo npm run build'"
//                         }
//                     }
//                 }
//             }
//         }

//         stage('backend deploy') {
//             steps {
//                 dir('server') {
//                     script {
//                         // Run npm install on the server using SSH
//                         sshagent(credentials: [sshCredentials]) {
//                             // sh "ssh ${serverUser}@${serverAddress} 'cd ${localServerDir}/server && sudo npm install'"

//                             sh "scp -r * ${localServerDir} "
//                         }
//                     }
//                 }
//             }
//         }

//         stage('deploy') {
//             steps {
//                 // Add your SSH key to the agent's environment
//                 sshagent(credentials: [sshCredentials]) {
                    

                    
//                     // Use SSH to copy files and restart services on the server
//                     // sh "rsync -avz webfrontend/build ${serverUser}@${serverAddress}:${localServerDir}"
//                     // sh "rsync -avz server ${serverUser}@${serverAddress}:${localServerDir}"

//                     // sh "ssh ${serverUser}@${serverAddress} 'sudo pm2 restart ${localServerDir}/server.js'"
//                     // sh "ssh ${serverUser}@${serverAddress} 'sudo systemctl restart nginx'"
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             cleanWs()
//         }
//     }
// }





pipeline {
    agent any
    stages {
        // stage('Checkout') {
        //     steps {
        //         script {
        //             def scmVars = checkout([$class: 'GitSCM', branches: [[name: '*/dev']], doGenerateSubmoduleConfigurations: false, extensions: [], userRemoteConfigs: [[url: 'https://github.com/digiworkOffice/website.git']]])
        //             echo "Checked out 'dev' branch"
        //         }
        //     }
        // }
        stage('Build') {
            steps {
                sh 'cd webfrontend && npm install i && npm run build'
            }
        }
        stage('Transfer') {
            steps {
                script {
                    def remoteServer = [:]
                    remoteServer.name = 'RemoteServer'
                    remoteServer.allowAnyHosts = true
                    remoteServer.host = '52.66.248.118'
                    remoteServer.user = 'ubuntu'
                    def remoteFolderPathClientSSR = '/var/www/html/newWeb/build'
                    def remoteFolderPathClientSSR = '/var/www/html/newWeb/server'
                    sshagent(['f190f019-b6ec-4aa9-9223-4909a2b6a584']) {
                            sh "ssh -tt -o StrictHostKeyChecking=no ${remoteServer.user}@${remoteServer.host} 'mkdir -p ${remoteFolderPathClientSSR} && mkdir -p ${remoteFolderPathServer}'"

                            sh "scp -r ./build ${remoteServer.user}@${remoteServer.host}:/var/www/html/newWeb/"

                            sh "scp -r ./server ${remoteServer.user}@${remoteServer.host}:/var/www/html/newWeb/"
                                          echo "completed"


                            // sh "ssh -tt -o StrictHostKeyChecking=no ${remoteServer.user}@${remoteServer.host} 'cd ${remoteFolderPathServer}  && sudo pm2 reload ./pm2.json && cd ${remoteFolderPathClientSSR}  && sudo pm2 reload ./pm2.json'"
                            
                    }
                    
                }
                
            }
        }
    }
}


