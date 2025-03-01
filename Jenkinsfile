pipeline {
    agent any
    environment {
        DOCKER_HUB_USERNAME = "eskandergharbi"
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password') // Credentials Jenkins
        HEROKU_API_KEY = credentials('heroku-api-key') // Credentials Jenkins
        HEROKU_APP_BACKEND = "nom-de-ton-app-backend"
    }

    stages {
        stage('Mettre à jour le dépôt Backend') {
            steps {
                script {
                    if (fileExists('backend/.git')) {
                        dir('backend') {
                            sh 'git reset --hard'
                            sh 'git pull origin main'
                        }
                    } else {
                        sh 'git clone https://github.com/eskandergharbi/projetfederateurbackend.git backend'
                    }
                }
            }
        }

        stage('Installer dépendances Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'npm install'  // Installer les dépendances via npm
                        // sh 'npm test'   // Ligne commentée ou supprimée si tu n'as pas de tests
                    }
                }
            }
        }

        stage('Connexion à Docker Hub et Heroku') {
            steps {
                script {
                    sh 'echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin'
                    sh 'heroku container:login'
                }
            }
        }

        stage('Docker Build & Push Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t $DOCKER_HUB_USERNAME/backend-app .'
                        sh 'docker push $DOCKER_HUB_USERNAME/backend-app'
                    }
                }
            }
        }

        stage('Déployer sur Heroku Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'heroku container:push web --app $HEROKU_APP_BACKEND'
                        sh 'heroku container:release web --app $HEROKU_APP_BACKEND'
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Déploiement du Backend réussi sur Heroku ! 🚀"
        }
        failure {
            echo "❌ Échec du pipeline Backend, vérifiez les logs."
        }
    }
}
