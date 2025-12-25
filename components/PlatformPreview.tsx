
import React from 'react';

interface PlatformPreviewProps {
  content: string;
  imageUrl?: string;
  platform: 'X' | 'LinkedIn' | 'Instagram';
}

const PlatformPreview: React.FC<PlatformPreviewProps> = ({ content, imageUrl, platform }) => {
  const cleanContent = content.replace(/[*#-]/g, ''); // Basic strip for preview purposes

  const renderX = () => (
    <div className="bg-black text-white p-4 rounded-xl font-sans max-w-sm mx-auto shadow-2xl border border-gray-800">
      <div className="flex space-x-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">OC</div>
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <span className="font-bold">OmniCreator</span>
            <span className="text-gray-500 text-sm">@omnicontent</span>
          </div>
          <p className="mt-1 text-sm leading-normal">{cleanContent.substring(0, 280)}</p>
          {imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800">
              <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover" />
            </div>
          )}
          <div className="mt-3 flex justify-between text-gray-500 text-xs">
            <span>💬 24</span>
            <span>🔁 12</span>
            <span>❤️ 89</span>
            <span>📊 4.2k</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLinkedIn = () => (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-xl font-sans max-w-md mx-auto shadow-xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-12 h-12 rounded bg-indigo-600 flex items-center justify-center font-bold text-white">OC</div>
        <div>
          <p className="font-bold text-sm">OmniContent Studio</p>
          <p className="text-[10px] text-gray-500">1,204 followers • 1h</p>
        </div>
      </div>
      <p className="text-sm mb-3 whitespace-pre-wrap">{cleanContent}</p>
      {imageUrl && (
        <div className="mb-3">
          <img src={imageUrl} alt="LinkedIn Preview" className="w-full h-auto border border-gray-100 dark:border-gray-800" />
        </div>
      )}
      <div className="flex border-t dark:border-gray-800 pt-2 space-x-4 text-gray-500 dark:text-gray-400 font-bold text-xs">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>🔁 Repost</span>
        <span>✈️ Send</span>
      </div>
    </div>
  );

  const renderInstagram = () => (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl font-sans max-w-sm mx-auto shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center p-3 space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center font-bold text-[10px]">OC</div>
        </div>
        <span className="font-bold text-xs">omnicontent_studio</span>
      </div>
      {imageUrl ? (
        <img src={imageUrl} alt="IG Preview" className="w-full aspect-square object-cover" />
      ) : (
        <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 italic">No Media</div>
      )}
      <div className="p-3">
        <div className="flex space-x-4 mb-2">
          <span>❤️</span>
          <span>💬</span>
          <span>✈️</span>
        </div>
        <p className="text-xs font-bold mb-1">1,240 likes</p>
        <p className="text-xs">
          <span className="font-bold mr-2">omnicontent_studio</span>
          {cleanContent.substring(0, 150)}...
        </p>
      </div>
    </div>
  );

  switch (platform) {
    case 'X': return renderX();
    case 'LinkedIn': return renderLinkedIn();
    case 'Instagram': return renderInstagram();
    default: return null;
  }
};

export default PlatformPreview;
