

# LearnTab

LearnTab is a web application designed to help users create, manage, and review flashcards. It offers a modern interface with responsive design and various features to enhance the flashcard creation experience.

# Features

- **Dynamic Flashcard Creation:** Generate flashcards on various topics using AI models.
- **Responsive Design:** Optimized for mobile, tablet, and desktop views.
- **Real-Time Updates:** Uses Firebase for real-time data management.

## Technologies Used

- **React:** Frontend library for building user interfaces.
- **Next.js:** React framework for server-side rendering and routing.
- **Firebase:** Provides backend services including authentication and real-time database.
- **Clerk:** Manages user authentication and user account management.
- **TailwindCSS:** Utility-first CSS framework for styling the UI.
- **OpenAI GPT-4o-mini:** Powers dynamic flashcard generation.
- **Pinecone:** Vector database for managing and querying flashcard data.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/peterkessibu/LearnTab.git
   cd flashcard-generator
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase and Clerk:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Set up Firestore and configure your security rules.
   - Create a Clerk account and set up your application.
   - Add your Firebase and Clerk configuration to a `.env.local` file:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

     CLERK_FRONTEND_API=your_clerk_frontend_api
     CLERK_API_KEY=your_clerk_api_key
     STRIPE_PUBLIC_KEY=your_stripe_public_key
     ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

- Click the **Generate Flashcards** button to create new flashcards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.



Make sure to replace placeholders like repository links and Firebase/Clerk configuration values with your actual information. Adjust any other sections as needed for your project.
