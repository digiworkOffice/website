

pipeline {
    agent any
    stages {

        stage('Transfer') {
            steps {
                script {
                    sshagent(['540997d2-d5b4-450d-b863-2030aa5b52cb']) {

                            sh "scp -r * ubuntu@103.90.86.38:/home/ubuntu/test_jenkins/newWeb"

                                          echo "completed"


                            
                    }
                    
                }
                
            }
        }
    }
}


