import React, { useState, useEffect } from 'react';
import MoodBalls from '../components/MoodBalls';
import CustomEmotionModal from '../components/CustomEmotionModal';
import LanguageToggle from '../components/LanguageToggle';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

const Mood = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customEmotion, setCustomEmotion] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleEmotionSelect = (emotion) => {
    if (emotion === 'custom' && !customEmotion) {
      setIsModalOpen(true);
    } else if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter(e => e !== emotion));
    } else if (selectedEmotions.length < 3) {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleCustomEmotionAdd = (newEmotion) => {
    setCustomEmotion(newEmotion);
    setSelectedEmotions([...selectedEmotions, newEmotion]);
    setIsModalOpen(false);
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-mooody-newBackground text-mooody-green overflow-hidden ${fadeIn ? 'fade-in' : ''}`}>
      <style jsx>{`
        @keyframes clarify {
          from { filter: blur(5px); opacity: 0; }
          to { filter: blur(0); opacity: 1; }
        }
        .clarify-text {
          animation: clarify 1s ease-out forwards;
        }
      `}</style>
      <LanguageToggle />
      <Button
        onClick={() => navigate('/home')}
        className="fixed top-4 right-4 z-[60]"
        variant="outline"
        size="icon"
      >
        <Home className="h-4 w-4" />
      </Button>
      <div className="relative w-full h-screen flex flex-col items-center justify-center p-4">
        <h2 className={`text-xl mb-4 z-10 ${fadeIn ? 'clarify-text' : ''}`}>{t.selectUpToThreeMoods}</h2>
        <MoodBalls 
          showText={true} 
          textColor="text-gray-700" 
          selectedEmotions={selectedEmotions}
          onEmotionSelect={handleEmotionSelect}
          onCustomEmotionClick={() => setIsModalOpen(true)}
          customEmotion={customEmotion}
        />
      </div>
      {selectedEmotions.length > 0 && (
        <Button
          onClick={() => navigate('/selected-mood', { state: { selectedEmotions } })}
          className="fixed bottom-4 right-4 z-[60] rounded-full"
          size="icon"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
      <CustomEmotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleCustomEmotionAdd}
      />
    </div>
  );
};

export default Mood;