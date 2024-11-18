pipeline{
   agent { label 'built-in' }
   environment {
    NODE_ENV = 'production'
    PORT = '8080'
    CORS_ORIGIN = "*"
    ACCESS_TOKEN_SECRET = credentials('access_token_secret')
    ACCESS_TOKEN_EXPIRY = '1d'
    REFRESH_TOKEN_EXPIRY = '10d'
    REFRESH_TOKEN_SECRET = credentials('refresh_token_secret')
    CLOUDINARY_CLOUD_NAME = credentials('cloudinary_cloud_name')
    CLOUDINARY_API_KEY = credentials('cloudinary_api_key')
    CLOUDINARY_API_SECRET = credentials('cloudinary_api_secret')
    MONGODB_URI = credentials('mongodb_uri')
}

stages {
        stage('Clone Repository') {
            steps {
               script {
                    echo 'Cloning repository...'
                }
                       git branch: 'main', url: 'https://github.com/swapnilbhakare/digitalflake-backend'

            }
        }
        stage('Install Dependencies') {
            steps {
                script {
                      echo 'Setting up NodeJS environment...'

                    def nodejsHome = tool name: 'NodeJS', type: "NodeJS"
                    env.PATH = "${nodejsHome}/bin:${env.PATH}"
         
                   sh 'node -v'  
                  echo 'Installing npm dependencies...'
                }
                sh 'npm install || { echo "npm install failed"; exit 1; }'
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    echo 'Running tests...'
                }
                sh 'npm test'
                   echo 'Listing files after tests...'

                sh 'ls -al' // List files to verify test results
            }
        }
        stage('Build Application') {
            steps {
               script {
                    echo 'Building application...'
                }
                sh 'npm run build'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                      echo 'Building Docker image...'

                    sh 'docker build -t digitalflake-backend .'
                }
            }
        }
        stage('Deploy Docker Container') {
            steps {
                script {
                      echo 'Stopping and removing any existing container...'

                    // Stop and remove the existing container if running
                    sh 'docker ps -q -f "name=digitalflake-backend" | xargs -r docker stop | xargs -r docker rm'
                    echo 'Deploying new Docker container...'

                    // Run the new container
                    sh 'docker run -d -p 8080:8080 --name digitalflake-backend digitalflake-backend'
                }
            }
        }
    }
    post {
        always {
            node('built-in'){
               echo 'Archiving artifacts...'

                archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
            
            }
        }
       success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs for errors.'
        }
    }
}
