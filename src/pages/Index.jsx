import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodSelector from '../components/MoodSelector';
import NotificationButton from '../components/NotificationButton';
import MoodRatingScale from '../components/MoodRatingScale';
import InitialMoodAssessment from '../components/InitialMoodAssessment';
import LanguageToggle from '../components/LanguageToggle';
import ReflectionPrompt from '../components/ReflectionPrompt';
import ProgressTracker from '../components/ProgressTracker';
import MindfulnessExercise from '../components/MindfulnessExercise';
import UserStats from '../components/UserStats';
import { selectActivity } from '../utils/gameSelector';
import { getPersonalizedRecommendation } from '../utils/personalizedRecommendations';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Instagram, AtSign, X, Home, ArrowLeft } from 'lucide-react';

const Index = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [suggestedActivity, setSuggestedActivity] = useState(null);
  const [initialMoodRating, setInitialMoodRating] = useState(null);
  const [finalMoodRating, setFinalMoodRating] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [totalMoodImprovement, setTotalMoodImprovement] = useState(0);

  useEffect(() => {
    const storedMoodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodHistory(storedMoodHistory);
    const storedUserCount = parseInt(localStorage.getItem('userCount') || '0');
    setUserCount(storedUserCount);
    const storedTotalMoodImprovement = parseFloat(localStorage.getItem('totalMoodImprovement') || '0');
    setTotalMoodImprovement(storedTotalMoodImprovement);
  }, []);

  useEffect(() => {
    if (selectedMood && selectedMood.label) {
      const personalizedActivity = getPersonalizedRecommendation(moodHistory, selectActivity(selectedMood.label, language));
      setSuggestedActivity(personalizedActivity || selectActivity(selectedMood.label, language));
    }
  }, [selectedMood, language, moodHistory]);

  const handleNotificationClick = () => {
    setCurrentPage(2);
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setCurrentPage(3);
  };

  const handleInitialAssessmentComplete = (moodValue) => {
    setInitialMoodRating(moodValue);
    setCurrentPage(4);
  };

  const handleActivityComplete = () => {
    setCurrentPage(5);
  };

  const handleReflectionComplete = () => {
    setCurrentPage(6);
  };

  const handleMindfulnessComplete = () => {
    setCurrentPage(7);
  };

  const handleMoodRating = (rating) => {
    setFinalMoodRating(rating);
    const moodImprovement = rating - initialMoodRating;

    const newMoodEntry = {
      date: new Date().toISOString(),
      mood: rating
    };
    const updatedMoodHistory = [...moodHistory, newMoodEntry];
    setMoodHistory(updatedMoodHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedMoodHistory));

    const newUserCount = userCount + 1;
    const newTotalMoodImprovement = totalMoodImprovement + moodImprovement;
    setUserCount(newUserCount);
    setTotalMoodImprovement(newTotalMoodImprovement);
    localStorage.setItem('userCount', newUserCount.toString());
    localStorage.setItem('totalMoodImprovement', newTotalMoodImprovement.toString());

    setCurrentPage(8);
  };

  const handleEndSession = () => {
    setCurrentPage(1);
    resetState();
  };

  const resetState = () => {
    setSelectedMood(null);
    setSuggestedActivity(null);
    setInitialMoodRating(null);
    setFinalMoodRating(null);
  };

  const handleShare = (platform) => {
    const shareText = t.shareMessage
      .replace('{initial}', initialMoodRating)
      .replace('{final}', finalMoodRating)
      .replace('{activity}', suggestedActivity.name);
    let shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

    if (platform === 'instagram') {
      shareUrl = `https://www.instagram.com/share?url=${encodeURIComponent(window.location.href)}&caption=${encodeURIComponent(shareText)}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    } else if (platform === 'threads') {
      shareUrl = `https://www.threads.net/`;
    }

    window.open(shareUrl, '_blank');
  };

  const handleGoBack = () => {
    setCurrentPage(prevPage => Math.max(1, prevPage - 1));
  };

  const handleGoHome = () => {
    handleEndSession();
    navigate('/');
  };

  const showBackButton = currentPage > 1;
  const showLanguageToggle = currentPage === 1;

  const averageMoodImprovement = userCount > 0 ? (totalMoodImprovement / userCount) * 10 : 0;

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="animated-title w-full h-full flex flex-col items-center justify-between">
            <div className="flex-grow flex items-center justify-center flex-col">
              <h1 className="mooody-title text-4xl sm:text-5xl md:text-6xl font-bold relative z-10 rounded-moody mb-4 opacity-0 animate-fade-in-delayed" style={{ marginTop: '-5cm' }}>MOOODY</h1>
              <p className="text-2xl sm:text-3xl md:text-4xl mt-4 text-center max-w-2xl opacity-0 animate-fade-in-more-delayed relative z-10 font-hevilla" style={{ marginTop: '-7rem' }}>
                {t.subtitle}
              </p>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16" style={{ marginLeft: '-120px' }}>
              <div className="animate-fade-in-button">
                <NotificationButton onClick={handleNotificationClick} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-moody z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-sm w-full relative">
              <h1 className="mooody-title text-3xl sm:text-4xl font-bold mb-6 rounded-moody">MOOODY</h1>
              <MoodSelector onMoodSelect={handleMoodSelect} title={t.moodSelectorTitle} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-sm w-full">
              <InitialMoodAssessment onAssessmentComplete={handleInitialAssessmentComplete} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">{t.suggestedActivityLabel}</h2>
              <p className="text-xl mb-6">{suggestedActivity?.name}</p>
              <Button onClick={handleActivityComplete} className="w-full">{t.endActivity}</Button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-md w-full">
              <ReflectionPrompt onComplete={handleReflectionComplete} onSkip={handleReflectionComplete} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-md w-full">
              <MindfulnessExercise onComplete={handleMindfulnessComplete} onBack={handleGoBack} />
            </div>
          </div>
        );
      case 7:
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-md w-full">
              <MoodRatingScale onRatingSelect={handleMoodRating} />
            </div>
          </div>
        );
      case 8:
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h1 className="mooody-title text-3xl sm:text-4xl font-bold mb-6 rounded-moody">MOOODY</h1>
              <p className="text-xl mb-4">{t.moodImprovement.replace('{initial}', initialMoodRating).replace('{final}', finalMoodRating)}</p>
              <p className="text-md mb-4">{t.activityDone.replace('{activity}', suggestedActivity?.name)}</p>
              <ProgressTracker moodData={moodHistory} />
              <UserStats userCount={userCount} averageMoodImprovement={averageMoodImprovement} />
              <p className="text-lg font-semibold mt-6 mb-2">{t.shareProgressCTA}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Button onClick={() => handleShare('instagram')}><Instagram className="h-4 w-4 mr-2" /> Instagram</Button>
                <Button onClick={() => handleShare('twitter')}>X</Button>
                <Button onClick={() => handleShare('facebook')}>Meta</Button>
                <Button onClick={() => handleShare('threads')}><AtSign className="h-4 w-4 mr-2" /> Threads</Button>
              </div>
              <Button onClick={handleEndSession} className="mt-4 w-full">{t.newSession}</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-moody text-moodyText overflow-hidden">
      {showLanguageToggle && <LanguageToggle />}
      <Button
        onClick={handleGoHome}
        className="fixed top-4 right-4 z-[60]"
        variant="outline"
        size="icon"
      >
        <Home className="h-4 w-4" />
      </Button>
      {showBackButton && (
        <Button
          onClick={handleGoBack}
          className="fixed bottom-4 left-4 z-[60]"
          variant="outline"
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div className="relative w-full h-screen flex flex-col items-center justify-center p-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className={`ball ball${i + 1}`}></div>
        ))}
        <div className="fixed top-4 left-4 z-[70] bg-white px-2 py-1 rounded-full text-sm font-bold">
          {currentPage}/8
        </div>
        {renderPage()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 text-center p-2 bg-gray-100 text-gray-500 text-xs italic">
        {language === 'de' ? 
          "Diese App ersetzt keine professionelle psychologische oder medizinische Beratung. Bei ernsthaften mentalen Problemen oder Krisen suchen Sie bitte einen Spezialisten oder Therapeuten auf." :
          "This app does not replace professional psychological or medical advice. For serious mental health issues or crises, please consult a specialist or therapist."
        }
      </div>
    </div>
  );
};

export default Index;