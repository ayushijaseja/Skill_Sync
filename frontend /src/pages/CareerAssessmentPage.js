import  { useState, useCallback } from 'react';

const questions = [
  // Linguistic (3)
  { id: 'q1', text: 'I enjoy reading complex books, articles, or journals.', intelligence: 'linguistic' },
  { id: 'q2', text: 'I am good at explaining my ideas to others, either in writing or speech.', intelligence: 'linguistic' },
  { id: 'q3', text: 'Learning a new language sounds like a fun challenge to me.', intelligence: 'linguistic' },
  // Logical-Mathematical (3)
  { id: 'q4', text: 'I am drawn to logic puzzles, number games, or strategy games.', intelligence: 'logical_mathematical' },
  { id: 'q5', text: 'I like to find patterns in data or behavior.', intelligence: 'logical_mathematical' },
  { id: 'q6', text: 'I prefer arguments to be based on facts and logic rather than emotion.', intelligence: 'logical_mathematical' },
  // Spatial-Visualization (3)
  { id: 'q7', text: 'I am good at reading maps, charts, and diagrams.', intelligence: 'spatial_visualization' },
  { id: 'q8', text: 'I can easily visualize objects in 3D in my mind.', intelligence: 'spatial_visualization' },
  { id: 'q9', text: 'I have a good sense of direction and rarely get lost.', intelligence: 'spatial_visualization' },
  // Interpersonal (3)
  { id: 'q10', text: 'I enjoy working in a team and collaborating with others.', intelligence: 'interpersonal' },
  { id: 'q11', text: 'I am often the person others come to for advice or to resolve conflicts.', intelligence: 'interpersonal' },
  { id: 'q12', text: 'I am skilled at sensing other people\'s feelings and motivations.', intelligence: 'interpersonal' },
  // Musical (2)
  { id: 'q13', text: 'I can easily recognize when a song is off-key or out of rhythm.', intelligence: 'musical' },
  { id: 'q14', text: 'I often find myself tapping my feet or humming along to music.', intelligence: 'musical' },
  // Bodily-Kinesthetic (2)
  { id: 'q15', text: 'I enjoy hands-on activities, like building models, crafting, or using tools.', intelligence: 'bodily' },
  { id: 'q16', text: 'I learn best by doing and am often physically active (e.g., sports, dance, exercise).', intelligence: 'bodily' },
  // Intrapersonal (2)
  { id: 'q17', text: 'I am very self-aware and understand my own strengths and weaknesses.', intelligence: 'intrapersonal' },
  { id: 'q18', text: 'I set personal goals for myself and regularly reflect on my progress.', intelligence: 'intrapersonal' },
  // Naturalist (2)
  { id: 'q19', text: 'I feel a strong connection to nature and the outdoors.', intelligence: 'naturalist' },
  { id: 'q20', text: 'I am good at categorizing things and noticing details in plants, animals, or nature.', intelligence: 'naturalist' },
];


function calculateScores(answers) {
  const scores = {
    linguistic: { total: 0, count: 0 },
    musical: { total: 0, count: 0 },
    bodily: { total: 0, count: 0 },
    logical_mathematical: { total: 0, count: 0 },
    spatial_visualization: { total: 0, count: 0 },
    interpersonal: { total: 0, count: 0 },
    intrapersonal: { total: 0, count: 0 },
    naturalist: { total: 0, count: 0 },
  };

  for (const question of questions) {
    const answerValue = parseInt(answers[question.id], 10);
    if (!isNaN(answerValue)) {
      scores[question.intelligence].total += answerValue;
      scores[question.intelligence].count += 1;
    }
  }

  const finalScores = {};
  for (const key in scores) {
    if (scores[key].count > 0) {
      finalScores[key] = (scores[key].total / scores[key].count) * 4;
    } else {
      finalScores[key] = 0;
    }
  }

  console.log(finalScores);
  return finalScores;
}


async function mockFetchPrediction(scores) {
  console.log("Sending scores to API:", scores);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let highestScore = 0;
      let bestFit = 'Generalist';
      const mapping = {
        linguistic: 'Writer / Journalist',
        musical: 'Musician / Composer',
        bodily: 'Athlete / Crafts-person',
        logical_mathematical: 'Engineer / Scientist',
        spatial_visualization: 'Architect / Designer',
        interpersonal: 'Teacher / Manager',
        intrapersonal: 'Researcher / Philosopher',
        naturalist: 'Biologist / Ecologist',
      };

      for (const [key, value] of Object.entries(scores)) {
        if (value > highestScore) {
          highestScore = value;
          bestFit = mapping[key] || 'Generalist';
        }
      }
      
      // Simulate a potential network error (uncomment to test)
      // if (Math.random() > 0.8) {
      //   reject(new Error("Mock API network error."));
      //   return;
      // }

      resolve({ predicted_profession: bestFit });
    }, 1500); 
  });
}


