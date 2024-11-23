# Snake Game Project

Welcome to the **Snake Game** project! This project is a modern take on the classic Snake Game, developed as a web-based application. The game features a vibrant user interface with a retro gaming vibe, supports user registration and authentication, and keeps track of scores. Additionally, it allows users to interact and play a fun, nostalgic game directly in their browsers.

## Features

- **User Authentication**: Users can sign up, log in, and manage their profile.
- **Snake Game**: Users can play a fun version of the classic Snake Game. Controls are arrow-based, and the game involves eating apples to grow and score points while avoiding collisions.
- **Game States**: Users' game data is stored using cookies, session storage, and local storage for a personalized experience.
- **Gamified UI**: The entire UI is designed to evoke a retro arcade atmosphere with gamified elements, including animations and interactive buttons.

## Prerequisites

To run this project, you will need the following installed on your machine:

- **Node.js** (version 14 or above)
- **Angular CLI** (latest version)
- **npm** (comes with Node.js)

## Installation Instructions

### Clone the Repository

First, clone this repository to your local machine using:

```sh
$ git clone <repository-url>
```

### Install Dependencies

Navigate to the project's root directory and install the dependencies by running:

```sh
$ cd snake-game
$ npm install
```

### Configure Environment

The project requires some setup before running. Create a `.env` file in the root directory to add any required environment variables for your database, authentication, etc.
If no database is needed, make sure the local storage and session storage functions are correctly set to store user details and game states.

## Running the Application

### Development Server

To run the Angular development server:

```sh
$ ng serve
```

By default, the application will run on `http://localhost:4200/`. You can visit this URL in your web browser to view the project.

### Running the Backend (Optional)

If your project requires backend support (e.g., for user authentication, API requests, etc.), make sure to start your backend server before running the Angular frontend.

## Usage Instructions

1. **Sign Up**: Navigate to the **Sign Up** page to create an account.
2. **Log In**: Use your credentials to log in.
3. **Play the Game**: Once logged in, click the **Play Now!** button to start the Snake Game. Use the arrow keys to control the snake and try to collect as many apples as possible without crashing.
4. **Check Your Score**: You can visit your profile page to view your high scores and manage your account.

### Controls
- **Arrow Keys**: Use arrow keys (Up, Down, Left, Right) to control the snake.
- **Restart Game**: When the game ends, click the **Restart Game** button to try again.

## Technologies Used

- **Frontend**: Angular, HTML, CSS (with custom styling for a retro, gamified experience)
- **Backend**: Node.js (for API and user authentication - if needed)
- **Data Storage**: Cookies, Local Storage, and Session Storage for storing user and game data.

## Project Structure

```
.
|-- src
|   |-- app
|   |   |-- components
|   |   |-- pages
|   |   |   |-- home
|   |   |   |-- login
|   |   |   |-- signup
|   |   |   |-- game
|   |   |   |-- profile
|   |   |-- services
|   |-- assets
|-- angular.json
|-- package.json
|-- README.md
```

## Screenshots

- **Home Page**: Displays a vibrant welcome screen with options to log in, sign up, or learn the rules.
- **Login/Sign-Up Page**: Custom-styled forms for user registration and login.
- **Game Screen**: The classic Snake Game rendered directly in the browser, with retro-themed animations.
- **Profile Page**: Displays user information along with high scores.

## Contributing

If you'd like to contribute to this project:

1. Fork this repository.
2. Create a new feature branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions regarding the Snake Game project, feel free to reach out:

- **Team X**
- **Members**: Abdelrhman Mersal, Ahmed Alaa, Moataz Rahamu

Thank you for checking out our project! Have fun playing the Snake Game! 🎮🐍

