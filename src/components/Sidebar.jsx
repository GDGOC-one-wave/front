import React from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Idea Summary', description: 'Briefly describe your idea' },
  { id: 2, title: 'Problem Definition', description: 'What problem are you solving?' },
  { id: 3, title: 'Target & BM', description: 'Who is it for? + Simulation' },
  { id: 4, title: 'Solution', description: 'How do you solve it?' },
  { id: 5, title: 'Differentiation', description: 'Why you?' },
];

const Sidebar = ({ activeStep, completedSteps }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto p-6 flex-shrink-0">
      <h2 className="text-xl font-bold text-gray-800 mb-8">Business Plan</h2>
      <div className="space-y-6">
        {STEPS.map((step, index) => {
          const isActive = activeStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          const isLocked = step.id > activeStep && !isCompleted;

          return (
            <div 
              key={step.id} 
              className={`relative pl-8 transition-colors ${isActive ? 'opacity-100' : 'opacity-60'}`}
            >
              {/* Connector Line */}
              {index !== STEPS.length - 1 && (
                <div className="absolute left-3 top-8 bottom-[-24px] w-0.5 bg-gray-200"></div>
              )}

              {/* Icon */}
              <div className="absolute left-0 top-1">
                {isCompleted ? (
                   <CheckCircle className="text-green-500" size={24} />
                ) : isActive ? (
                   <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center">
                     <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                   </div>
                ) : isLocked ? (
                   <Lock className="text-gray-300" size={24} />
                ) : (
                   <Circle className="text-gray-300" size={24} />
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className={`font-semibold ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                  Step {step.id}
                </h3>
                <p className="text-sm font-medium text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
