pipeline{
   agent { label 'built-in' }
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
stages {
        stage('Clone Repository') {
            steps {
                git "https://github.com/swapnilbhakare/digitalflake-backend"
            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    def nodejsHome = tool name: 'NodeJS', type: "NodeJS"
                    env.PATH = "${nodejsHome}/bin:${env.PATH}"
                }
                sh 'npm install || { echo "npm install failed"; exit 1; }'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
                sh 'ls -al' // List files to verify test results
            }
        }
        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t digitalflake-backend .'
                }
            }
        }
        stage('Deploy Docker Container') {
            steps {
                script {
                    // Stop and remove the existing container if running
                    sh 'docker ps -q -f "name=digitalflake-backend" | xargs -r docker stop | xargs -r docker rm'

                    // Run the new container
                    sh 'docker run -d -p 8080:8080 --name digitalflake-backend digitalflake-backend'
                }
            }
        }
    }
    post {
        always {
            node('built-in'){
           
                archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
            
            }
        }
    }
}
