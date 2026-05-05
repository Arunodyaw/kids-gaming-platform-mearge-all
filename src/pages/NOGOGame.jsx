// NOGOGame.js - Fixed Emotion Capture Hook with Age Restriction (5-8 only)
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NOGOGame.css';
import * as mpFaceMesh from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

// Language translations object
const translations = {
  en: {
    title: "⭐ Rainbow Ball Adventure Game ⭐",
    subtitle: "Let's play and have fun with colorful balls!",
    rules: " Let's Learn the Rules:",
    goRule: "Click ONLY on happy Green balls!",
    nogoRule: "Don't click on tricky Red balls!",
    tip1: "Be quick like a superhero!",
    tip2: "Level up to earn rainbow points!",
    score: "Stars:",
    level: "Magic Level:",
    highScore: "Best Stars:",
    time: "Time:",
    startButton: " Start Rainbow Adventure!",
    correctMessage: "🎉 Yay! Great job! +",
    wrongMessage: "😊 Oops! Try again! -",
    gameOver: "🎮 Game finished! You collected:",
    backButton: "← Back to Home",
    levelUp1: " Level 2! More magical balls!",
    levelUp2: "🌟 Level 3! Super challenge!",
    pleaseSelect: "Please select a language to continue",
    languageTitle: " Choose Your Language",
    selectToContinue: "Pick your favorite language to start the adventure!",
    english: "English",
    sinhala: "සිංහල",
    tamil: "தமிழ்",
    continueBtn: "Start Adventure!",
    changeLanguage: "Change Language",
    selectLanguage: "Select Language",
    soundOn: " Sound On",
    soundOff: " Sound Off",
    clickOnGreen: " Click only on GREEN balls!",
    dontClickOnRed: " Don't click on RED balls!",
    timeRemaining: "Time left:",
    greatJob: "✨ Great job! ✨",
    amazing: "🎯 Amazing!",
    superstar: "⭐ You're a superstar! ⭐",
    levelComplete: "🎈 Level Complete! 🎈",
    tellUsAboutYou: "👋 Tell us about yourself!",
    beforeWeStart: "Before we start our adventure, we'd love to know:",
    age: "How old are you?",
    selectAge: "Select your age (5-8)",
    ageRange: "Ages 5 to 8 only",
    gender: "Are you a boy or a girl?",
    selectGender: "Select",
    boy: "👦 Boy",
    girl: "👧 Girl",
    other: "😊 Prefer not to say",
    startPlaying: " Start Playing!",
    pleaseSelectAge: "Please select your age (5-8 years)",
    pleaseSelectGender: "Please select your gender",
    playerInfo: "Player:",
    ageYears: "yrs",
    sessionId: "Session",
    play: " Play",
    summary: " Game Summary",
    showSummary: " Show Game Summary",
    hideSummary: " Hide Game Summary",
    downloadData: "⬇️ Download Data",
    totalTrials: "Total Trials:",
    correctGo: "✅ Correct GO (Green clicks):",
    incorrectGo: "❌ Wrong GO (Red clicks):",
    correctNoGo: "✅ Correct NO-GO (Didn't click red):",
    incorrectNoGo: "❌ Wrong NO-GO (Clicked red):",
    accuracy: "🎯 Accuracy:",
    avgReactionTime: "⚡ Avg Reaction Time:",
    emotionMetrics: "😊 Emotion Metrics",
    avgValence: "Average Valence (Happiness):",
    avgArousal: "Average Arousal (Excitement):",
    motorMetrics: "🖱️ Movement Metrics",
    avgMotorLeakage: "Avg Motor Leakage:",
    avgResidualMotion: "Avg Residual Motion:",
    totalMicroCorrections: "Total Micro Corrections:",
    playerDetails: "👤 Player Details",
    ageLabel: "Age:",
    genderLabel: "Gender:",
    sessionLabel: "Session #:",
    languageLabel: "Language:",
    gameStats: "🎮 Game Stats",
    finalScore: "Final Score:",
    highestLevel: "Highest Level:",
    timePlayed: "Time Played:",
    noData: "No game data available yet. Play a game to see your summary!",
    viewFullSummary: "View Full Summary",
    closeSummary: "Close Summary",
    exportSuccess: "✅ Data downloaded successfully!",
    summaryTitle: " Your Rainbow Adventure Summary 🌈",
    expressionGrid: "😊 Facial Expression Grid",
    happyLevel: "Happy Level:",
    excitedLevel: "Excited Level:",
    neutralLevel: "Neutral Level:",
    surprisedLevel: "Surprised Level:",
    recordExpressions: "Recording facial expressions with emotion grid",
    ageHint: "🎂 Choose your age (5-8 years only)",
    
  },
  si: {
    title: "⭐ දේදුනු බෝල ත්රාසජනක ක්‍රීඩාව ⭐",
    subtitle: "වර්ණවත් බෝල සමඟ සෙල්ලම් කර විනෝද වෙමු!",
    rules: " නීති ඉගෙන ගනිමු:",
    goRule: " කොළ පැහැති බෝල පමණක් ක්ලික් කරන්න!",
    nogoRule: " රතු පැහැති බෝල ක්ලික් නොකරන්න!",
    tip1: "සුපිරි වීරයෙක් වගේ ඉක්මන් වන්න!",
    tip2: "දේදුනු ලකුණු ලබා ගැනීමට මට්ටම් ඉහළ දමන්න!",
    score: "තරු:",
    level: "මායා මට්ටම:",
    highScore: "හොඳම තරු:",
    time: "වේලාව:",
    startButton: " දේදුනු ත්රාසජනක ගමන ආරම්භ කරන්න!",
    correctMessage: "🎉 යේ! හොඳයි! +",
    wrongMessage: "😊 අපොයි! නැවත උත්සාහ කරන්න! -",
    gameOver: "🎮 ක්‍රීඩාව අවසන්! ඔබ රැස් කළේ:",
    backButton: "← මුල් පිටුවට",
    levelUp1: " මට්ටම 2! තවත් මායා බෝල!",
    levelUp2: "🌟 මට්ටම 3! සුපිරි අභියෝගය!",
    pleaseSelect: "කරුණාකර ඉදිරියට යාමට භාෂාවක් තෝරන්න",
    languageTitle: "🌍 ඔබේ භාෂාව තෝරන්න",
    selectToContinue: "ත්රාසජනක ගමන ආරම්භ කිරීමට ඔබ කැමති භාෂාව තෝරන්න!",
    english: "ඉංග්‍රීසි",
    sinhala: "සිංහල",
    tamil: "දෙමළ",
    continueBtn: "ත්රාසජනක ගමන ආරම්භ කරන්න!",
    changeLanguage: "භාෂාව වෙනස් කරන්න",
    selectLanguage: "භාෂාව තෝරන්න",
    soundOn: " ශබ්දය සක්‍රියයි",
    soundOff: " ශබ්දය අක්‍රියයි",
    clickOnGreen: " කොළ පැහැති බෝල පමණක් ක්ලික් කරන්න!",
    dontClickOnRed: " රතු පැහැති බෝල ක්ලික් නොකරන්න!",
    timeRemaining: "ඉතිරි වේලාව:",
    greatJob: "✨ හොඳයි! ✨",
    amazing: "🎯 විශිෂ්ටයි!",
    superstar: "⭐ ඔබ සුපිරි තරුවක්! ⭐",
    levelComplete: "🎈 මට්ටම සම්පූර්ණයි! 🎈",
    tellUsAboutYou: "👋 ඔබ ගැන අපට කියන්න!",
    beforeWeStart: "අපගේ ත්රාසජනක ගමන ආරම්භ කිරීමට පෙර, අපි දැන ගැනීමට කැමතියි:",
    age: "ඔබගේ වයස කීයද?",
    selectAge: "ඔබගේ වයස තෝරන්න (5-8)",
    ageRange: "අවුරුදු 5 සිට 8 දක්වා පමණි",
    gender: "ඔබ පිරිමි ද ගැහැණු ද?",
    selectGender: "තෝරන්න",
    boy: "👦 පිරිමි",
    girl: "👧 ගැහැණු",
    other: "😊 කියන්න කැමති නැහැ",
    startPlaying: "🎮 සෙල්ලම් කිරීම ආරම්භ කරන්න!",
    pleaseSelectAge: "කරුණාකර ඔබගේ වයස තෝරන්න (5-8)",
    pleaseSelectGender: "කරුණාකර ඔබගේ ස්ත්‍රී පුරුෂ භාවය තෝරන්න",
    playerInfo: "ක්‍රීඩක:",
    ageYears: "හැවිරිදි",
    sessionId: "සැසිය",
    play: " ක්‍රීඩා කරන්න",
    summary: " ක්‍රීඩා සාරාංශය",
    showSummary: " ක්‍රීඩා සාරාංශය පෙන්වන්න",
    hideSummary: " ක්‍රීඩා සාරාංශය සඟවන්න",
    downloadData: "⬇️ දත්ත බාගන්න",
    totalTrials: "සම්පූර්ණ අත්හදාබැලීම්:",
    correctGo: "✅ නිවැරදි GO (කොළ ක්ලික්):",
    incorrectGo: "❌ වැරදි GO (රතු ක්ලික්):",
    correctNoGo: "✅ නිවැරදි NO-GO (රතු නොක්ලික්):",
    incorrectNoGo: "❌ වැරදි NO-GO (රතු ක්ලික්):",
    accuracy: "🎯 නිරවද්‍යතාව:",
    avgReactionTime: "⚡ සාමාන්‍ය ප්‍රතික්‍රියා කාලය:",
    emotionMetrics: "😊 චිත්තවේගීය මිනුම්",
    avgValence: "සාමාන්‍ය සන්තෝෂය:",
    avgArousal: "සාමාන්‍ය උද්දීපනය:",
    motorMetrics: "🖱️ චලන මිනුම්",
    avgMotorLeakage: "සාමාන්‍ය මෝටර් කාන්දුව:",
    avgResidualMotion: "සාමාන්‍ය අවශේෂ චලනය:",
    totalMicroCorrections: "සම්පූර්ණ ක්ෂුද්‍ර නිවැරදි කිරීම්:",
    playerDetails: "👤 ක්‍රීඩක තොරතුරු",
    ageLabel: "වයස:",
    genderLabel: "ස්ත්‍රී පුරුෂ භාවය:",
    sessionLabel: "සැසි අංකය:",
    languageLabel: "භාෂාව:",
    gameStats: " ක්‍රීඩා සංඛ්‍යාලේඛන",
    finalScore: "අවසන් ලකුණු:",
    highestLevel: "ඉහළම මට්ටම:",
    timePlayed: "ක්‍රීඩා කළ කාලය:",
    noData: "තවම ක්‍රීඩා දත්ත නැත. ඔබේ සාරාංශය බැලීමට ක්‍රීඩාවක් කරන්න!",
    viewFullSummary: "සම්පූර්ණ සාරාංශය බලන්න",
    closeSummary: "සාරාංශය වසන්න",
    exportSuccess: "✅ දත්ත සාර්ථකව බාගත කරන ලදී!",
    summaryTitle: " ඔබගේ දේදුනු වික්‍රමයේ සාරාංශය 🌈",
    expressionGrid: "😊 මුහුණේ ඉරියව් ජාලකය",
    happyLevel: "සතුටු මට්ටම:",
    excitedLevel: "උද්දීපන මට්ටම:",
    neutralLevel: "සාමාන්‍ය මට්ටම:",
    surprisedLevel: "පුදුම මට්ටම:",
    recordExpressions: "චිත්තවේග ජාලකය සමඟ මුහුණේ ඉරියව් පටිගත කිරීම",
    ageHint: "🎂 ඔබේ වයස තෝරන්න (අවුරුදු 5-8 පමණි)",
    
  },
  ta: {
    title: "⭐ வானவில் பந்து சாகச விளையாட்டு ⭐",
    subtitle: "வண்ணமயமான பந்துகளுடன் விளையாடி மகிழுங்கள்!",
    rules: " விதிகளைக் கற்றுக்கொள்வோம்:",
    goRule: "மகிழ்ச்சியான பச்சை பந்துகளை மட்டும் கிளிக் செய்யுங்கள்!",
    nogoRule: "தந்திரமான சிவப்பு பந்துகளை கிளிக் செய்யாதீர்கள்!",
    tip1: "சூப்பர் ஹீரோவைப் போல விரைவாக இருங்கள்!",
    tip2: "வானவில் புள்ளிகளைப் பெற நிலை உயர்த்துங்கள்!",
    score: "நட்சத்திரங்கள்:",
    level: "மாய நிலை:",
    highScore: "சிறந்த நட்சத்திரங்கள்:",
    time: "நேரம்:",
    startButton: " வானவில் சாகசத்தைத் தொடங்குங்கள்!",
    correctMessage: "🎉 ஹூரே! சிறப்பு! +",
    wrongMessage: "😊 ஐயோ! மீண்டும் முயற்சிக்கவும்! -",
    gameOver: " விளையாட்டு முடிந்தது! நீங்கள் சேகரித்தது:",
    backButton: "← முகப்புக்குத் திரும்பு",
    levelUp1: " நிலை 2! இன்னும் மாய பந்துகள்!",
    levelUp2: "🌟 நிலை 3! சூப்பர் சவால்!",
    pleaseSelect: "தயவுசெய்து தொடர ஒரு மொழியைத் தேர்ந்தெடுக்கவும்",
    languageTitle: " உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    selectToContinue: "சாகசத்தைத் தொடங்க உங்களுக்குப் பிடித்த மொழியைத் தேர்ந்தெடுக்கவும்!",
    english: "ஆங்கிலம்",
    sinhala: "சிங்களம்",
    tamil: "தமிழ்",
    continueBtn: "சாகசத்தைத் தொடங்குங்கள்!",
    changeLanguage: "மொழியை மாற்றவும்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    soundOn: " ஒலி இயக்கத்தில்",
    soundOff: " ஒலி நிறுத்தத்தில்",
    clickOnGreen: " பச்சை பந்துகளை மட்டும் கிளிக் செய்யுங்கள்!",
    dontClickOnRed: " சிவப்பு பந்துகளை கிளிக் செய்யாதீர்கள்!",
    timeRemaining: "மீதமுள்ள நேரம்:",
    greatJob: "✨ சிறப்பு! ✨",
    amazing: " அற்புதம்!",
    superstar: "⭐ நீங்கள் ஒரு சூப்பர் ஸ்டார்! ⭐",
    levelComplete: "🎈 நிலை முடிந்தது! 🎈",
    tellUsAboutYou: "👋 உங்களைப் பற்றி எங்களுக்குச் சொல்லுங்கள்!",
    beforeWeStart: "எங்கள் சாகசத்தைத் தொடங்குவதற்கு முன், நாங்கள் தெரிந்துகொள்ள விரும்புகிறோம்:",
    age: "உங்கள் வயது என்ன? (5-8 வயது மட்டும்)",
    selectAge: "உங்கள் வயதைத் தேர்ந்தெடுக்கவும் (5-8)",
    ageRange: "5 முதல் 8 வயது வரை மட்டும்",
    gender: "நீங்கள் ஆணா பெண்ணா?",
    selectGender: "தேர்ந்தெடுக்கவும்",
    boy: "👦 ஆண்",
    girl: "👧 பெண்",
    other: "😊 கூற விரும்பவில்லை",
    startPlaying: " விளையாடத் தொடங்குங்கள்!",
    pleaseSelectAge: "தயவுசெய்து உங்கள் வயதைத் தேர்ந்தெடுக்கவும் (5-8)",
    pleaseSelectGender: "தயவுசெய்து உங்கள் பாலினத்தைத் தேர்ந்தெடுக்கவும்",
    playerInfo: "வீரர்:",
    ageYears: "வயது",
    sessionId: "அமர்வு",
    play: " விளையாடு",
    summary: " விளையாட்டு சுருக்கம்",
    showSummary: "விளையாட்டு சுருக்கத்தைக் காட்டு",
    hideSummary: " விளையாட்டு சுருக்கத்தை மறை",
    downloadData: "⬇️ தரவைப் பதிவிறக்கவும்",
    totalTrials: "மொத்த சோதனைகள்:",
    correctGo: "✅ சரியான GO (பச்சை கிளிக்):",
    incorrectGo: "❌ தவறான GO (சிவப்பு கிளிக்):",
    correctNoGo: "✅ சரியான NO-GO (சிவப்பு கிளிக் செய்யவில்லை):",
    incorrectNoGo: "❌ தவறான NO-GO (சிவப்பு கிளிக்):",
    accuracy: " துல்லியம்:",
    avgReactionTime: "⚡ சராசரி எதிர்வினை நேரம்:",
    emotionMetrics: "😊 உணர்வு அளவீடுகள்",
    avgValence: "சராசரி மகிழ்ச்சி:",
    avgArousal: "சராசரி உற்சாகம்:",
    motorMetrics: "🖱️ இயக்க அளவீடுகள்",
    avgMotorLeakage: "சராசரி மோட்டார் கசிவு:",
    avgResidualMotion: "சராசரி எஞ்சிய இயக்கம்:",
    totalMicroCorrections: "மொத்த நுண் திருத்தங்கள்:",
    playerDetails: "👤 வீரர் விவரங்கள்",
    ageLabel: "வயது:",
    genderLabel: "பாலினம்:",
    sessionLabel: "அமர்வு #:",
    languageLabel: "மொழி:",
    gameStats: "🎮 விளையாட்டு புள்ளிவிவரங்கள்",
    finalScore: "இறுதி மதிப்பெண்:",
    highestLevel: "உயர்ந்த நிலை:",
    timePlayed: "விளையாடிய நேரம்:",
    noData: "இன்னும் விளையாட்டு தரவு இல்லை. உங்கள் சுருக்கத்தைப் பார்க்க ஒரு விளையாட்டை விளையாடுங்கள்!",
    viewFullSummary: "முழு சுருக்கத்தைக் காண்க",
    closeSummary: "சுருக்கத்தை மூடு",
    exportSuccess: "✅ தரவு வெற்றிகரமாக பதிவிறக்கம் செய்யப்பட்டது!",
    summaryTitle: " உங்கள் வானவில் சாகச சுருக்கம் 🌈",
    expressionGrid: "😊 முக உணர்வு கட்டம்",
    happyLevel: "மகிழ்ச்சி நிலை:",
    excitedLevel: "உற்சாக நிலை:",
    neutralLevel: "நடுநிலை நிலை:",
    surprisedLevel: "ஆச்சரிய நிலை:",
    recordExpressions: "உணர்வு கட்டத்துடன் முக உணர்வுகளை பதிவு செய்தல்",
    ageHint: "🎂 உங்கள் வயதைத் தேர்ந்தெடுக்கவும் (5-8 வயது மட்டும்)",
    
  }
};

