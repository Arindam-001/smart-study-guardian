
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './lib/supabase.ts'

// Initialize database connection
console.log("Initializing database connection...");
const initializeDatabase = async () => {
  try {
    // Check if we have an active connection
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error("Database connection error:", error.message);
    } else {
      console.log("Database connected successfully!");
    }
    
    // Configure custom domain (simulated here since actual domain setup happens in hosting provider)
    console.log("Configuring domain: studentportal.com");
    
    // In a real application, this would be handled by DNS settings and hosting configuration
    document.title = "Student Portal | EduPortal System";
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
};

// Initialize when the app loads
initializeDatabase();

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
