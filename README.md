# Flashcard Generator

## Overview

The Flashcard Generator is a web application designed to help users create, manage, and review flashcards. Built using modern web technologies, it offers a seamless experience across devices with a focus on responsive design and user-friendly interfaces.

## Tech Stack

- **React JS**: For building the user interface with a component-based architecture.
- **Next.js**: Used for server-side rendering and static site generation, ensuring optimal performance and SEO.
- **Firebase**: Provides backend services including authentication and database management.
- **Clerk**: Handles authentication and user management.
- **TailwindCSS**: For styling and responsive design, ensuring the app looks great on all devices.
- **Stripe API**: Integrated for managing subscriptions and payment plans.
- **OpenAI & Pinecone**: Utilized in the dynamic generation of flashcards based on user input and external data sources.

## Features

- **Dynamic Flashcard Creation**: Generate flashcards on any topic using the gpt-4.o-mini.
- **Responsive Design**: Optimized for mobile, tablet, and desktop views.
- **User Authentication**: Sign up, log in, and manage user sessions with Clerk.
- **Interactive UI**: Built with React and styled with TailwindCSS for a modern and intuitive experience.

## Getting Started

### Prerequisites

- Node.js and npm/yarn
- A Firebase project and Clerk account
- Stripe account for payment integration

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/flashcard-generator.git
   cd flashcard-generator
npm install
# or
yarn install
