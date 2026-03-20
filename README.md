# Missing Persons Identification System

## Problem Use Case
Every year, thousands of people go missing globally, causing immense distress to their families and communities. Traditional methods of locating missing persons rely heavily on manual searches, physical posters, and fragmented, localized databases. These methods are often slow, inefficient, and fail to scale across different regions. When an unidentified person is found, matching them against thousands of missing person reports is a daunting, time-consuming task for law enforcement and NGOs. There is a critical need for a centralized, intelligent, and accessible system that can quickly and accurately match found individuals with reported missing persons using advanced facial recognition technology, thereby accelerating reunions and providing closure to families.

## Solution Overview
This application provides a comprehensive, scalable platform for registering missing persons and identifying them using AI-powered facial recognition. It leverages Google's state-of-the-art Gemini AI for generating high-dimensional facial embeddings and Firebase for secure, real-time data storage and retrieval. The system allows users to upload photos or capture images via webcam, instantly comparing them against a database of missing persons to find potential matches.

## Architecture & Services
The application is built using a modern, serverless, and highly scalable architecture:

1. **Frontend (Client-Side)**: 
   - **React.js with TypeScript**: Provides a robust, type-safe, and interactive user interface.
   - **Tailwind CSS**: Ensures a responsive, accessible, and visually appealing design across all devices.
   - **i18next**: Delivers multilingual support (English, Hindi, Telugu) to make the platform accessible to a diverse user base.

2. **AI & Machine Learning (Core Logic)**: 
   - **Google Gemini API (`gemini-embedding-2-preview`)**: The core of the identification system. It processes uploaded or captured images to generate high-dimensional facial embeddings (mathematical representations of facial features). This allows for semantic vector matching (cosine similarity) rather than simple, error-prone pixel comparison.
   - **Google Gemini API (`gemini-3-flash-preview`)**: Available for potential future enhancements, such as multimodal analysis of clothing or distinguishing marks.

3. **Backend & Database (Data Layer)**: 
   - **Google Cloud Firestore**: A flexible, scalable NoSQL document database used to store missing person records. It securely holds metadata (name, age, physical description, last seen location) and the generated facial embeddings.
   - **Firebase Security Rules**: Enforces strict data access policies, ensuring data integrity and preventing unauthorized modifications while allowing necessary public reads for the search functionality.

4. **Hosting & Deployment**: 
   - Designed to be deployed on **Google Cloud Run** for fully managed, scalable, and containerized execution, ensuring high availability and performance even under heavy load.

## Key Features
- **Register Missing Persons**: A secure, user-friendly form to input detailed information and images of missing individuals.
- **AI Facial Recognition Search**: Users can upload a photo or use their device's webcam to capture an image. The system instantly generates an embedding using Gemini and performs a rapid cosine similarity search against the Firestore database to identify potential matches with high confidence.
- **Multilingual Support**: Breaks down language barriers with support for English, Hindi, and Telugu.
- **Real-time Dashboard**: Displays statistics and recently reported missing persons, keeping the community informed.

## Security Implementation
- **Data Validation**: Strict validation is enforced on both the client-side (React forms) and server-side (Firestore Security Rules) to ensure data integrity and prevent malformed data entry.
- **Sanitization**: All user inputs are sanitized to mitigate injection attacks.
- **Access Control**: Firestore rules are meticulously configured to restrict unauthorized modifications while allowing public reads specifically for the search functionality, balancing security with usability.
- **Environment Variables**: Sensitive credentials, such as the `GEMINI_API_KEY`, are securely managed using environment variables and are never exposed in the client-side code.

## Accessibility
- **Semantic HTML**: Uses proper HTML5 elements for structure and meaning.
- **ARIA Labels**: Comprehensive use of ARIA attributes (`aria-label`, `aria-hidden`, `aria-busy`, `role="status"`) to ensure full compatibility with screen readers.
- **Keyboard Navigation**: Interfaces are fully navigable using a keyboard.
- **High Contrast**: Color schemes are designed to meet WCAG contrast requirements for users with visual impairments.

## Testing
- **Component Testing**: Utilizes Vitest and React Testing Library to ensure UI components render correctly, state is managed reliably, and user interactions function as expected.
- **Test Coverage**: Includes tests for key components like the Header and Home dashboard.
