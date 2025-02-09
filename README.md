
# **AFSS07 Alumni Directory**

## **Overview**

The **AFSS07 Alumni Directory** is a platform designed to bring together members of the Air Force Secondary School Class of 2007. By fostering collaboration and communication, this platform is built to serve as a hub for connecting members, sharing information, and planning group activities, while ensuring privacy and data security.

---

## **Features**

- **User Login and Authentication**
  - Seamless login using **Clerk** with options for Google, Apple, and LinkedIn.
  - Secure and simple onboarding process for new members.

- **Member Management**
  - Centralized member directory to manage profiles and access approvals.

- **Profile Customization**
  - Personalize profiles with photos, career details, and social media links.

- **Privacy and Security**
  - Public profiles display only essential details to foster connections.

- **Feature ideas**
  - **Book Club**: Feature for sharing book recommendations
  - **Job Board**: A space for sharing job opportunities and professional networking.
  - **Automation**: Feature to automate some operation for the group 
  - **Event Management**: Plan and organize reunions, meetups, and group events with ease.
  - **Group Announcements**: Share news, updates, and achievements in a structured way.

---

## **Tech Stack**

- **Frontend**: [Next.js](https://nextjs.org/) – for server-side rendering and dynamic UI.
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) – integrated backend services.
- **Database**: [Neon Serverless Postgres](https://neon.tech/) – scalable and serverless database solution.
- **Authentication**: [Clerk](https://clerk.dev/) – for secure and robust user authentication.

---

## **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/Monehin/AFSS-2007.git
   ```

2. Navigate to the project directory:

   ```bash
   cd AFSS-2007
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure environment variables:
   - Create a `.env.local` file in the root of the project with the following:

     ```env
     DATABASE_URL=<your-neon-postgres-database-url>
     CLERK_API_KEY=<your-clerk-api-key>
     NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
     ```

5. Run the development server:

   ```bash
   npm run dev
   ```

---

## **Contributing**

We welcome contributions from members to improve the platform!

1. Fork the repository.
2. Create a new branch for your feature:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes and push them:

   ```bash
   git add .
   git commit -m "Add feature-name"
   git push origin feature-name
   ```

4. Submit a pull request for review.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## **Contact**

For questions, feedback, or collaboration, feel free to reach out:

- Maintainer: [Emmanuel Monehin](https://github.com/Monehin)
