
import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import Card from '../ui/Card';
import GlobeIcon from '../icons/GlobeIcon';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
                <GlobeIcon className="w-12 h-12 text-cyan-400"/>
                <h1 className="text-4xl font-bold font-orbitron text-white">World Domination</h1>
            </div>
            <p className="text-gray-400">Your legacy awaits. Identify yourself.</p>
        </div>
      
        {isLogin ? <Login /> : <SignUp />}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isLogin ? "Need to establish a dynasty? Sign Up" : "Already have a title? Log In"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthScreen;