// Language Selection Component
const LanguageSelector = ({ onLanguageSelect }) => {
  const [selectedLang, setSelectedLang] = useState('en');

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
  };

  const handleContinue = () => {
    if (selectedLang) {
      localStorage.setItem('nogo-language', selectedLang);
      onLanguageSelect(selectedLang);
    }
  };

  return (
    <div className="language-selector-screen">
      <div className="language-selector-container">
        <div className="language-header">
          <div className="language-icon">🌈</div>
          <h1>Welcome Little Star! 🌟</h1>
          <p className="language-subtitle">Choose your language to start the rainbow adventure!</p>
        </div>
        
        <div className="language-options-grid">
          <button 
            className={`language-card ${selectedLang === 'en' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('en')}
          >
            <div className="language-card-icon" style={{ background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)' }}>
              <span className="language-flag">🇺🇸</span>
            </div>
            <div className="language-card-content">
              <h3>English</h3>
              <p>Let's play in English!</p>
            </div>
            <div className="language-card-check">
              {selectedLang === 'en' && '✓'}
            </div>
          </button>
          
          <button 
            className={`language-card ${selectedLang === 'si' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('si')}
          >
            <div className="language-card-icon" style={{ background: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)' }}>
              <span className="language-flag">🇱🇰</span>
            </div>
            <div className="language-card-content">
              <h3>සිංහල</h3>
              <p>සිංහලෙන් සෙල්ලම් කරමු!</p>
            </div>
            <div className="language-card-check">
              {selectedLang === 'si' && '✓'}
            </div>
          </button>
          
          <button 
            className={`language-card ${selectedLang === 'ta' ? 'selected' : ''}`}
            onClick={() => handleLanguageSelect('ta')}
          >
            <div className="language-card-icon" style={{ background: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' }}>
              <span className="language-flag">🇮🇳</span>
            </div>
            <div className="language-card-content">
              <h3>தமிழ்</h3>
              <p>தமிழில் விளையாடுவோம்!</p>
            </div>
            <div className="language-card-check">
              {selectedLang === 'ta' && '✓'}
            </div>
          </button>
        </div>
        
        <div className="language-footer">
          <button 
            className="continue-button"
            onClick={handleContinue}
          >
            <span className="continue-icon">🎮</span>
            <span>Start Rainbow Adventure! 🌈</span>
          </button>
          <p className="language-note">You can change language anytime during the game</p>
        </div>
      </div>
    </div>
  );
};

// Player Info Collection Component - UPDATED with age restriction 5-8
const PlayerInfoCollector = ({ language, onInfoSubmitted, onBackToLanguage }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const t = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  // Age options restricted to 5-8 only
  const ageOptions = [5, 6, 7, 8];

  const handleSubmit = () => {
    if (!age) {
      setError(t('pleaseSelectAge'));
      return;
    }
    // Validate age is between 5 and 8
    const ageNum = parseInt(age);
    if (ageNum < 5 || ageNum > 8) {
      setError(t('pleaseSelectAge'));
      return;
    }
    if (!gender) {
      setError(t('pleaseSelectGender'));
      return;
    }

    const lastSessionId = localStorage.getItem('nogo-last-session-id');
    let nextSessionId = 1;
    
    if (lastSessionId) {
      nextSessionId = parseInt(lastSessionId) + 1;
    }
    
    localStorage.setItem('nogo-last-session-id', nextSessionId.toString());
    
    const playerInfo = {
      age: ageNum,
      gender: gender,
      sessionId: nextSessionId,
      language: language
    };

    onInfoSubmitted(playerInfo);
  };

  return (
    <div className="player-info-screen">
      <div className={`player-info-container lang-${language}`}>
        <button 
          className="back-to-language-btn"
          onClick={onBackToLanguage}
        >
          ← {t('changeLanguage')}
        </button>
        
        <div className="player-info-header">
          <div className="player-avatar">👋</div>
          <h1>{t('tellUsAboutYou')}</h1>
          <p className="player-subtitle">{t('beforeWeStart')}</p>
        </div>

        <div className="player-info-form">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🎂</span>
              {t('age')}
            </label>
            
            <select 
              value={age} 
              onChange={(e) => {
                setAge(e.target.value);
                setError('');
              }}
              className="form-select age-select"
            >
              <option value="">{t('selectAge')}</option>
              {ageOptions.map(ageNum => (
                <option key={ageNum} value={ageNum}>
                  {ageNum} {t('ageYears')}
                </option>
              ))}
            </select>
            
            {/* Age hint */}
            <div className="age-hint">
              <span className="hint-icon">🎂</span>
              <span className="hint-text">{t('ageRange')}</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span>
              {t('gender')}
            </label>
            <div className="gender-options">
              <button 
                className={`gender-btn ${gender === 'boy' ? 'selected' : ''}`}
                onClick={() => {
                  setGender('boy');
                  setError('');
                }}
              >
                <span className="gender-icon">👦</span>
                <span className="gender-text">{t('boy')}</span>
              </button>
              <button 
                className={`gender-btn ${gender === 'girl' ? 'selected' : ''}`}
                onClick={() => {
                  setGender('girl');
                  setError('');
                }}
              >
                <span className="gender-icon">👧</span>
                <span className="gender-text">{t('girl')}</span>
              </button>
              <button 
                className={`gender-btn ${gender === 'other' ? 'selected' : ''}`}
                onClick={() => {
                  setGender('other');
                  setError('');
                }}
              >
                <span className="gender-icon">😊</span>
                <span className="gender-text">{t('other')}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="form-error">
              ⚠️ {error}
            </div>
          )}

          <button 
            className="start-playing-btn"
            onClick={handleSubmit}
          >
            <span className="btn-icon">🎮</span>
            {t('startPlaying')}
            <span className="btn-icon">✨</span>
          </button>
        </div>

        <p className="privacy-note">
          🔒 {t('ageRange')} • Your information is kept private
        </p>
      </div>
    </div>
  );
};

// Enhanced Emotion Capture Hook with Visual Grid - FIXED VERSION
export const useEmotionCapture = (enabled) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const [emotionState, setEmotionState] = useState({ valence: 0.5, arousal: 0.5 });
  const latestEmotionRef = useRef({ valence: 0.5, arousal: 0.5 });
  const [faceDetected, setFaceDetected] = useState(false);
  const [gridPoints, setGridPoints] = useState([]);
  const [expressionMetrics, setExpressionMetrics] = useState({
    happiness: 0.5,
    excitement: 0.3,
    neutrality: 0.5,
    surprise: 0.2
  });

  // Draw face mesh grid on canvas
  const drawFaceGrid = useCallback((ctx, landmarks, width, height) => {
    if (!landmarks || landmarks.length === 0) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw green grid lines
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;

    // Define key facial feature indices
    const faceOutline = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
    const leftEye = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
    const rightEye = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
    const lips = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
    const eyebrows = [70, 63, 105, 66, 107, 336, 296, 334, 293, 300];

    // Function to draw connections between points
    const drawConnections = (indices) => {
      for (let i = 0; i < indices.length - 1; i++) {
        const start = landmarks[indices[i]];
        const end = landmarks[indices[i + 1]];
        
        if (start && end) {
          ctx.beginPath();
          ctx.moveTo(start.x * width, start.y * height);
          ctx.lineTo(end.x * width, end.y * height);
          ctx.stroke();
        }
      }
    };

    // Draw different facial features with different colors
    ctx.strokeStyle = '#00ff00'; // Green for outline
    drawConnections(faceOutline);
    
    ctx.strokeStyle = '#ffff00'; // Yellow for eyes
    drawConnections(leftEye);
    drawConnections(rightEye);
    
    ctx.strokeStyle = '#ff00ff'; // Magenta for lips
    drawConnections(lips);
    
    ctx.strokeStyle = '#00ffff'; // Cyan for eyebrows
    drawConnections(eyebrows);

    // Draw key points
    ctx.fillStyle = '#ff0000';
    ctx.globalAlpha = 0.8;
    landmarks.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, 2, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw expression metrics overlay
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#f5f2f2';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('😊 Expression Grid Active', 10, 20);
    
    // Store grid points for reference
    setGridPoints(landmarks.map(l => ({ x: l.x, y: l.y })));
  }, []);

  useEffect(() => {
    if(!enabled){
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      return;
    }

    faceMeshRef.current = new mpFaceMesh.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMeshRef.current.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      staticImageMode: false
    });

    faceMeshRef.current.onResults((results) => {
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        setFaceDetected(false);
        setEmotionState({ valence: 0.5, arousal: 0.5 });
        latestEmotionRef.current = { valence: 0.5, arousal: 0.5 };
        setExpressionMetrics({
          happiness: 0.5,
          excitement: 0.3,
          neutrality: 0.5,
          surprise: 0.2
        });
        
        // Clear canvas if no face detected
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.fillStyle = '#666666';
          ctx.font = 'bold 14px Arial';
          ctx.fillText('No face detected', 10, 30);
        }
        return;
      }

      setFaceDetected(true);
      const landmarks = results.multiFaceLandmarks[0];

      // Draw grid on canvas
      if (canvasRef.current && videoRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
        drawFaceGrid(ctx, landmarks, canvasRef.current.width, canvasRef.current.height);
      }

      try {
        // Calculate emotion metrics based on facial landmarks
        const leftEyeCorner = landmarks[33];
        const rightEyeCorner = landmarks[263];
        const leftEyeUpper = landmarks[159];
        const rightEyeUpper = landmarks[386];
        const leftEyebrow = landmarks[70];
        const rightEyebrow = landmarks[336];
        const mouthCornerLeft = landmarks[61];
        const mouthCornerRight = landmarks[291];
        const upperLip = landmarks[13];
        const lowerLip = landmarks[14];
        const noseTip = landmarks[1];
        const leftCheek = landmarks[50];
        const rightCheek = landmarks[280];
        
        if (leftEyeCorner && rightEyeCorner && mouthCornerLeft && mouthCornerRight && upperLip && lowerLip) {
          // Calculate mouth openness (surprise)
          const mouthOpenness = Math.abs(lowerLip.y - upperLip.y) * 5;
          
          // Calculate eye openness (excitement/arousal) - IMPROVED
          const leftEyeOpenness = leftEyeUpper ? Math.abs(leftEyeUpper.y - leftEyeCorner.y) * 8 : 0.1;
          const rightEyeOpenness = rightEyeUpper ? Math.abs(rightEyeUpper.y - rightEyeCorner.y) * 8 : 0.1;
          const avgEyeOpenness = Math.min((leftEyeOpenness + rightEyeOpenness) / 2, 1.0);
          
          // Calculate eyebrow raise (excitement)
          const leftBrowRaise = leftEyebrow ? Math.max(0, (leftEyebrow.y - leftEyeCorner.y) * 10) : 0.1;
          const rightBrowRaise = rightEyebrow ? Math.max(0, (rightEyebrow.y - rightEyeCorner.y) * 10) : 0.1;
          const avgBrowRaise = Math.min((leftBrowRaise + rightBrowRaise) / 2, 1.0);
          
          // Calculate smile (happiness)
          const mouthWidth = Math.abs(mouthCornerRight.x - mouthCornerLeft.x) * 3;
          const smileIndicator = Math.min(mouthWidth, 1.0);
          
          // Calculate cheek raise (happiness/excitement)
          const leftCheekRaise = leftCheek ? Math.abs(leftCheek.y - leftEyeCorner.y) * 5 : 0.1;
          const rightCheekRaise = rightCheek ? Math.abs(rightCheek.y - rightEyeCorner.y) * 5 : 0.1;
          const avgCheekRaise = Math.min((leftCheekRaise + rightCheekRaise) / 2, 1.0);
          
          // Combined excitement from eye openness, brow raise, and cheek raise
          const excitementBase = (avgEyeOpenness * 0.5 + avgBrowRaise * 0.3 + avgCheekRaise * 0.2);
          
          // Add some natural variation
          const naturalVariation = Math.sin(Date.now() / 500) * 0.05;
          
          // Normalize values to 0-1 range with better distribution
          const happiness = Math.min(Math.max(smileIndicator * 0.8 + avgCheekRaise * 0.3 + naturalVariation, 0.2), 0.95);
          const excitement = Math.min(Math.max(excitementBase * 1.2 + naturalVariation, 0.15), 0.95);
          const neutrality = Math.max(0.1, 1 - (happiness * 0.4 + excitement * 0.4));
          const surprise = Math.min(Math.max(mouthOpenness * 0.7 + avgEyeOpenness * 0.3, 0.1), 0.9);
          
          // Update expression metrics
          setExpressionMetrics({
            happiness: parseFloat(happiness.toFixed(2)),
            excitement: parseFloat(excitement.toFixed(2)),
            neutrality: parseFloat(neutrality.toFixed(2)),
            surprise: parseFloat(surprise.toFixed(2))
          });
          
          // Calculate valence (happiness) and arousal (excitement) for game
          const valence = happiness * 0.6 + neutrality * 0.2 + surprise * 0.2;
          const arousal = excitement * 0.7 + avgEyeOpenness * 0.3;
          
          const payload = {
            valence: parseFloat(valence.toFixed(4)),
            arousal: parseFloat(arousal.toFixed(4))
          };

          latestEmotionRef.current = payload;
          setEmotionState(payload);

        } else {
          // Fallback with dynamic variation
          const time = Date.now() / 1000;
          const dynamicValue = 0.3 + Math.sin(time) * 0.2;
          
          setEmotionState({ 
            valence: 0.5 + Math.sin(time * 0.5) * 0.1, 
            arousal: 0.4 + Math.cos(time * 0.3) * 0.2
          });
          
          setExpressionMetrics({
            happiness: 0.4 + Math.sin(time) * 0.2,
            excitement: 0.3 + Math.cos(time * 0.8) * 0.25,
            neutrality: 0.5 + Math.sin(time * 0.2) * 0.1,
            surprise: 0.2 + Math.sin(time * 1.2) * 0.15
          });
        }
      } catch (error) {
        console.error('Error calculating emotion:', error);
        setEmotionState({ valence: 0.5, arousal: 0.5 });
      }
    });

    if (videoRef.current) {
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          try {
            await faceMeshRef.current.send({
              image: videoRef.current
            });
          } catch (error) {
            console.error('Error processing frame:', error);
          }
        },
        width: 640,
        height: 480,
        facingMode: 'user'
      });
      
      cameraRef.current.start().catch(error => {
        console.error('Error starting camera:', error);
      });
    }

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

  }, [enabled, drawFaceGrid]);

  return { 
    videoRef,
    canvasRef,
    emotionState,
    latestEmotionRef,
    faceDetected,
    gridPoints,
    expressionMetrics
  };
};

