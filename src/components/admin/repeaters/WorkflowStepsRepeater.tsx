'use client'

import { useState } from 'react'

interface WorkflowStepsRepeaterProps {
  initialSteps?: string[]
}

export default function WorkflowStepsRepeater({ 
  initialSteps = []
}: WorkflowStepsRepeaterProps) {
  const [steps, setSteps] = useState<string[]>(
    initialSteps.length > 0 ? initialSteps : ['']
  )

  const addStep = () => {
    setSteps([...steps, ''])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const updateStep = (index: number, value: string) => {
    const updated = steps.map((step, i) => i === index ? value : step)
    setSteps(updated)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="bg-slate-900/50 border-2 border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex gap-3 items-start">
              {/* Step Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>

              {/* Step Input */}
              <input
                type="text"
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder={`Step ${index + 1}: e.g., Sign up for free account`}
                className="flex-1 px-4 py-2 bg-slate-800 border-2 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-all"
              />

              {/* Delete Button */}
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="flex-shrink-0 px-3 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-600 text-red-400 rounded-lg text-sm transition-all"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Hidden JSON field */}
      <input 
        type="hidden" 
        name="workflow_steps_json"
        value={JSON.stringify(steps.filter(s => s.trim() !== ''))}
      />

      {/* Add Step Button */}
      <button
        type="button"
        onClick={addStep}
        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 text-lg"
      >
        <span className="text-2xl">+</span>
        Add Another Step
      </button>
    </div>
  )
}
