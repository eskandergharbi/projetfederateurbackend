pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = "eskandergharbi"
        DOCKER_HUB_PASSWORD = credentials('docker-hub-password') // Stocké dans Jenkins
        HEROKU_API_KEY = credentials('heroku-api-key') // Stocké dans Jenkins
        HEROKU_APP_BACKEND = "nom-de-votre-app-backend"
    }

    stages {
        stage('Cloner le dépôt Backend') {
            steps {
                script {
                    // Cloner uniquement le dépôt Backend
                    sh 'git clone https://github.com/eskandergharbi/projetfederateurbackend.git backend'
                }
            }
        }

        stage('Installer dépendances & Tester Backend') {
            agent {
                docker {
                    image 'node:18' // Utilise une image Docker avec Node.js 18
                    args '--user root' // Évite les problèmes de permissions
                }
            }
            steps {
                script {
                    dir('backend') {
                        // Vérification des versions de Node.js et npm
                        sh 'node -v'
                        sh 'npm -v'

                        // Installation des dépendances
                        sh 'npm install'

                        // Exécution des tests unitaires avec gestion des erreurs
                        try {
                            sh 'npm test'
                        } catch (Exception e) {
                            echo "❌ Erreur lors des tests !"
                            currentBuild.result = 'FAILURE'
                            throw e
                        }
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
