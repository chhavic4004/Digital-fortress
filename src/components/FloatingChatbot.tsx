import { useState, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Mic, MicOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FloatingChatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Cyber Guardian. How can I help you stay safe online today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true);
  type SpeechRecognitionLike = {
    start: () => void;
    stop: () => void;
    onresult?: (event: unknown) => void;
    onerror?: (event: unknown) => void;
    onend?: () => void;
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
  };
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Initialize Web Speech API with fallback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use a try-catch block to handle potential initialization errors
      try {
        const w = window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike };
        const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
          const recognitionInstance = new SpeechRecognition();
          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = false;
          recognitionInstance.lang = 'en-US';

          // Create a wrapper function that handles network errors
          const createSafeRecognition = () => {
            const safeRecognition = new SpeechRecognition();
            safeRecognition.continuous = false;
            safeRecognition.interimResults = false;
            safeRecognition.lang = 'en-US';
            
            safeRecognition.onresult = recognitionInstance.onresult;
            safeRecognition.onend = recognitionInstance.onend;
            
            // Custom error handler with retry logic
            safeRecognition.onerror = (event: unknown) => {
              const err = event as { error?: string };
              console.error("Speech recognition error:", err.error);
              setIsListening(false);
              
              if (err.error === "network") {
                setNetworkError(true);
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: "Network error detected. Please check your internet connection and try again.",
                  },
                ]);
              } else {
                // Handle other errors
                let errorMessage = "Sorry, I couldn't hear you. Please try typing your message instead.";
                
                if (err.error === "not-allowed") {
                  errorMessage = "Microphone access denied. Please allow microphone access in your browser settings.";
                } else if (err.error === "aborted") {
                  errorMessage = "Speech recognition was aborted. Please try again.";
                } else if (err.error === "audio-capture") {
                  errorMessage = "No microphone detected. Please ensure your microphone is connected and working.";
                } else if (err.error === "service-not-allowed") {
                  errorMessage = "Speech recognition service is not allowed. This may be due to security restrictions.";
                }
                
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: errorMessage,
                  },
                ]);
              }
            };
            
            return safeRecognition;
          };
          
          // Store the factory function instead of the instance
          setRecognition({
            start: () => {
              try {
                const instance = createSafeRecognition();
                instance.start();
                
                // Set up result handler
                instance.onresult = (event: unknown) => {
                  const e = event as { results: { [key: number]: { [key: number]: { transcript: string } } } };
                  const transcript = e.results[0][0].transcript;
                  setInput(transcript);
                  setIsListening(false);
                  
                  // Auto-send if voice command mode detected
                  const lowerTranscript = transcript.toLowerCase();
                  if (lowerTranscript.includes("scan") || 
                      lowerTranscript.includes("check") || 
                      lowerTranscript.includes("show") ||
                      lowerTranscript.includes("awareness") ||
                      lowerTranscript.includes("feed")) {
                    setTimeout(() => {
                      // Will be handled by handleSend function
                      const messageToSend = transcript;
                      if (messageToSend.trim()) {
                        setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
                        setInput("");
                        // Trigger send
                        const sendMessage = async () => {
                          const isVoiceCommand = lowerTranscript.includes("scan") || 
                                                lowerTranscript.includes("check") ||
                                                lowerTranscript.includes("show");
                          try {
                            const response = await fetch(`${API_BASE_URL}/chatbot`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                query: messageToSend,
                                voiceCommandMode: isVoiceCommand,
                              }),
                            });
                            const data = await response.json();
                            if (data.success) {
                              setMessages((prev) => [
                                ...prev,
                                { role: "assistant", content: data.data.response || "I'm here to help!" },
                              ]);
                            }
                          } catch (error) {
                            console.error("Chatbot error:", error);
                          }
                        };
                        sendMessage();
                      }
                    }, 500);
                  }
                };
                
                // Set up end handler
                instance.onend = () => {
                  setIsListening(false);
                };
              } catch (error) {
                console.error("Failed to start speech recognition:", error);
                setIsListening(false);
                setNetworkError(true);
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: "Failed to start speech recognition. Please try again later or type your message.",
                  },
                ]);
              }
            },
            stop: () => {
              // Nothing to stop if there's no active instance
              setIsListening(false);
            }
          });
        } else {
          setSpeechRecognitionSupported(false);
        }
      } catch (error) {
        console.error("Error initializing speech recognition:", error);
        setSpeechRecognitionSupported(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Speech recognition is not available. Please type your message instead.",
          },
        ]);
      }
    }
  }, [API_BASE_URL]);

  const startListening = useCallback(() => {
    // Reset network error state when starting to listen
    setNetworkError(false);
    
    if (recognition && !isListening) {
      try {
        setIsListening(true);
        recognition.start();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "🎤 Listening... Speak your question or command now.",
          },
        ]);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
        setNetworkError(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Error starting speech recognition. Please try again or type your message instead.",
          },
        ]);
      }
    } else if (!recognition) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Voice recognition is not supported in your browser. Please type your message instead.",
        },
      ]);
    }
  }, [recognition, isListening]);

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSend = async (voiceText?: string) => {
    const messageToSend = voiceText || input.trim();
    if (!messageToSend) return;

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    if (!voiceText) setInput("");

        // Check for voice commands
        const isVoiceCommand = messageToSend.toLowerCase().includes("scan") ||
                              messageToSend.toLowerCase().includes("check") ||
                              messageToSend.toLowerCase().includes("show") ||
                              messageToSend.toLowerCase().includes("wifi") ||
                              messageToSend.toLowerCase().includes("fraud") ||
                              messageToSend.toLowerCase().includes("awareness") ||
                              messageToSend.toLowerCase().includes("feed");

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: messageToSend,
          voiceCommandMode: isVoiceCommand,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.data.response || "I'm here to help with cybersecurity questions!",
          },
        ]);

        // If voice command mode detected an action, navigate or inform user
        if (data.data.action) {
          const action = data.data.action;
          
          // Navigate based on action
          if (action === 'awareness_feed') {
            setTimeout(() => {
              navigate('/awareness-feed');
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Opening Awareness Feed for you now!",
                },
              ]);
            }, 500);
          } else if (action === 'wifi_scan') {
            setTimeout(() => {
              navigate('/wi-defend');
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Opening Wi-Defend page for you now!",
                },
              ]);
            }, 500);
          } else if (action === 'detect_fraud') {
            setTimeout(() => {
              navigate('/fraud-detector');
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Opening Fraud Detector for you now!",
                },
              ]);
            }, 500);
          } else if (action === 'url_scan') {
            setTimeout(() => {
              navigate('/fraud-detector');
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Opening Fraud Detector for URL scanning!",
                },
              ]);
            }, 500);
          } else if (action === 'get_scams') {
            setTimeout(() => {
              navigate('/scam-database');
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Opening Scam Database for you now!",
                },
              ]);
            }, 500);
          } else {
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: `I can help you with ${action.replace("_", " ")}. Navigate to the relevant page to use this feature!`,
                },
              ]);
            }, 500);
          }
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble connecting. Please make sure the backend is running.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-card border-2 border-primary/30 rounded-lg shadow-card flex flex-col z-50 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-gradient-cyber">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-bold">AI Cyber Guardian</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-primary/20">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about cybersecurity or use voice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
                disabled={isListening}
              />
              {isListening ? (
                <Button
                  onClick={stopListening}
                  size="icon"
                  variant="destructive"
                  title="Stop listening"
                >
                  <MicOff className="h-4 w-4" />
                </Button>
              ) : networkError ? (
                <Button
                  onClick={startListening}
                  size="icon"
                  variant="outline"
                  title="Retry voice input"
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={startListening}
                  size="icon"
                  variant="outline"
                  title="Start voice input"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
              <Button onClick={() => handleSend()} size="icon" disabled={isListening}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isListening && (
              <p className="text-xs text-primary mt-2 text-center animate-pulse">
                🎤 Listening... Speak now
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-red-glow hover:shadow-cyan-glow z-50 animate-float"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  );
};

export default FloatingChatbot;
