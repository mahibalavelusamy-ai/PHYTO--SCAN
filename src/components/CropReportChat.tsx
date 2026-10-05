import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  Sparkles,
  AlertCircle,
  Square,
  RotateCcw,
} from 'lucide-react';
import { PlantAnalysisResult } from '../services/plantAnalysis/types.ts';
import { Language } from '../utils/i18n.ts';
import {
  ChatMessageItem,
  SUGGESTED_PROMPTS,
  INITIAL_GREETINGS,
} from './chat/chatTypes.ts';
import { useAudioTranscriber } from './chat/useAudioTranscriber.ts';

interface CropReportChatProps {
  result: PlantAnalysisResult;
  language: Language;
}

export const CropReportChat: React.FC<CropReportChatProps> = ({ result, language }) => {
  const cropName = result.condition?.includes('___')
    ? result.condition.split('___')[0].replace(/_/g, ' ')
    : result.condition?.split(' ')[0] || 'your crop';

  const conditionName = result.condition || 'detected issue';

  const [messages, setMessages] = useState<ChatMessageItem[]>(() => [
    {
      id: 'initial',
      role: 'model',
      content: INITIAL_GREETINGS[language]
        ? INITIAL_GREETINGS[language](cropName, conditionName)
        : INITIAL_GREETINGS.en(cropName, conditionName),
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    isRecording,
    recordingSeconds,
    isTranscribing,
    startRecording,
    stopRecording,
  } = useAudioTranscriber({
    language,
    onTranscriptionComplete: (text) => {
      setInput(text);
      setChatError(null);
    },
    onError: (err) => {
      setChatError(err);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isTranscribing]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    setChatError(null);
    const userMsg: ChatMessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);

    try {
      const payloadMessages = nextHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          reportContext: {
            crop: cropName,
            condition: conditionName,
            confidence: result.confidence,
            severity: result.severity,
            observations: result.observations,
            recommendedActions: result.recommendedActions,
            prevention: result.prevention,
            uncertaintyNote: result.uncertaintyNote,
          },
          language,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to reach agronomist assistant.');
      }

      const data = await res.json();
      const modelMsg: ChatMessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply || 'Guidance received.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatError(err.message || 'Unable to connect to agronomist assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const prompts = SUGGESTED_PROMPTS[language] || SUGGESTED_PROMPTS.en;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-sm mb-8 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
              <span>Ask Agronomist AI</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </h4>
            <p className="text-xs text-stone-500">
              Interactive consultation for {cropName} ({conditionName})
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'initial_reset',
                role: 'model',
                content: INITIAL_GREETINGS[language]
                  ? INITIAL_GREETINGS[language](cropName, conditionName)
                  : INITIAL_GREETINGS.en(cropName, conditionName),
                timestamp: new Date(),
              },
            ])
          }
          className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
          title="Restart conversation"
          aria-label="Restart conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      {messages.length <= 2 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Suggested questions for this report:
          </p>
          <div className="flex flex-wrap gap-2">
            {prompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                disabled={isLoading}
                className="text-xs font-medium text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200/90 px-3 py-1.5 rounded-xl text-left transition-colors cursor-pointer disabled:opacity-50"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Conversation Thread */}
      <div className="h-72 sm:h-80 overflow-y-auto space-y-3.5 pr-1 mb-4 rounded-2xl bg-stone-50/60 p-4 border border-stone-100">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-xs'
                  : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-xs'
              }`}
            >
              {m.role === 'model' && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  <Bot className="w-3 h-3" />
                  <span>Agronomist AI</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-2 text-xs text-stone-500">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Agronomist AI is preparing guidance...</span>
            </div>
          </div>
        )}

        {isTranscribing && (
          <div className="flex justify-start">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-2 text-xs text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              <span>Transcribing your spoken question (Gemini 3.5 Transcribe)...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Notice */}
      {chatError && (
        <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{chatError}</span>
          </div>
          <button
            onClick={() => setChatError(null)}
            className="text-rose-700 underline font-semibold ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Recording State Banner */}
      {isRecording && (
        <div className="mb-3 p-3 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
            <span className="w-3 h-3 rounded-full bg-rose-600" />
            <span>Listening... Speak your question ({recordingSeconds}s)</span>
          </div>
          <button
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Done Speaking</span>
          </button>
        </div>
      )}

      {/* Input Controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to your microphone...'
                : isTranscribing
                ? 'Transcribing audio...'
                : 'Ask a question or tap mic to speak...'
            }
            disabled={isLoading || isRecording || isTranscribing}
            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-60 transition-all pr-10"
          />
          {input.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Microphone Audio Transcribe Button */}
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading || isTranscribing}
          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
            isRecording
              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
              : 'bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border-stone-200 hover:border-emerald-300 shadow-2xs'
          } disabled:opacity-50`}
          title={isRecording ? 'Stop recording' : 'Speak question with microphone (Gemini Transcribe)'}
          aria-label={isRecording ? 'Stop recording' : 'Speak question with microphone'}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4 animate-bounce" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() || isLoading || isRecording || isTranscribing}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          title="Send message"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