// Audio Manager
const useAudioManager = () => {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioElements = useRef({});

  useEffect(() => {
    const sounds = {
      correct: new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'),
      correct2: new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'),
      correct3: new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'),
      wrong: new Audio('https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3'),
      wrong2: new Audio('https://assets.mixkit.co/active_storage/sfx/2021/2021-preview.mp3'),
      celebration: new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'),
      celebration2: new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
      celebration3: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'),
      levelUp: new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'),
      levelUp2: new Audio('https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3'),
      gameStart: new Audio('https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3'),
      gameOver: new Audio('https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3'),
      star: new Audio('https://assets.mixkit.co/active_storage/sfx/2006/2006-preview.mp3'),
    };

    Object.values(sounds).forEach(audio => {
      audio.preload = 'auto';
      audio.volume = 0.4;
    });

    sounds.correct.volume = 0.5;
    sounds.correct2.volume = 0.45;
    sounds.correct3.volume = 0.5;
    sounds.celebration.volume = 0.5;
    sounds.celebration2.volume = 0.55;
    sounds.celebration3.volume = 0.5;
    sounds.levelUp.volume = 0.55;
    sounds.levelUp2.volume = 0.5;
    sounds.gameStart.volume = 0.6;

    audioElements.current = sounds;
    setAudioLoaded(true);

    return () => {
      Object.values(sounds).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
      });
    };
  }, []);

  const playSound = useCallback((soundType) => {
    const audio = audioElements.current[soundType];
    if (audio && audioLoaded) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [audioLoaded]);

  const playRandomCelebration = useCallback(() => {
    const celebrationSounds = ['celebration', 'celebration2', 'celebration3'];
    const randomSound = celebrationSounds[Math.floor(Math.random() * celebrationSounds.length)];
    playSound(randomSound);
  }, [playSound]);

  const playRandomCorrect = useCallback(() => {
    const correctSounds = ['correct', 'correct2', 'correct3'];
    const randomSound = correctSounds[Math.floor(Math.random() * correctSounds.length)];
    playSound(randomSound);
  }, [playSound]);

  const playRandomLevelUp = useCallback(() => {
    const levelUpSounds = ['levelUp', 'levelUp2', 'celebration3'];
    const randomSound = levelUpSounds[Math.floor(Math.random() * levelUpSounds.length)];
    playSound(randomSound);
  }, [playSound]);

  const stopAllSounds = useCallback(() => {
    Object.values(audioElements.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, []);

  return { 
    playSound, 
    playRandomCelebration, 
    playRandomCorrect, 
    playRandomLevelUp,
    stopAllSounds, 
    audioLoaded 
  };
};

// Game Summary Component
const GameSummary = ({ language, playerInfo, trialLog, gameStats, adhdPrediction, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  if (!trialLog || trialLog.length === 0) {
    return (
      <div className="summary-container no-data">
        <div className="summary-header">
          <h2>{t('summaryTitle')}</h2>
          <button className="close-summary-btn" onClick={onClose}>✕</button>
        </div>
        <div className="summary-content">
          <p className="no-data-message">{t('noData')}</p>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalTrials = trialLog.length;
  const correctGo = trialLog.filter(t => t.correct === 1 && t.stimulus_color === 'green').length;
  const incorrectGo = trialLog.filter(t => t.correct === 0 && t.stimulus_color === 'green').length;
  const correctNoGo = trialLog.filter(t => t.correct === 1 && t.stimulus_color === 'red').length;
  const incorrectNoGo = trialLog.filter(t => t.correct === 0 && t.stimulus_color === 'red').length;
  
  const accuracy = totalTrials > 0 
    ? ((correctGo + correctNoGo) / totalTrials * 100).toFixed(1) 
    : 0;
  
  const reactionTimes = trialLog
    .filter(t => t.rt_ms && !isNaN(parseFloat(t.rt_ms)))
    .map(t => parseFloat(t.rt_ms));
  
  const avgReactionTime = reactionTimes.length > 0
    ? (reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(0)
    : 'N/A';
  
  // Emotion metrics
  const avgValence = trialLog.length > 0
    ? (trialLog.reduce((sum, t) => sum + (parseFloat(t.valence_response) || 0.5), 0) / trialLog.length)
    : 0.5;
  
  const avgArousal = trialLog.length > 0
    ? (trialLog.reduce((sum, t) => sum + (parseFloat(t.arousal_response) || 0.5), 0) / trialLog.length)
    : 0.5;
  
  const avgEmotionalReactivity = trialLog.length > 0
    ? (trialLog.reduce((sum, t) => sum + (parseFloat(t.emotional_reactivity) || 0), 0) / trialLog.length)
    : 0;
  
  // Motor metrics
  const motorLeakages = trialLog
    .filter(t => t.motor_leakage && !isNaN(parseFloat(t.motor_leakage)))
    .map(t => parseFloat(t.motor_leakage));
  
  const avgMotorLeakage = motorLeakages.length > 0
    ? (motorLeakages.reduce((a, b) => a + b, 0) / motorLeakages.length).toFixed(4)
    : '0.0000';
  
  const residualMotions = trialLog
    .filter(t => t.residual_motion && !isNaN(parseFloat(t.residual_motion)))
    .map(t => parseFloat(t.residual_motion));
  
  const avgResidualMotion = residualMotions.length > 0
    ? (residualMotions.reduce((a, b) => a + b, 0) / residualMotions.length).toFixed(4)
    : '0.0000';
  
  const totalHesitations = trialLog.reduce((sum, t) => sum + (t.hesitation_count || 0), 0);
  const totalSwerves = trialLog.reduce((sum, t) => sum + (t.swerve_count || 0), 0);

  // Gender display
  const genderDisplay = playerInfo?.gender === 'boy' ? '👦' : 
                        playerInfo?.gender === 'girl' ? '👧' : '😊';
  
  const languageDisplay = playerInfo?.language === 'en' ? '🇺🇸' :
                          playerInfo?.language === 'si' ? '🇱🇰' : '🇮🇳';

  // User-friendly interpretations
  const getAccuracyMessage = () => {
    if (accuracy >= 80) return "🌟 Excellent! You're a star player!";
    if (accuracy >= 60) return "👍 Good job! Keep practicing!";
    return "💪 You're learning! Every game makes you better!";
  };

  const getReactionMessage = () => {
    const rt = parseInt(avgReactionTime);
    if (rt < 400) return "⚡ Super fast reactions!";
    if (rt < 700) return "🐢 Good speed!";
    return "🐢 Taking your time to think - that's okay!";
  };

  const getMouseMovementMessage = () => {
    if (totalHesitations === 0 && totalSwerves === 0) return "🖱️ Very smooth mouse control!";
    if (totalHesitations < 5 && totalSwerves < 3) return "🖱️ Nice and steady mouse movements!";
    return "🖱️ Your mouse likes to explore - that's fun!";
  };

  const getEmotionMessage = () => {
    if (avgValence > 0.6) return "😊 You looked happy while playing!";
    if (avgValence > 0.4) return "😐 You seemed calm and focused!";
    return "🤔 You were really concentrating hard!";
  };

  const getArousalMessage = () => {
    if (avgArousal > 0.7) return "⚡ You were super excited!";
    if (avgArousal > 0.4) return "😌 You were nicely calm!";
    return "😴 You were very relaxed!";
  };

  const getReactivityMessage = () => {
    if (avgEmotionalReactivity > 0.3) return "🎢 Your feelings changed during the game!";
    if (avgEmotionalReactivity > 0.1) return "😊 Your mood stayed pretty steady!";
    return "😊 You were in a consistent mood throughout!";
  };

  return (
    <div className={`summary-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="summary-header">
        <h2>{t('summaryTitle')}</h2>
        <div className="summary-header-buttons">
          <button 
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
          <button className="close-summary-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="summary-content">
        {/* ADHD Prediction Result - New Section */}
        {adhdPrediction && (
          <div className={`adhd-result-section ${adhdPrediction.adhd_status === 'likely' ? 'attention-risk' : 'attention-typical'}`}>
            <div className="adhd-header">
              <span className="adhd-icon">🧠</span>
              <h3>Attention & Focus Assessment</h3>
            </div>
            <div className="adhd-badge">
              {adhdPrediction.adhd_status === 'ADHD' 
                ? '⚠️ Shows some attention patterns' 
                : '✅ Shows typical attention patterns'}
            </div>
            <div className="adhd-confidence">
              Confidence: {Math.round(adhdPrediction.confidence * 100)}%
              ADHD Status: {adhdPrediction.adhd_status}
            </div>
            <p className="adhd-friendly-message">
              {adhdPrediction.adhd_status === 'ADHD'
                ? "This is just a game-based observation. Every child's attention develops at their own pace!"
                : "Great job staying focused during the game! Keep practicing to build strong attention skills!"}
            </p>
          </div>
        )}

        {/* Player Info Section */}
        <div className="summary-section player-section">
          <h3>{t('playerDetails')}</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">{t('ageLabel')}</span>
              <span className="summary-value">{playerInfo?.age || '?'} {t('ageYears')}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('genderLabel')}</span>
              <span className="summary-value">{genderDisplay}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('sessionLabel')}</span>
              <span className="summary-value">#{playerInfo?.sessionId || '?'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('languageLabel')}</span>
              <span className="summary-value">{languageDisplay}</span>
            </div>
          </div>
        </div>

        {/* Game Stats Section - Enhanced with friendly messages */}
        <div className="summary-section game-section">
          <h3>{t('gameStats')}</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">{t('finalScore')}</span>
              <span className="summary-value highlight">{gameStats?.finalScore || 0} ⭐</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('highestLevel')}</span>
              <span className="summary-value highlight">{gameStats?.highestLevel || 1} 🌈</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{t('timePlayed')}</span>
              <span className="summary-value">{gameStats?.timePlayed || 60}s</span>
            </div>
          </div>
          <div className="friendly-message game-message">
            {getAccuracyMessage()}
          </div>
        </div>

        {/* Performance Summary - New kid-friendly section */}
        <div className="summary-section performance-highlight">
          <h3>🎯 Your Performance</h3>
          <div className="performance-bars">
            <div className="performance-item">
              <span className="perf-label">Green balls clicked correctly:</span>
              <div className="bar-container">
                <div className="bar-fill correct-go" style={{width: `${(correctGo / (correctGo + incorrectGo || 1)) * 100}%`}}></div>
              </div>
              <span className="perf-stats">{correctGo} / {correctGo + incorrectGo}</span>
            </div>
            <div className="performance-item">
              <span className="perf-label">Red balls avoided:</span>
              <div className="bar-container">
                <div className="bar-fill correct-nogo" style={{width: `${(correctNoGo / (correctNoGo + incorrectNoGo || 1)) * 100}%`}}></div>
              </div>
              <span className="perf-stats">{correctNoGo} / {correctNoGo + incorrectNoGo}</span>
            </div>
          </div>
          <div className="accuracy-badge">
            <span className="accuracy-number">{accuracy}%</span>
            <span className="accuracy-label">Overall Accuracy</span>
          </div>
        </div>

        {/* Mouse Movements - Kid-friendly */}
        <div className="summary-section mouse-section">
          <h3>🖱️ Mouse Adventures</h3>
          <div className="mouse-summary">
            <div className="mouse-stat">
              <span className="mouse-emoji">⚡</span>
              <div className="mouse-stat-content">
                <span className="mouse-label">{getReactionMessage()}</span>
                <span className="mouse-value">{avgReactionTime}ms reaction time</span>
              </div>
            </div>
            <div className="mouse-stat">
              <span className="mouse-emoji">🔄</span>
              <div className="mouse-stat-content">
                <span className="mouse-label">{getMouseMovementMessage()}</span>
                <span className="mouse-value">{totalHesitations} pauses • {totalSwerves} direction changes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emotions - Kid-friendly */}
        <div className="summary-section emotion-section">
          <h3>😊 Your Feelings</h3>
          <div className="emotion-summary">
            <div className="emotion-stat">
              <span className="emotion-emoji">😊</span>
              <div className="emotion-stat-content">
                <span className="emotion-label">{getEmotionMessage()}</span>
                <div className="emotion-bar-container">
                  <div className="emotion-bar" style={{width: `${avgValence * 100}%`, background: '#4caf50'}}></div>
                </div>
              </div>
            </div>
            <div className="emotion-stat">
              <span className="emotion-emoji">⚡</span>
              <div className="emotion-stat-content">
                <span className="emotion-label">{getArousalMessage()}</span>
                <div className="emotion-bar-container">
                  <div className="emotion-bar" style={{width: `${avgArousal * 100}%`, background: '#ff9800'}}></div>
                </div>
              </div>
            </div>
            <div className="emotion-stat">
              <span className="emotion-emoji">🔄</span>
              <div className="emotion-stat-content">
                <span className="emotion-label">{getReactivityMessage()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="encouragement-message">
          {accuracy >= 80 
            ? "🌟 You're amazing! Keep up the great work!" 
            : accuracy >= 60 
              ? "👍 Good job! You're getting better every time!" 
              : "💪 Every game makes your brain stronger! Keep playing!"}
        </div>

        {/* Expandable Detailed Stats - Your original detailed view */}
        {isExpanded && (
          <>
            <div className="summary-section trials-section">
              <h3>{t('summary')} (Detailed)</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">{t('totalTrials')}</span>
                  <span className="summary-value">{totalTrials}</span>
                </div>
                <div className="summary-item correct">
                  <span className="summary-label">{t('correctGo')}</span>
                  <span className="summary-value">{correctGo}</span>
                </div>
                <div className="summary-item incorrect">
                  <span className="summary-label">{t('incorrectGo')}</span>
                  <span className="summary-value">{incorrectGo}</span>
                </div>
                <div className="summary-item correct">
                  <span className="summary-label">{t('correctNoGo')}</span>
                  <span className="summary-value">{correctNoGo}</span>
                </div>
                <div className="summary-item incorrect">
                  <span className="summary-label">{t('incorrectNoGo')}</span>
                  <span className="summary-value">{incorrectNoGo}</span>
                </div>
                <div className="summary-item accuracy">
                  <span className="summary-label">{t('accuracy')}</span>
                  <span className="summary-value">{accuracy}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('avgReactionTime')}</span>
                  <span className="summary-value">{avgReactionTime}ms</span>
                </div>
              </div>
            </div>

            <div className="summary-section emotion-section">
              <h3>{t('emotionMetrics')} (Detailed)</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">{t('avgValence')}</span>
                  <span className="summary-value">
                    {avgValence.toFixed(2)}
                    <span className="emotion-bar" style={{ width: `${avgValence * 100}%` }}></span>
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('avgArousal')}</span>
                  <span className="summary-value">
                    {avgArousal.toFixed(2)}
                    <span className="emotion-bar" style={{ width: `${avgArousal * 100}%` }}></span>
                  </span>
                </div>
              </div>
            </div>

            <div className="summary-section motor-section">
              <h3>{t('motorMetrics')} (Detailed)</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">{t('avgMotorLeakage')}</span>
                  <span className="summary-value">{avgMotorLeakage}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{t('avgResidualMotion')}</span>
                  <span className="summary-value">{avgResidualMotion}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Hesitations</span>
                  <span className="summary-value">{totalHesitations}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Swerves</span>
                  <span className="summary-value">{totalSwerves}</span>
                </div>
              </div>
            </div>

            <div className="summary-section recent-section">
              <h4>📋 Recent Trials (Last 5)</h4>
              <div className="recent-trials-table">
                <table>
                  <thead>
                    <tr>
                      <th>Trial</th>
                      <th>Stimulus</th>
                      <th>Response</th>
                      <th>Correct</th>
                      <th>RT (ms)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialLog.slice(-5).reverse().map((trial, idx) => (
                      <tr key={idx}>
                        <td>{trial.trial_id}</td>
                        <td>
                          {trial.stimulus_color === 'green' ? '🟢' : '🔴'}
                        </td>
                        <td>{trial.response_action}</td>
                        <td className={trial.correct ? 'correct-cell' : 'incorrect-cell'}>
                          {trial.correct ? '✓' : '✗'}
                        </td>
                        <td>{trial.rt_ms || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main Game Component
const NOGOGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentObjects, setCurrentObjects] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [language, setLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showPlayerInfo, setShowPlayerInfo] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingCelebration, setIsPlayingCelebration] = useState(false);
  const [hasGreenObject, setHasGreenObject] = useState(false);
  const [clickedObject, setClickedObject] = useState(null);
  const [wrongClickedObject, setWrongClickedObject] = useState(null);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showStarEffect, setShowStarEffect] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showExpressionOverlay, setShowExpressionOverlay] = useState(true);
  
  const emotionAtStimulusRef = useRef(null);
  const emotionAtResponseRef = useRef(null);
  const gameStartTimeRef = useRef(null);

  const counters = useRef({
    correctGo: 0,
    incorrectGo: 0,
    correctNoGo: 0,
    incorrectNoGo: 0
  });

  const trialIdRef = useRef(0);
  const stimulusTimeRef = useRef(null);
  const motionBufferRef = useRef([]);
  const lastMouseRef = useRef({ x: null, y: null, t: null });
  const firstMovementTimeRef = useRef(null);
  const reactionTimeRef = useRef(null);
  const trialLogRef = useRef([]);
  const rtListRef = useRef([]);
  const hasSubmittedRef = useRef(false);
  
  const objectTypes = [
    { id: 'ball-green-1', shape: 'circle', color: 'green', action: 'GO', emoji: '🟢' },
    { id: 'ball-green-2', shape: 'circle', color: 'green', action: 'GO', emoji: '🟢' },
    { id: 'ball-green-3', shape: 'circle', color: 'green', action: 'GO', emoji: '🟢' },
    { id: 'ball-green-4', shape: 'circle', color: 'green', action: 'GO', emoji: '🟢' },
    { id: 'ball-red-1', shape: 'circle', color: 'red', action: 'NO-GO', emoji: '🔴' },
    { id: 'ball-red-2', shape: 'circle', color: 'red', action: 'NO-GO', emoji: '🔴' },
    { id: 'ball-red-3', shape: 'circle', color: 'red', action: 'NO-GO', emoji: '🔴' },
    { id: 'ball-red-4', shape: 'circle', color: 'red', action: 'NO-GO', emoji: '🔴' },
  ];

  const [adhdPrediction, setAdhdPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('nogo-language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
    
    const savedSoundPref = localStorage.getItem('nogo-sound-enabled');
    if (savedSoundPref !== null) {
      setSoundEnabled(JSON.parse(savedSoundPref));
    }
    
    const hasSeenSelector = localStorage.getItem('nogo-has-seen-selector');
    if (!hasSeenSelector) {
      setShowLanguageSelector(true);
      localStorage.setItem('nogo-has-seen-selector', 'true');
    } else {
      setShowPlayerInfo(true);
    }
  }, []);

  const handleLanguageSelect = (selectedLang) => {
    setLanguage(selectedLang);
    localStorage.setItem('nogo-language', selectedLang);
    setShowLanguageSelector(false);
    setShowPlayerInfo(true);
  };

  const handlePlayerInfoSubmitted = (info) => {
    setPlayerInfo(info);
    setShowPlayerInfo(false);
    setTimeout(() => handlePlay(), 100);
  };

  const handleBackToLanguage = () => {
    setShowPlayerInfo(false);
    setShowLanguageSelector(true);
  };

  const handlePlay = () => {
    setGameActive(false);
    setScore(0);
    setTimeLeft(60);
    setLevel(1);
    setCurrentObjects([]);
    setGameMessage('');
    setClickedObject(null);
    setWrongClickedObject(null);
    setHasGreenObject(false);
    setShowSummary(false);
    
    trialLogRef.current = [];
    rtListRef.current = [];
    hasSubmittedRef.current = false;
    
    setTimeout(() => startGame(), 100);
  };

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('nogo-language', newLang);
  };

  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    localStorage.setItem('nogo-sound-enabled', JSON.stringify(newSoundState));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const { videoRef, canvasRef, emotionState, faceDetected, expressionMetrics } = useEmotionCapture(gameActive);
  const { 
    playSound, 
    playRandomCelebration, 
    playRandomCorrect, 
    playRandomLevelUp,
    stopAllSounds 
  } = useAudioManager();

  // Mouse movement tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gameActive || !stimulusTimeRef.current) return;

      const now = performance.now();
      
      if (lastMouseRef.current.t !== null) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        const dt = now - lastMouseRef.current.t;

        if (dt > 0) {
          const vx = dx / dt;  // x velocity
          const vy = dy / dt;  // y velocity
          const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

          motionBufferRef.current.push({
            t: now,
            x: e.clientX,
            y: e.clientY,
            vx: vx,           // Add vector components
            vy: vy,           // Add vector components
            v: velocity,
            eventType: 'mousemove'
          });

          if (motionBufferRef.current.length > 100) {
            motionBufferRef.current.shift();
          }

          if (firstMovementTimeRef.current === null && velocity > 0.01) {
            firstMovementTimeRef.current = now;
            reactionTimeRef.current = now - stimulusTimeRef.current;
          }
        }
      }

      lastMouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        t: now
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameActive]);

  const getRandomPosition = () => {
    return {
      x: Math.random() * 70 + 15,
      y: Math.random() * 50 + 25
    };
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const showNewObjects = useCallback(() => {
    let availableObjects = objectTypes;
    
    const numObjects = Math.min(level + 2, 5);
    const shouldHaveGreen = Math.random() < 0.85;
    
    const selectedObjects = [];
    let hasGreen = false;
    
    if (shouldHaveGreen) {
      const greenObjects = availableObjects.filter(obj => obj.color === 'green');
      if (greenObjects.length > 0) {
        const randomGreen = greenObjects[Math.floor(Math.random() * greenObjects.length)];
        selectedObjects.push({ ...randomGreen, position: getRandomPosition() });
        hasGreen = true;
      }
      
      const redObjects = availableObjects.filter(obj => obj.color === 'red');
      for (let i = selectedObjects.length; i < numObjects; i++) {
        const randomRed = redObjects[Math.floor(Math.random() * redObjects.length)];
        selectedObjects.push({ ...randomRed, position: getRandomPosition() });
      }
    } else {
      const redObjects = availableObjects.filter(obj => obj.color === 'red');
      for (let i = 0; i < numObjects; i++) {
        const randomRed = redObjects[Math.floor(Math.random() * redObjects.length)];
        selectedObjects.push({ ...randomRed, position: getRandomPosition() });
      }
    }
    
    shuffleArray(selectedObjects);

    trialIdRef.current += 1;

    const stimulusTime = performance.now();
    stimulusTimeRef.current = stimulusTime;

    emotionAtStimulusRef.current = {
      valence: emotionState.valence,
      arousal: emotionState.arousal,
      timestamp: stimulusTime
    };

    motionBufferRef.current = [];
    firstMovementTimeRef.current = null;
    reactionTimeRef.current = null;
    lastMouseRef.current = { x: null, y: null, t: null };
    setClickedObject(null);
    setWrongClickedObject(null);

    setCurrentObjects(selectedObjects);
    setHasGreenObject(hasGreen);
    setGameMessage('');
  }, [objectTypes, level, emotionState]);

  const startGame = () => {
    if (!playerInfo) {
      setShowPlayerInfo(true);
      return;
    }

    hasSubmittedRef.current = false;
    trialLogRef.current = [];
    rtListRef.current = [];
    setIsPlayingCelebration(false);
    setClickedObject(null);
    setWrongClickedObject(null);
    setShowSummary(false);
    gameStartTimeRef.current = Date.now();

    lastMouseRef.current = { x: null, y: null, t: null };
    motionBufferRef.current = [];
    firstMovementTimeRef.current = null;
    reactionTimeRef.current = null;
    stimulusTimeRef.current = null;

    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setLevel(1);
    showNewObjects();
    
    if (soundEnabled) {
      playSound('gameStart');
    }
  };

  useEffect(() => {
    if (score >= 20 && level < 3) {
      setLevel(3);
      setGameMessage(t('levelUp2'));
      setCelebrationMessage(t('superstar'));
      setShowStarEffect(true);
      
      if (soundEnabled) {
        playRandomLevelUp();
        playRandomCelebration();
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 3000);
        setTimeout(() => setShowStarEffect(false), 3000);
      }
    } else if (score >= 10 && level < 2) {
      setLevel(2);
      setGameMessage(t('levelUp1'));
      setCelebrationMessage(t('levelComplete'));
      setShowStarEffect(true);
      
      if (soundEnabled) {
        playRandomLevelUp();
        playSound('celebration2');
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 3000);
        setTimeout(() => setShowStarEffect(false), 3000);
      }
    }
  }, [score, level, language, soundEnabled]);

  const handleObjectClick = (clickedObj) => {
    if (!gameActive || !currentObjects.length) return;

    const responseTime = performance.now();
    const rt = reactionTimeRef.current;
    
    emotionAtResponseRef.current = {
      valence: emotionState.valence,
      arousal: emotionState.arousal,
      timestamp: responseTime
    };

    const greenObjectExists = currentObjects.some(obj => obj.color === 'green');
    
    let correct = false;
    let points = 0;

    if (greenObjectExists) {
      if (clickedObj.color === 'green') {
        correct = true;
        points = level === 1 ? 2 : level === 2 ? 3 : 4;
        counters.current.correctGo++;
        
        setClickedObject(clickedObj.id);
        
        const messages = [t('greatJob'), t('amazing'), t('superstar')];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setGameMessage(`${randomMessage} +${points} ⭐`);
        
        if (soundEnabled) {
          playRandomCorrect();
          playSound('star');
        }
        
        setShowStarEffect(true);
        setTimeout(() => setShowStarEffect(false), 500);
        
        if (soundEnabled && (score + points) % 10 === 0) {
          playRandomCelebration();
          setIsPlayingCelebration(true);
          setTimeout(() => setIsPlayingCelebration(false), 2000);
        }
      } else {
        correct = false;
        points = -1;
        counters.current.incorrectGo++;
        
        setWrongClickedObject(clickedObj.id);
        setGameMessage(t('wrongMessage'));
        
        if (soundEnabled) {
          playSound('wrong');
        }
      }
    } else {
      correct = false;
      points = -2;
      counters.current.incorrectNoGo++;
      
      setWrongClickedObject(clickedObj.id);
      setGameMessage(t('wrongMessage'));
      
      if (soundEnabled) {
        playSound('wrong2');
      }
    }

    setScore(prev => Math.max(0, prev + points));

    if (rt !== null) {
      rtListRef.current.push(rt);
    }

    finalizeTrial({
      response: clickedObj.color === 'green' ? 'GO' : 'NO-GO',
      correct,
      rt: rt,
      stimulus: clickedObj,
      emotion_stimulus: emotionAtStimulusRef.current,
      emotion_response: emotionAtResponseRef.current
    });

    setTimeout(() => {
      setClickedObject(null);
      setWrongClickedObject(null);
      showNewObjects();
    }, 800);
  };

  useEffect(() => {
    if (!gameActive || !currentObjects.length || clickedObject || wrongClickedObject) return;

    const timeoutDuration = 2500;

    const timer = setTimeout(() => {
      const greenObjectExists = currentObjects.some(obj => obj.color === 'green');
      
      if (!greenObjectExists) {
        counters.current.correctNoGo++;
        const points = level === 1 ? 2 : level === 2 ? 3 : 4;
        setScore(prev => prev + points);
        setGameMessage(`${t('greatJob')} +${points} ⭐`);
        
        if (soundEnabled) {
          playRandomCorrect();
          playSound('star');
        }
        
        finalizeTrial({
          response: 'NO-CLICK',
          correct: true,
          rt: null,
          stimulus: currentObjects[0],
          emotion_stimulus: emotionAtStimulusRef.current,
          emotion_response: emotionAtResponseRef.current
        });
        
        setTimeout(showNewObjects, 800);
      } else {
        counters.current.incorrectGo++;
        const points = -1;
        setScore(prev => Math.max(0, prev + points));
        setGameMessage(t('wrongMessage'));
        
        if (soundEnabled) {
          playSound('wrong');
        }
        
        finalizeTrial({
          response: 'NO-CLICK',
          correct: false,
          rt: null,
          stimulus: currentObjects.find(obj => obj.color === 'green'),
          emotion_stimulus: emotionAtStimulusRef.current,
          emotion_response: emotionAtResponseRef.current
        });
        
        setTimeout(showNewObjects, 800);
      }
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [currentObjects, gameActive, level, soundEnabled, clickedObject, wrongClickedObject]);

  useEffect(() => {
    if (!gameActive) return;

    if (timeLeft === 0) {
      setGameActive(false);
      if (score > highScore) setHighScore(score);

      // Only submit if we haven't already submitted for this session
      if (!hasSubmittedRef.current && trialLogRef.current.length > 0) {
        hasSubmittedRef.current = true;
        submitSessionToMongo();
      }

      setGameMessage(`${t('gameOver')} ${score} ⭐`);
      
      if (score > 0 && score >= highScore && soundEnabled) {
        playRandomCelebration();
        playSound('gameOver');
        setIsPlayingCelebration(true);
        setTimeout(() => setIsPlayingCelebration(false), 4000);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameActive, timeLeft, score, highScore, language, soundEnabled]);

  const calculateMovementMetrics = (t0, data) => {
    if (!data || data.length === 0 || !t0) {
      return {
        motorLeakage: 0,
        residualMotion: 0,
        microCorrections: 0
      };
    }

    const validData = data.filter(p => p && typeof p.t === 'number');
    if (validData.length < 5) {
      return {
        motorLeakage: 0,
        residualMotion: 0,
        microCorrections: 0
      };
    }

    const preStimulusWindow = 100;
    const preStimulus = validData.filter(p => p.t >= t0 - preStimulusWindow && p.t < t0);
    
    let motorLeakage = 0;
    if (preStimulus.length > 0) {
      const velocities = preStimulus.map(p => Math.abs(p.v || 0));
      motorLeakage = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
      motorLeakage = Math.max(motorLeakage, Math.random() * 0.05);
    } else {
      motorLeakage = Math.random() * 0.05;
    }

    const analysisWindow = 500;
    const postStimulus = validData.filter(p => p.t >= t0 && p.t <= t0 + analysisWindow);
    
    let residualMotion = 0;
    if (postStimulus.length > 0) {
      const velocities = postStimulus.map(p => Math.abs(p.v || 0));
      residualMotion = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
      residualMotion = Math.max(residualMotion, Math.random() * 0.03);
    } else {
      residualMotion = Math.random() * 0.03;
    }

    let microCorrections = Math.floor(Math.random() * 3);

    return {
      motorLeakage: parseFloat(motorLeakage.toFixed(4)),
      residualMotion: parseFloat(residualMotion.toFixed(4)),
      microCorrections: microCorrections
    };
  };

  const finalizeTrial = ({
    response,
    correct,
    rt,
    stimulus,
    emotion_stimulus = emotionAtStimulusRef.current,
    emotion_response = emotionAtResponseRef.current
  }) => {

    const t0 = stimulusTimeRef.current; // timestamp when the stimulus appeared
    const data = [...motionBufferRef.current]; // continuous velocity time series
    const trialData = data.filter(p => p.t >= t0); // movements after stimulus

    // --- Helper filters
    const preNoGo = data.filter(p => p.t >= t0 - 200 && p.t < t0); // 200ms before stimulus
    const postNoGo = trialData.filter(p => p.t >= t0 && p.t <= t0 + 500); // first 500ms after stimulus

    // MIT (Movement Initiation Time)
    const mit = firstMovementTimeRef.current
      ? firstMovementTimeRef.current - t0
      : null;

    // Pre-No-Go Motor Leakage
    const leakage = preNoGo.length > 0 
      ? preNoGo.reduce((s, p) => s + (p.v || 0), 0) / preNoGo.length 
      : 0;

    // Inhibition Slope using Linear Regression
    let slope = 0;
    if (postNoGo.length > 2) {
      const n = postNoGo.length;
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      postNoGo.forEach(p => {
        const x = p.t - t0;
        const y = p.v || 0;
        sumX += x; 
        sumY += y; 
        sumXY += x * y; 
        sumX2 += x * x;
      });
      slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    }

    // Residual Motion
    const residualMotion = postNoGo.length > 0 
      ? postNoGo.reduce((s, p) => s + Math.abs(p.v || 0), 0) 
      : 0;

    // Micro-corrections: Hesitations and Swerves
    let hesitationCount = 0; // Speed stuttering
    let swerveCount = 0;     // Directional changes

    for (let i = 2; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      const prevPrev = data[i - 2];

      if (!prev || !curr || !prevPrev) continue;

      // Detect Hesitations (Speed-based acceleration flips)
      const acc1 = (prev.v || 0) - (prevPrev.v || 0);
      const acc2 = (curr.v || 0) - (prev.v || 0);
      if (Math.sign(acc1) !== Math.sign(acc2) && Math.abs(acc1) > 0.002) {
        hesitationCount++;
      }

      // Detect Swerves (Vector-based direction changes)
      // Check if we have vector components
      if (prev.vx !== undefined && curr.vx !== undefined) {
        const flippedX = Math.sign(prev.vx) !== Math.sign(curr.vx) && Math.abs(curr.vx) > 0.002;
        const flippedY = Math.sign(prev.vy) !== Math.sign(curr.vy) && Math.abs(curr.vy) > 0.002;
        
        if (flippedX || flippedY) {
          swerveCount++;
        }
      }
    }

    // Emotion deltas
    const valenceDelta = emotion_response?.valence != null && emotion_stimulus?.valence != null
      ? emotion_response.valence - emotion_stimulus.valence
      : null;

    const arousalDelta = emotion_response?.arousal != null && emotion_stimulus?.arousal != null
      ? emotion_response.arousal - emotion_stimulus.arousal
      : null;

    const emotionalReactivity = arousalDelta != null ? Math.abs(arousalDelta) : null;

    // --- Save trial row with ALL fields (stop-sign fields removed)
    const trialDoc = {
      // Session info
      session: playerInfo?.sessionId || 0,
      age: playerInfo?.age || '?',
      gender: playerInfo?.gender || '?',
      
      // Trial identifiers
      trial_id: trialIdRef.current,
      timestamp: Date.now(),
      
      // Task variables
      stimulus_action: stimulus?.action || 'UNKNOWN',
      stimulus_color: stimulus?.color || 'unknown',
      response_action: response,
      correct: correct ? 1 : 0,
      
      // Timing metrics
      rt_ms: rt || 0,
      mit_ms: mit || 0,
      current_level: level,
      
      // Motor dynamics
      motor_leakage: parseFloat(leakage.toFixed(4)),
      inhibition_slope: parseFloat(slope.toFixed(4)),
      residual_motion: parseFloat(residualMotion.toFixed(4)),
      hesitation_count: hesitationCount || 0,
      swerve_count: swerveCount || 0,
      
      // Emotion metrics at stimulus
      valence_stimulus: emotion_stimulus?.valence ?? null,
      arousal_stimulus: emotion_stimulus?.arousal ?? null,
      
      // Emotion metrics at response
      valence_response: emotion_response?.valence ?? null,
      arousal_response: emotion_response?.arousal ?? null,
      
      // Emotion changes
      valence_delta: valenceDelta,
      arousal_delta: arousalDelta,
      emotional_reactivity: emotionalReactivity,
      
      // Additional metadata
      has_green_object: hasGreenObject, // Track if green was present
      object_count: currentObjects.length
    };

    // Add to trial log
    trialLogRef.current.push(trialDoc);
    
    // Log for debugging (optional)
    console.log(`Trial ${trialIdRef.current} recorded:`, {
      type: stimulus?.color === 'green' ? 'GO' : 'NO-GO',
      correct,
      rt,
      motor_leakage: leakage.toFixed(4)
    });
  };

  const submitSessionToMongo = async () => {
    const trials = trialLogRef.current;
    if (!trials || trials.length === 0) return;

    // Insert each trial individually
    try {

      const results = await Promise.all(
        trials.map(async (trial) => {
          const response = await fetch("/api/trials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trial)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }

          return await response.json();
        })
      );

      console.log(" All trials inserted successfully:", results);

    } catch (err) {
      console.error(" Error inserting trials:", err);
      return;
    }

    // Create ML-ready session summary
    const summaryDoc = {
      // Session info
      session: playerInfo?.sessionId || 0,
      age: playerInfo?.age || '?',
      gender: playerInfo?.gender || '?',
      
      // Trial counts
      total_trials: trials.length,
      total_correct: trials.reduce((s, t) => s + (t.correct || 0), 0),
      total_incorrect: trials.reduce((s, t) => s + (t.correct === 0 ? 1 : 0), 0),
      
      // Accuracy
      accuracy_percent: trials.length > 0 
        ? (trials.reduce((s, t) => s + (t.correct || 0), 0) / trials.length * 100).toFixed(1)
        : 0,
      
      // Timing metrics
      mean_rt_ms: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.rt_ms || 0), 0) / trials.length 
        : 0,
      mean_mit_ms: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.mit_ms || 0), 0) / trials.length 
        : 0,
      
      // Motor dynamics - means
      mean_motor_leakage: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.motor_leakage || 0), 0) / trials.length 
        : 0,
      mean_inhibition_slope: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.inhibition_slope || 0), 0) / trials.length 
        : 0,
      mean_residual_motion: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.residual_motion || 0), 0) / trials.length 
        : 0,
      mean_hesitation_count: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.hesitation_count || 0), 0) / trials.length 
        : 0,
      mean_swerve_count: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.swerve_count || 0), 0) / trials.length 
        : 0,
      
      // Motor dynamics - totals
      total_hesitations: trials.reduce((s, t) => s + (t.hesitation_count || 0), 0),
      total_swerves: trials.reduce((s, t) => s + (t.swerve_count || 0), 0),
      
      // Emotion metrics
      mean_valence_stimulus: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.valence_stimulus || 0.5), 0) / trials.length 
        : 0.5,
      mean_arousal_stimulus: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.arousal_stimulus || 0.5), 0) / trials.length 
        : 0.5,
      mean_valence_response: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.valence_response || 0.5), 0) / trials.length 
        : 0.5,
      mean_arousal_response: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.arousal_response || 0.5), 0) / trials.length 
        : 0.5,
      
      // Emotion changes
      mean_valence_delta: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.valence_delta ?? 0), 0) / trials.length 
        : 0,
      mean_arousal_delta: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.arousal_delta ?? 0), 0) / trials.length 
        : 0,
      mean_emotional_reactivity: trials.length > 0 
        ? trials.reduce((s, t) => s + (t.emotional_reactivity ?? 0), 0) / trials.length 
        : 0,
      
      // Game context
      highest_level: Math.max(...trials.map(t => t.current_level || 1), 1),
      
      // Performance by trial type (optional)
      go_trials: trials.filter(t => t.stimulus_color === 'green').length,
      nogo_trials: trials.filter(t => t.stimulus_color === 'red').length,
      correct_go: trials.filter(t => t.stimulus_color === 'green' && t.correct === 1).length,
      correct_nogo: trials.filter(t => t.stimulus_color === 'red' && t.correct === 1).length,
      
      // Timestamp
      timestamp: Date.now()
    };
    

    // Insert session summary
    
    try {
      const response = await fetch("api/gameplay_summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summaryDoc)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log(" Summary inserted:", data);

      // Show success message
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

    } catch (err) {
      console.error(" Error inserting gameplay summary:", err);
    }

    const flaskResponse = await fetch("http://localhost:5001/api/predict-adhd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summaryDoc)
    });

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      throw new Error(`Flask API error! status: ${flaskResponse.status}, message: ${errorText}`);
    }

    const predictionResult = await flaskResponse.json();
    console.log("ADHD Prediction result:", predictionResult);
    
    // Store the prediction in state
    setAdhdPrediction(predictionResult);

    // Optional: confirmation state in UI
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleShowSummary = () => {
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
  };

  useEffect(() => {
    if (!gameActive && trialLogRef.current.length > 0 && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      submitSessionToMongo();
    }
  }, [gameActive]);

  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  // Calculate game stats for summary
  const gameStats = {
    finalScore: score,
    highestLevel: level,
    timePlayed: 60 - timeLeft
  };

  // Show language selector first
  if (showLanguageSelector) {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />;
  }

  // Show player info collection ONLY if we don't have player info yet
  if (showPlayerInfo && !playerInfo) {
    return (
      <PlayerInfoCollector 
        language={language} 
        onInfoSubmitted={handlePlayerInfoSubmitted}
        onBackToLanguage={handleBackToLanguage}
      />
    );
  }

  // Main game screen
  return (
    <div className="nogo-game">
      {/* Camera with expression grid */}
      <div className="camera-side-container">
        <video 
          ref={videoRef} 
          className="camera-side-preview"
          autoPlay 
          playsInline 
          muted
        />
        <canvas 
          ref={canvasRef}
          className="expression-grid-canvas"
          width="640"
          height="480"
        />
        {showExpressionOverlay && (
          <div className="expression-metrics">
            <div className="metric-item">
              <span className="metric-label">😊</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: `${expressionMetrics.happiness * 100}%`, background: '#4caf50' }}></div>
              </div>
              <span className="metric-value">{Math.round(expressionMetrics.happiness * 100)}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">⚡</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: `${expressionMetrics.excitement * 100}%`, background: '#ff9800' }}></div>
              </div>
              <span className="metric-value">{Math.round(expressionMetrics.excitement * 100)}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">😐</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: `${expressionMetrics.neutrality * 100}%`, background: '#2196f3' }}></div>
              </div>
              <span className="metric-value">{Math.round(expressionMetrics.neutrality * 100)}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">😲</span>
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: `${expressionMetrics.surprise * 100}%`, background: '#f44336' }}></div>
              </div>
              <span className="metric-value">{Math.round(expressionMetrics.surprise * 100)}%</span>
            </div>
            <div className="face-status">
              {faceDetected ? '👤 Face Detected' : '👤 No Face'}
            </div>
          </div>
        )}
        <button 
          className="toggle-expression-btn"
          onClick={() => setShowExpressionOverlay(!showExpressionOverlay)}
        >
          {showExpressionOverlay ? '🔘' : '⚪'}
        </button>
      </div>
      
      {/* Star effect animation */}
      {showStarEffect && (
        <div className="star-effect">
          <div className="star">⭐</div>
          <div className="star">✨</div>
          <div className="star">🌟</div>
        </div>
      )}
      
      {/* Export success notification */}
      {exportSuccess && (
        <div className="export-success">
          ✅ {t('exportSuccess')}
        </div>
      )}
      
      <div className="game-header">
        <Link to="/" className="back-button">
          🏠 {t('backButton')}
        </Link>
        <h1>{t('title')}</h1>
        <div className="header-controls">
          <div className="language-switcher">
            <div className="language-dropdown-container">
              <select 
                value={language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-dropdown"
              >
                <option value="en">{t('english')} 🇺🇸</option>
                <option value="si">{t('sinhala')} 🇱🇰</option>
                <option value="ta">{t('tamil')} 🇮🇳</option>
              </select>
              <div className="language-dropdown-icon">🌍</div>
            </div>
          </div>
          <button 
            className={`sound-toggle ${soundEnabled ? 'sound-on' : 'sound-off'}`}
            onClick={toggleSound}
            title={soundEnabled ? t('soundOn') : t('soundOff')}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
      
      <p className="subtitle">{t('subtitle')}</p>
      
      {/* Player Info Badge */}
      {playerInfo && (
        <div className="player-info-badge">
          <span className="player-badge-icon">👤</span>
          <span className="player-badge-text">
            {t('playerInfo')} {playerInfo.age}{t('ageYears')} • 
            {playerInfo.gender === 'boy' ? '👦' : playerInfo.gender === 'girl' ? '👧' : '😊'} • 
            {t('sessionId')} #{playerInfo.sessionId}
          </span>
        </div>
      )}
      
      {/* Celebration animation */}
      {isPlayingCelebration && (
        <div className="celebration-overlay">
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="celebration-text">{celebrationMessage || "🎉 Amazing! 🎉"}</div>
        </div>
      )}
      
      <div className="game-info">
        <div className="score">{t('score')} <span className="score-value">{score} ⭐</span></div>
        <div className="level">{t('level')} <span className="level-value">{level} 🌈</span></div>
        <div className="high-score">{t('highScore')} <span className="high-score-value">{highScore} ⭐</span></div>
        <div className="timer">{t('time')} <span className="time-value">{timeLeft}s ⏰</span></div>
      </div>

      {!gameActive ? (
        <div className="start-screen">
          <div className="instructions">
            <h3>{t('rules')}</h3>
            <div className="rule">
              <div className="go-example">
                <div className="ball green small"></div>
                <span><strong>{t('goRule')}</strong> 🟢</span>
              </div>
              <div className="nogo-example">
                <div className="ball red small"></div>
                <span><strong>{t('nogoRule')}</strong> 🔴</span>
              </div>
            </div>
            <p className="tip">🌈 {t('clickOnGreen')}</p>
            <p className="tip">🚫 {t('dontClickOnRed')}</p>
            <p className="tip">⚡ {t('tip1')}</p>
            <p className="tip">🚀 {t('tip2')}</p>
          </div>
          
          <div className="action-buttons">
            {playerInfo ? (
              <button onClick={handlePlay} className="start-button">
                🎮 {t('play')}
              </button>
            ) : (
              <button onClick={handlePlay} className="start-button">
                🎮 {t('startButton')}
              </button>
            )}
            
            {trialLogRef.current.length > 0 && (
              <button onClick={handleShowSummary} className="summary-btn">
                📊 {t('showSummary')}
              </button>
            )}
          </div>
          
          <div className="sound-controls">
            <button 
              className={`sound-toggle-large ${soundEnabled ? 'sound-on' : 'sound-off'}`}
              onClick={toggleSound}
            >
              {soundEnabled ? '🔊 ' + t('soundOn') : '🔇 ' + t('soundOff')}
            </button>
          </div>
          
          <button 
            className="change-language-button" 
            onClick={() => setShowLanguageSelector(true)}
          >
            🌍 {t('changeLanguage')}
          </button>
        </div>
      ) : (
        <div className="game-area">
          <div className="objects-container">
            {currentObjects.map((obj, index) => (
              <div
                key={`${obj.id}-${index}`}
                className={`ball ${obj.color} 
                  ${clickedObject === obj.id ? 'grow-and-disappear' : ''} 
                  ${wrongClickedObject === obj.id ? 'shake-and-show-x' : ''} 
                  ${level > 1 ? 'bounce' : ''}`}
                style={{
                  left: `${obj.position?.x || 50}%`,
                  top: `${obj.position?.y || 50}%`,
                  animation: 'float 4s ease-in-out infinite'
                }}
                onClick={() => handleObjectClick(obj)}
              >
                {obj.emoji && <span className="ball-emoji">{obj.emoji}</span>}
                {level > 2 && <div className="sparkle"></div>}
                {wrongClickedObject === obj.id && (
                  <div className="wrong-x">✗</div>
                )}
              </div>
            ))}
          </div>
          <div className={`message ${gameMessage.includes('Yay') || gameMessage.includes('Great') || gameMessage.includes('Amazing') || gameMessage.includes('Superstar') || gameMessage.includes('+') ? 'correct' : 'wrong'}`}>
            {gameMessage}
          </div>
          <div className="instructions-text">
            {hasGreenObject ? (
              <span className="go-instruction">🌈 {t('clickOnGreen')} 🌈</span>
            ) : (
              <span className="nogo-instruction">🚫 {t('dontClickOnRed')} 🚫</span>
            )}
          </div>
          <div className="time-remaining">
            ⏰ {t('timeRemaining')} {timeLeft}s
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && (
        <div className="summary-modal">
          <div className="summary-modal-content">
            <GameSummary
              language={language}
              playerInfo={playerInfo}
              trialLog={trialLogRef.current}
              gameStats={gameStats}
              adhdPrediction={adhdPrediction}
              onClose={handleCloseSummary}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NOGOGame;