/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useRef } from "react";

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  };
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error:
    | "aborted"
    | "audio-capture"
    | "bad-grammar"
    | "language-not-supported"
    | "network"
    | "no-speech"
    | "not-allowed"
    | "service-not-allowed";
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: SpeechGrammarList;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  onnomatch:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechGrammarList {
  length: number;
  item(index: number): SpeechGrammar;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
  [index: number]: SpeechGrammar;
}

interface SpeechGrammar {
  src: string;
  weight: number;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const SpeechToText: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isStopping, setIsStopping] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const stopTimeout = useRef<NodeJS.Timeout>();

  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "pl-PL";

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
      setIsStopping(false);
      setError("");
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log("Speech recognition error", event);
      setError(`Error: ${event.error}`);
      setIsListening(false);
      setIsStopping(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      setIsStopping(false);

      if (stopTimeout.current) {
        clearTimeout(stopTimeout.current);
        stopTimeout.current = undefined;
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        }
      }

      if (finalTranscript) {
        setText((prev) => prev + finalTranscript);
      }
    };

    return recognition;
  }, []);

  useEffect(() => {
    const recognition = initializeSpeechRecognition();
    if (recognition) {
      setRecognition(recognition);
    }

    return () => {
      if (stopTimeout.current) {
        clearTimeout(stopTimeout.current);
      }
      if (recognition) {
        recognition.stop();
      }
    };
  }, [initializeSpeechRecognition]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      setError("Speech recognition not initialized");
      return;
    }

    if (isListening) {
      setIsStopping(true);

      recognition.stop();

      stopTimeout.current = setTimeout(() => {
        setIsListening(false);
        setIsStopping(false);
      }, 15000);
    } else {
      setText("");
      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setError("Failed to start speech recognition");
        setIsStopping(false);
      }
    }
  }, [recognition, isListening]);

  return (
    <div className="p-4 max-w-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Speech to Text</h2>
          <button
            onClick={toggleListening}
            disabled={!recognition || isStopping}
            className={`
                px-4 py-2 rounded-lg font-medium
                ${
                  isStopping
                    ? "bg-gray-500"
                    : isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                }
                text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
              `}
          >
            {isStopping ? "Stopping..." : isListening ? "Stop" : "Start"}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700">{error}</div>
        )}

        <div className="min-h-[200px] p-4 rounded-lg bg-gray-50 border relative">
          {text || "Transcription will appear here..."}
          {isStopping && (
            <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center">
              <span className="text-gray-500">Stopping recognition...</span>
            </div>
          )}
        </div>

        {(isListening || isStopping) && (
          <div className="text-sm text-gray-500">
            {isStopping
              ? "Finishing up... This might take a few seconds."
              : "Listening..."}
          </div>
        )}
      </div>
    </div>
  );
};
