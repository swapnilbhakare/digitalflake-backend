pipeline{
    agent {
    docker { image 'node:16-alpine' }
  }
    environment{
        NODE_ENV = 'production'
        PORT = '8080'
        CORS_ORIGIN = "*"
        ACCESS_TOKEN_SECRET = credentials('zgoCGYHy1IQBfapifAVuwlIyU5rLb0psHO5RFDeOlLfPoHPyLjHuSZAPk4EDue1l')
        ACCESS_TOKEN_EXPIRY = '1d'
        REFRESH_TOKEN_EXPIRY = '10d'
        REFRESH_TOKEN_SECRET = credentials('aCZ2zft4U94IVX9bVbqdm8t5zGlVAE7MEvwmgtiDR02SHcmq2sWgAySuDAPmJaf7')
        CLOUDINARY_CLOUD_NAME =  credentials('dgz5gmmbm')
        CLOUDINARY_API_KEY =  credentials('357922242585274')
        CLOUDINARY_API_SECRET = credentials('OhRGyYjOFt3KLRrz0ME79_MOAo0')
        MONGODB_URI = credentials('mongodb+srv://swapnilbhakare7:JMtVxjgr5Bt0CO8o@cluster0.hslhq5x.mongodb.net')

    }
    stages{
        stage('Clone Repository'){
            steps{
                git "https://github.com/swapnilbhakare/digitalflake-backend"
            }
        }
        stage('Install Dependencies'){
            steps{
                script{
                    def nodejsHome = tool name :'NodeJS',type: "NodeJS"
                    env.PATH="${nodejsHome}/bin:${env.PATH}"
                }
                sh "npm install"
            }
        }
        stage('Run Tests'){
            steps{
               sh 'npm test -- --reporter junit --reporter-options "output=test-results.xml"'
            }
        }
        stage('build'){
            steps{
                sh 'npm run build'
            }
        }
        stage('Deploy'){
            steps{
                echo 'Deploying application...'
            }
        }
    }
    post {
        always {
           
                archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
                junit 'test-results.xml'
            
        }
    }
}
