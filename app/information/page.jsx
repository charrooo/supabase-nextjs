'use client';

import { useState } from 'react';

const users = [
  { id: 1, name: 'John Doe', role: 'Full Stack Developer', bio: 'A passionate developer...', location: 'San Francisco, CA', email: 'john.doe@example.com', img: 'https://www.placecage.com/200/200' },
  { id: 2, name: 'Jane Smith', role: 'Product Designer', bio: 'Creative mind with a passion for design...', location: 'New York, NY', email: 'jane.smith@example.com', img: 'https://www.placecage.com/200/200' },
  { id: 3, name: 'Alice Johnson', role: 'Graphic Designer', bio: 'Designing with a love for aesthetics...', location: 'Los Angeles, CA', email: 'alice.johnson@example.com', img: 'https://www.placecage.com/200/200' },
];

export default function ProfilePage() {
  const [friendRequests, setFriendRequests] = useState({});
  const [messages, setMessages] = useState({});

  const handleSendFriendRequest = (userId) => {
    setFriendRequests((prevState) => ({
      ...prevState,
      [userId]: 'Sent',
    }));
    alert(`Friend request sent to user ${userId}`);
  };

  const mainUser = users[0]; 
  
  return (
    <div className="min-h-screen bg-gray-100 relative flex flex-col items-start pl-6 py-8">
      <div className="flex space-x-6 w-full mb-8">
        <div className="flex flex-col space-y-6 w-1/2 h-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center">
              <img
                src={mainUser.img}
                alt="Profile Picture"
                className="w-40 h-40 rounded-full border-4 border-indigo-500 mb-6"
              />
              <h2 className="text-3xl font-semibold text-gray-800">{mainUser.name}</h2>
              <h3 className="text-xl text-gray-600 mt-2">{mainUser.role}</h3>
              <p className="text-gray-500 text-center mt-2">{mainUser.bio}</p>
              <div className="mt-4 w-full text-left">
                <p className="text-gray-600 font-semibold">Location:</p>
                <p className="text-gray-500">{mainUser.location}</p>
                <p className="text-gray-600 font-semibold mt-2">Email:</p>
                <p className="text-gray-500">{mainUser.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h3>

            <div className="border-b border-gray-300 pb-4 mb-4">
              <p className="text-gray-800 font-semibold">Alice</p>
              <p className="text-gray-500 text-sm">"Great profile! Your work as a developer is really inspiring."</p>
            </div>

            <div className="border-b border-gray-300 pb-4 mb-4">
              <p className="text-gray-800 font-semibold">Bob</p>
              <p className="text-gray-500 text-sm">"Love your projects! Keep up the great work, John!"</p>
            </div>


            <div className="border-b border-gray-300 pb-4 mb-4">
              <p className="text-gray-800 font-semibold">Charlie</p>
              <p className="text-gray-500 text-sm">"Very impressive background in full stack development. Looking forward to seeing more!"</p>
            </div>
          </div>
        </div>


        <div className="flex flex-col w-1/2 h-full overflow-auto">
          {users.map((user) => (
            user.id !== mainUser.id && (
              <div key={user.id} className="bg-white rounded-lg shadow-lg p-6 mb-6 flex items-center space-x-6 h-28">
                <img
                  src={user.img}
                  alt="Profile Picture"
                  className="w-16 h-16 rounded-full border-4 border-indigo-500"
                />
                <div className="flex flex-col space-y-2 w-full">
                  <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full w-full"
                    onClick={() => handleSendFriendRequest(user.id)}
                  >
                    Add Friend
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
      <a
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 w-full sm:w-64 px-4 sm:px-5 mt-6"
        href="/account"
      >
        Back
      </a>
    </div>
  );
}
