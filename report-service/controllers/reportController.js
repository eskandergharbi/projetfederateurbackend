const axios = require('axios');
const Task = require('../models/Task'); // Assure-toi que le modèle Task est bien importé
const Project = require('../models/Project'); // Assure-toi que le modèle Task est bien importé

// Fonction pour récupérer les projets sans circuit breaker
const fetchProjectData = async (token) => {
    try {
        const response = await axios.get('http://localhost:3012/api/projects', {
            headers: {
                Authorization: `Bearer ${token}`,  // Utilise le token passé en paramètre
            },
        });

        console.log('✅ nnn', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erreur lors de l’appel à l’API des tâches :', {
            message: error.message,
            code: error.code,
            response: error.response ? error.response.data : 'Aucune réponse',
            status: error.response ? error.response.status : 'Statut inconnu',
        });
        throw new Error('Service des tâches indisponible.');
    }
};


// Fonction pour récupérer les statistiques des projets
const fetchTasksForProject = async (projectId) => {
    try {
        return await Task.find({ project: projectId });
    } catch (error) {
        console.error(`❌ Erreur lors de la récupération des tâches pour le projet ${projectId} :`, error);
        throw error;
    }
};

// Fonction pour récupérer les statistiques des projets
exports.getProjectStatistics = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token de l'en-tête Authorization
    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    console.log('📥 Requête reçue pour les statistiques des projets'); // Debugging log

    try {
        // Récupérer les projets via l'API
        const projects = await fetchProjectData(token);  // Passe le token à fetchProjectData
        console.log('📊 Projets récupérés :', projects);

        // Construire les statistiques de chaque projet
        const projectStats = await Promise.all(
            projects.map(async (project) => {
                // Récupérer les tâches associées au projet
                const tasks = await fetchTasksForProject(project._id);
                console.log(tasks);

                return {
                    name: project.name,
                    status: project.status,
                    progress: project.progress,
                    taskCount: tasks.length,
                    completedTasks: tasks.filter(task => task.status === 'completed').length,
                    inProgressTasks: tasks.filter(task => task.status === 'in progress').length,
                    notStartedTasks: tasks.filter(task => task.status === 'not started').length,
                };
            })
        );

        res.json(projectStats);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des statistiques des projets :', error);
        res.status(503).json({ error: 'Erreur lors de la récupération des projets. Service indisponible.' });
    }
};


// Fonction pour récupérer les tâches sans circuit breaker

exports.getTaskStatistics = async (req, res) => {
    console.log('📥 Requête reçue pour les statistiques des tâches');

    try {
        let token = req.headers.authorization; // Récupère le token du header
        if (!token) {
            return res.status(401).json({ error: 'Token manquant.' });
        }

        // Suppression du préfixe "Bearer " si présent
        token = token.replace('Bearer ', '');

        // Récupération des tâches via l'API des tâches
        const tasks = await fetchTaskData(token);

        // Calcul des statistiques
        const taskStats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(task => task.status === 'completed').length,
            inProgressTasks: tasks.filter(task => task.status === 'in progress').length,
            notStartedTasks: tasks.filter(task => task.status === 'not started').length,
        };

        res.json(taskStats);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des statistiques des tâches :', error);
        res.status(503).json({ error: 'Erreur lors de la récupération des tâches. Service indisponible.' });
    }
};

const fetchTaskData = async (token) => {
    try {
        const response = await axios.get('http://localhost:3010/api/tasks', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('✅ Données des tâches récupérées :', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erreur lors de l’appel à l’API des tâches :', {
            message: error.message,
            code: error.code,
            response: error.response ? error.response.data : 'Aucune réponse',
            status: error.response ? error.response.status : 'Statut inconnu',
        });
        throw new Error('Service des tâches indisponible.');
    }
};
