import React from 'react';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4">About</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a demo chat application using a simple AI response generator.
            The responses are generated locally and don't require an API key.
          </p>
          <p className="text-gray-600">
            Feel free to try out the chat functionality and explore the features!
          </p>
        </div>
      </div>
    </div>
  );
}