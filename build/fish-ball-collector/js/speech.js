// Initialize text-to-speech
window.initSpeechSynthesis = function() {
    const gs = window.gameState;
    
    if ('speechSynthesis' in window) {
        gs.speechSynthesisSupported = true;
        
        gs.voices = speechSynthesis.getVoices();
        
        speechSynthesis.onvoiceschanged = function() {
            gs.voices = speechSynthesis.getVoices();
            console.log("Voices loaded:", gs.voices.length);
        };
        
        console.log("Speech synthesis supported. Voices available:", gs.voices.length);
    } else {
        console.log("Speech synthesis not supported in this browser.");
        gs.speechSynthesisSupported = false;
    }
};

// Speak text using speech synthesis
window.speakText = function(text) {
    const gs = window.gameState;
    if (!gs.speechSynthesisSupported || !gs.voiceEnabled) return;
    
    try {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice properties
        utterance.volume = 1.0;
        utterance.rate = 0.9; // Slightly slower for children
        utterance.pitch = 1.2; // Slightly higher pitch for excitement
        
        // Try to find a voice that matches the language
        if (gs.voices.length > 0) {
            // For Sinhala, try to find a Sinhala voice or a compatible voice
            if (gs.currentLanguage === 'sinhala') {
                const sinhalaVoices = gs.voices.filter(voice => 
                    voice.lang.startsWith('si') || // Sinhala
                    v
                );
                
                if (sinhalaVoices.length > 0) {
                    utterance.voice = sinhalaVoices[0];
                    utterance.lang = sinhalaVoices[0].lang;
                } else {
                    // Use default voice if no Sinhala voice found
                    utterance.voice = gs.voices[0];
                }
            } else {
                // For English, prefer female voices
                const femaleVoices = gs.voices.filter(voice => 
                    voice.lang.startsWith('en') && (
                        voice.name.toLowerCase().includes('female') || 
                        voice.name.toLowerCase().includes('samantha') ||
                        voice.name.toLowerCase().includes('zira') ||
                        voice.name.toLowerCase().includes('karen') ||
                        voice.name.toLowerCase().includes('ava')
                    )
                );
                
                if (femaleVoices.length > 0) {
                    utterance.voice = femaleVoices[0];
                } else {
                    // Use any English voice
                    const englishVoices = gs.voices.filter(voice => voice.lang.startsWith('en'));
                    if (englishVoices.length > 0) {
                        utterance.voice = englishVoices[0];
                    } else {
                        utterance.voice = gs.voices[0];
                    }
                }
            }
        }
        
        // Speak the text
        speechSynthesis.speak(utterance);
        
    } catch (error) {
        console.log("Error with speech synthesis:", error);
    }
};