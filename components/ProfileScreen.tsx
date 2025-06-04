import React, { useState, useEffect } from 'react';

interface ProfileScreenProps {
  nickname: string;
  onNicknameChange: (newName: string) => void;
  achievements: string[];
  expertise: string;
  onExpertiseChange: (newExpertise: string) => void;
}

const achievementIcons: { [key: string]: string } = {
  "Initiated Learner": "fas fa-seedling text-green-400",
  "Blockchain Basics Started": "fas fa-cubes text-blue-400",
  "Polkadot Advanced Started": "fas fa-project-diagram text-indigo-400",
  "Curious Chatterbox": "fas fa-comments text-yellow-400",
  "Explorer Guide": "fas fa-compass text-teal-400",
  "Personalized Learner": "fas fa-user-check text-pink-400", // Icon for new achievement
  // Add more specific icons as achievements are defined
};

const defaultIcon = "fas fa-medal text-purple-400";


export const ProfileScreen: React.FC<ProfileScreenProps> = ({ nickname, onNicknameChange, achievements, expertise, onExpertiseChange }) => {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editableNickname, setEditableNickname] = useState(nickname);
  const [isEditingExpertise, setIsEditingExpertise] = useState(false);
  const [editableExpertise, setEditableExpertise] = useState(expertise);

  useEffect(() => {
    setEditableNickname(nickname);
  }, [nickname]);

  useEffect(() => {
    setEditableExpertise(expertise);
  }, [expertise]);

  const handleNicknameSave = () => {
    onNicknameChange(editableNickname);
    setIsEditingNickname(false);
  };

  const handleExpertiseSave = () => {
    onExpertiseChange(editableExpertise);
    setIsEditingExpertise(false);
  };


  return (
    <div className="p-4 md:p-8 h-full text-white bg-black bg-opacity-30 backdrop-blur-sm rounded-lg overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-6 text-center">Your Profile</h2>

        {/* Nickname Section */}
        <div className="mb-8 p-4 md:p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">Nickname</h3>
          {isEditingNickname ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editableNickname}
                onChange={(e) => setEditableNickname(e.target.value)}
                className="flex-grow p-2 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                aria-label="Edit nickname"
              />
              <button
                onClick={handleNicknameSave}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                aria-label="Save nickname"
              >
                <i className="fas fa-save mr-1"></i> Save
              </button>
              <button
                onClick={() => {
                  setIsEditingNickname(false);
                  setEditableNickname(nickname); // Reset on cancel
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
                aria-label="Cancel editing nickname"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-200">{nickname}</p>
              <button
                onClick={() => {
                  setEditableNickname(nickname);
                  setIsEditingNickname(true);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
                aria-label="Edit nickname"
              >
                <i className="fas fa-edit mr-1"></i> Edit
              </button>
            </div>
          )}
        </div>

        {/* Expertise Section */}
        <div className="mb-8 p-4 md:p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">Your Background/Expertise</h3>
           {isEditingExpertise ? (
            <div>
              <textarea
                value={editableExpertise}
                onChange={(e) => setEditableExpertise(e.target.value)}
                className="w-full p-2 mb-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none h-24 custom-scrollbar"
                aria-label="Edit your expertise"
                placeholder="E.g., 'Frontend developer', 'Marketing professional'"
              />
              <div className="flex items-center space-x-2">
                 <button
                    onClick={handleExpertiseSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                    aria-label="Save expertise"
                  >
                    <i className="fas fa-save mr-1"></i> Save Expertise
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingExpertise(false);
                      setEditableExpertise(expertise); // Reset on cancel
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
                    aria-label="Cancel editing expertise"
                  >
                    Cancel
                  </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-300 italic whitespace-pre-wrap break-words">
                {expertise || "Not specified yet. Add your background to help personalize examples!"}
              </p>
              <button
                onClick={() => {
                  setEditableExpertise(expertise);
                  setIsEditingExpertise(true);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm ml-2 flex-shrink-0"
                aria-label="Edit expertise"
              >
                <i className="fas fa-edit mr-1"></i> Edit
              </button>
            </div>
          )}
        </div>


        {/* Achievements Section */}
        <div className="p-4 md:p-6 bg-gray-700 bg-opacity-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">Achievements</h3>
          {achievements.length > 0 ? (
            <ul className="space-y-3">
              {achievements.map((achievement, index) => (
                <li 
                  key={index} 
                  className="flex items-center p-3 bg-gray-800 bg-opacity-70 rounded-md shadow hover:bg-gray-700 transition-colors"
                >
                  <i className={`${achievementIcons[achievement] || defaultIcon} text-2xl mr-3 w-8 text-center`}></i>
                  <span className="text-gray-200">{achievement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No achievements unlocked yet. Keep learning and exploring!</p>
          )}
        </div>
      </div>
    </div>
  );
};