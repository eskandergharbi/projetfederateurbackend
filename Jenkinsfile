pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = "eskandergharbi"
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password') // Stocké dans Jenkins
        HEROKU_API_KEY = credentials('heroku-api-key') // Stocké dans Jenkins
        HEROKU_APP_BACKEND = "nom-de-votre-app-backend"
    }

    stages {
        stage('Mettre à jour le dépôt Backend') {
            steps {
                script {
                    if (fileExists('backend/.git')) {
                        // Si le dépôt existe déjà, on récupère la dernière version
                        dir('backend') {
                            sh 'git reset --hard' // Réinitialiser les modifications locales
                            sh 'git pull origin main' // Met à jour avec la dernière version
                        }
                    } else {
                        // Sinon, on clone le dépôt pour la première fois
                        sh 'git clone https://github.com/eskandergharbi/projetfederateurbackend.git backend'
                    }
                }
            }
        }

        stage('Installer dépendances & Tester Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'npm install'
                        sh 'npm test' // Exécute les tests unitaires du backend
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
