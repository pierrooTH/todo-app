# Todo App

Une application de gestion de tâches développée avec NestJS (backend) et Vue 3 (frontend).

## Fonctionnalités

-   Création, modification et suppression de tâches
-   Marquage des tâches comme terminées, en cours ou à faire
-   Filtrage des tâches par statut

## Structure du projet

```
TodoApp/
├── backend/         # API NestJS
└── frontend/        # Application Vue 3
```

## Prérequis

-   Node.js (LTS)
-   npm ou yarn
-   MongoDB

## Installation et démarrage

### Backend (NestJS)

1. Accédez au dossier du backend :

    ```bash
    cd backend
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

3. Créez un fichier `.env` à la racine du dossier backend avec la configuration de la base de données :

    ```
    MONGO_URI=mongodb://localhost:27017/todomanager
    ```

    Remplacez les informations de connexion par celles de votre base de données MongoDB.

4. Démarrez le serveur :

    ```bash
    npm run start
    ```

    Le serveur sera accessible à l'adresse : http://localhost:3000

### Frontend (Vue 3)

1. Dans un nouveau terminal, accédez au dossier du frontend :

    ```bash
    cd frontend
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

3. Démarrez l'application :

    ```bash
    npm run dev
    ```

    L'application sera accessible à l'adresse : http://localhost:5173

## Technologies utilisées

### Backend

-   NestJS
-   MongoDB avec Mongoose
-   Validation des données avec class-validator

### Frontend

-   Vue 3 avec Composition API
-   Vue Router
-   Axios pour les requêtes HTTP
-   Tailwind CSS pour le style

## API Endpoints

Le backend expose les endpoints suivants :

-   `GET /todos` : Récupérer toutes les tâches
-   `GET /todos/:id` : Récupérer une tâche spécifique
-   `POST /todos` : Créer une nouvelle tâche
-   `PATCH /todos/:id` : Mettre à jour une tâche
-   `DELETE /todos/:id` : Supprimer une tâche
