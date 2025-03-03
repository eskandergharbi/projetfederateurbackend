pipeline {
    agent any
    environment {
        DOCKER_HUB_USERNAME = "eskandergharbi"
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password')
        HEROKU_API_KEY = credentials('heroku-api-key')
        HEROKU_APP_BACKEND = "nom-de-ton-app-backend"
    }

    stages {
        stage('Mettre à jour le dépôt Backend') {
            steps {
                script {
                    if (fileExists('projetfederateurbackend/.git')) {
                        dir('projetfederateurbackend') {
                            sh 'git reset --hard'
                            sh 'git pull origin main'
                        }
                    } else {
                        sh 'rm -rf projetfederateurbackend' // Clean any existing folder
                        sh 'git clone https://github.com/eskandergharbi/projetfederateurbackend.git'
                    }
                }
            }
        }

        stage('Installer dépendances Backend') {
            steps {
                script {
                    dir('projetfederateurbackend') {
                        sh 'npm install'
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
                    dir('projetfederateurbackend') {
                        sh 'docker build -t $DOCKER_HUB_USERNAME/backend-app .'
                        sh 'docker push $DOCKER_HUB_USERNAME/backend-app'
                    }
                }
            }
        }

        stage('Déployer sur Heroku Backend') {
            steps {
                script {
                    dir('projetfederateurbackend') {
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