function Systum() {
  const [page, setPage] = useState('assessment'); 
  const [personalInfo, setPersonalInfo] = useState(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState(null);
  const [apiResult, setApiResult] = useState({
    prediction: null,
    loading: false,
    error: null,
  });


  const handleAssessmentSubmit = useCallback(async (answers) => {
    setAssessmentAnswers(answers);
    setPage('results');
    setApiResult({ prediction: null, loading: true, error: null });

    try {
      const scores = calculateScores(answers);
      
      const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scores),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'API Error');

      setApiResult({
        prediction: data.predicted_profession,
        loading: false,
        error: null,
      });

    } catch (err) {
      console.error(err);
      setApiResult({
        prediction: null,
        loading: false,
        error: err.message || 'Failed to fetch prediction.',
      });
    }
  }, []);
  
  const handleRestart = useCallback(() => {
    setPersonalInfo(null);
    setAssessmentAnswers(null);
    setApiResult({ prediction: null, loading: false, error: null });
    setPage('assessment');
  }, []);
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4">
      <div className="mx-auto w-full max-w-3xl">
        {page === 'assessment' && (
          <CareerAssessmentPage
            onSubmit={handleAssessmentSubmit}
          />
        )}
        {page === 'results' && (
          <ResultsPage 
            result={apiResult} 
            onRestart={handleRestart} 
            name={personalInfo?.name || 'User'}
          />
        )}
      </div>
    </div>
  );
}

function AssessmentStepper({ currentStep }) {
  const steps = [
    { id: 1, name: 'Personal Info' },
    { id: 2, name: 'Assessment' },
    { id: 3, name: 'Results' },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {step.id < currentStep ? (
              // Completed Step
              <div className="flex items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                <span className="ml-4 hidden text-sm font-medium text-gray-900 dark:text-white sm:block">{step.name}</span>
              </div>
            ) : step.id === currentStep ? (
              // Current Step
              <div className="flex items-center" aria-current="step">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                </span>
                <span className="ml-4 hidden text-sm font-medium text-indigo-600 dark:text-indigo-400 sm:block">{step.name}</span>
              </div>
            ) : (
              // Upcoming Step
              <div className="flex items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                </span>
                <span className="ml-4 hidden text-sm font-medium text-gray-500 dark:text-gray-400 sm:block">{step.name}</span>
              </div>
            )}

            {/* Connector */}
            {stepIdx !== steps.length - 1 ? (
              <div className={`absolute left-10 top-1/2 -ml-px w-full -translate-y-1/2 ${step.id < currentStep ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`} style={{height: '2px', left: '2.5rem', right: '0'}} />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CareerAssessmentPage({ onSubmit, onBack }) {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (error) setError(null); 
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      setError(`Please answer all ${questions.length} questions. You're missing ${questions.length - answeredCount}.`);
      window.scrollTo(0, 0); 
    } else {
      setError(null);
      onSubmit(answers);
    }
  };

  const options = [
    { label: 'Strongly Disagree', value: 1 },
    { label: 'Disagree', value: 2 },
    { label: 'Neutral', value: 3 },
    { label: 'Agree', value: 4 },
    { label: 'Strongly Agree', value: 5 },
  ];

  return (
    <>
      <AssessmentStepper currentStep={2} />
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Career Assessment Test
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Answer the following {questions.length} questions to help us understand your interests.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="mt-8 space-y-8">
          {questions.map((q, index) => (
            <fieldset key={q.id}>
              <legend className="text-base font-medium text-gray-900 dark:text-white">
                <span className="font-bold">{index + 1}/{questions.length}:</span> {q.text}
              </legend>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-4 sm:gap-x-8">
                {options.map((opt) => (
                  <div key={opt.value} className="flex items-center">
                    <input
                      id={`${q.id}-${opt.value}`}
                      name={q.id}
                      type="radio"
                      value={opt.value}
                      checked={answers[q.id] === String(opt.value)}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`${q.id}-${opt.value}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
            <button
              type="button"
              onClick={onBack} 
              className="mt-4 sm:mt-0 w-full sm:w-auto rounded-md bg-white px-5 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600"
            >
              ← Back to Personal Info
            </button>
            <button
              type="button"
              onClick={handleSubmit} 
              className="w-full sm:w-auto rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Finish & Get Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ResultsPage({ result, onRestart, name }) {
  const { prediction, loading, error } = result;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <svg className="h-12 w-12 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Calculating Your Results...</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Please wait a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300">An Error Occurred</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      );
    }

    if (prediction) {
      return (
        <div className="text-center">
          <span className="text-5xl" role="img" aria-label="party popper">🎉</span>
          <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Thanks, {name}! Here is your result.
          </h3>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Based on your answers, a strong potential career path for you is:
          </p>
          <p className="mt-6 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {prediction}
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            This is a recommendation based on your self-reported interests and personality traits.
          </p>
        </div>
      );
    }
    
    return null; // Should not happen
  };

  return (
    <>
      <AssessmentStepper currentStep={3} />
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 animate-fade-in">
        <div className="min-h-[200px] flex items-center justify-center">
          {renderContent()}
        </div>
        
        <div className="flex justify-center border-t border-gray-200 pt-6 mt-8 dark:border-gray-700">
          <button
            type="button"
            onClick={onRestart}
            className="rounded-md bg-white px-5 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600"
          >
            ← Start Over
          </button>
        </div>
      </div>
    </>
  );
}

export default Systum;