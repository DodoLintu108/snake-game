# Snake Game Project

A modern implementation of the classic Snake Game featuring full-stack integration, performance monitoring, and user authentication. This project was developed as part of the Web Programming ICS511 course, successfully completing all milestones.

## Features & Achievements

### Game Implementation (Milestone 2)
- **Game Strategy**
  - Three difficulty levels affecting snake speed and scoring
  - Score increments based on apple collection
  - Game over conditions: wall collision or self-collision
  - Responsive controls using arrow keys

- **Frontend Development**
  - Angular-based main application
  - Vue.js game component
  - Responsive design with breakpoint adaptations
  - Client-side storage implementation (cookies, local storage, session storage)

### Backend Integration (Milestone 3)
- **Server Implementation**
  - Laravel backend with MySQL database
  - RESTful API endpoints for user and score management
  - Server-side cookie initialization
  - Authentication and authorization system

- **Database Structure**
  - Users table: username, password, profile data, credit card info
  - Scores table: user_id, username, score, timestamp
  - Secure data handling and storage

### Performance Monitoring (Milestone 4)
- **LogRocket Integration**
  - Real-time performance tracking
  - User session monitoring
  - Error tracking and reporting
  - Custom performance dashboards

## Technical Stack

### Frontend
- Angular 17 (Main application)
- Vue.js (Game component)
- TypeScript
- HTML5/CSS3

### Backend
- Laravel
- MySQL
- RESTful API

### Monitoring
- LogRocket
- Custom performance metrics
- Analytics dashboards

## Prerequisites

- Node.js (v14+)
- PHP (v8.0+)
- MySQL
- Composer
- Angular CLI
- Vue CLI

## Installation

1. **Clone the Repository**
```bash
git clone <repository-url>
Frontend Setup (Angular)
BASH

cd angular-frontend
npm install
ng serve
Game Component Setup (Vue)
BASH

cd vue-game
npm install
npm run serve
Backend Setup (Laravel)
BASH

cd laravel-backend
composer install
php artisan migrate
php artisan serve
Performance Monitoring
The application implements three key performance metrics:

Game Performance (FPS, move count)
Player Behavior (scores, duration)
Session Analytics (engagement, completion rates)
LogRocket Dashboard Setup
Performance Metrics Dashboard
Player Statistics Dashboard
Session Analytics Dashboard
Security Features
JWT Authentication
Secure password hashing
CSRF protection
XSS prevention
Secure session handling
API Endpoints
User Management

POST /api/auth/register
POST /api/auth/login
GET /api/user/profile
PUT /api/user/profile
Game Data

POST /api/scores
GET /api/scores/top
GET /api/scores/user/{id}
Database Schema
Users Table
SQL

CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    credit_card VARCHAR(255),
    created_at TIMESTAMP
);
Scores Table
SQL

CREATE TABLE scores (
    id INT PRIMARY KEY,
    user_id INT,
    score INT,
    difficulty VARCHAR(50),
    created_at TIMESTAMP
);
Game Features
Difficulty Levels
Easy: Snake speed 300ms, 10 points per apple
Medium: Snake speed 200ms, 20 points per apple
Hard: Snake speed 100ms, 30 points per apple
Scoring System
Base points per apple collection
Bonus points for consecutive collections
Multipliers based on difficulty level
Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
LogRocket for performance monitoring capabilities
The open-source community for various tools and libraries used
Contact
[Abdelrhman Mersal] - [Abdelrhmanmersal108@gmail.com]
