import React from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { ChatContainer } from './components/Chat/ChatContainer';
import { AuthContainer } from './components/Auth/AuthContainer';
import { useAuthStore } from './stores/authStore';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {user ? (
          <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] overflow-hidden">
            <ChatContainer />
          </div>
        ) : (
          <AuthContainer />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;