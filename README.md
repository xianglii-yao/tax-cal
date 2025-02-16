# tax calculator
built with react 19 , node js and mongoDB

## Run on localhost (backend)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/9cloudy/max.ai.git
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and configure the following variables:
   ```env
       DB_URL=""
   ```
5. **Start the development server:**
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.
## Run on localhost (frontend)

2. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

5. **Start the development**
   ```sh
   npm run dev
   ```
## Deployment

To deploy tax-cal, use a cloud hosting provider that supports reactjs and mongoDB, such as **Vercel** or **Railway**.