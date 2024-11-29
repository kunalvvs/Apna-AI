import React, { useState } from 'react';
import { Bot, Github, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { SettingsModal } from '../Settings/SettingsModal';

export function Header() {
  const { user, signOut } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">AI Assistant</span>
            </div>
            <nav className="flex items-center space-x-4">
              {user && (
                <>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <Settings className="h-6 w-6" />
                  </button>
                  <button
                    onClick={signOut}
                    className="text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              )}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <Github className="h-6 w-6" />
              </a>
            </nav>
          </div>
        </div>
      </header>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}