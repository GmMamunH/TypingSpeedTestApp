import React, { useState, useEffect, useRef, useCallback } from "react";
import logo from "../images/logo.png";
// import { Link } from "react-router-dom";
function TypingTest() {
  const year = new Date().getUTCFullYear();
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState(null);
  const [savedResults, setSavedResults] = useState([]);
  const inputRef = useRef(null);

  const calculateResults = useCallback(() => {
    const wordsTyped = inputText.trim().split(" ").length;
    const wordsPerMinute = wordsTyped / (elapsedTime / 60);
    const correctChars = text
      .trim()
      .split("")
      .filter((char, idx) => char === inputText.trim()[idx]).length;
    const accuracy = (correctChars / text.trim().length) * 100;
    const newResult = {
      wordsPerMinute,
      accuracy,
      elapsedTime,
      totalChars: text.length,
      charsWritten: inputText.length,
    };
    setResult(newResult);
    saveResult(newResult);
  }, [inputText, text, elapsedTime]);

  const saveResult = (result) => {
    const existingResults =
      JSON.parse(localStorage.getItem("typingTestResults")) || [];
    existingResults.push(result);
    localStorage.setItem("typingTestResults", JSON.stringify(existingResults));
    setSavedResults(existingResults);
  };

  const loadResults = () => {
    const existingResults =
      JSON.parse(localStorage.getItem("typingTestResults")) || [];
    setSavedResults(existingResults);
  };

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    if (isRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (isRunning && timer === 0) {
      setIsRunning(false);
      alert("Time is up!");
      calculateResults();
    }
  }, [isRunning, timer, calculateResults]);

  useEffect(() => {
    if (isRunning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && inputText.trim() === text.trim()) {
      setIsRunning(false);
      calculateResults();
    }
  }, [isRunning, inputText, text, calculateResults]);

  const startTest = () => {
    if (text && time > 0) {
      setIsRunning(true);
      setTimer(time);
      setElapsedTime(0);
      setInputText("");
      setResult(null);
    } else {
      alert("Please enter text and set a valid time.");
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const renderHighlightedText = () => {
    return text.split("").map((char, idx) => {
      const userChar = inputText[idx];
      let bgColor = "";
      if (userChar !== undefined) {
        bgColor = char === userChar ? "bg-green-200" : "bg-red-200";
      }
      return (
        <span key={idx} className={`${bgColor} p-1`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex gap-3 items-center py-5">
        <img className="w-12" src={logo} alt="typing-speed-test-logo" />
        <h1 className="text-2xl font-bold">Check your Typing speed</h1>
      </div>

      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Enter text to type..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isRunning}
      />
      <div className="flex items-center mb-4"> 
        <label className="pr-2"> Set your time (seconds): </label>
        <input
          type="number"
          className="w-20 p-2 border border-gray-300 rounded mr-2"
          placeholder="Time (s)"
          value={time}
          onChange={(e) => setTime(parseInt(e.target.value))}
          disabled={isRunning}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={startTest}
          disabled={isRunning}
        >
          Start Test
        </button>
      </div>
      {isRunning && (
        <div className="mb-4">
          <p>Time remaining: {timer} seconds</p>
          <div className="mb-2 p-2 border border-gray-300 rounded">
            {renderHighlightedText()}
          </div>
          <textarea
            ref={inputRef}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Start typing..."
            value={inputText}
            onChange={handleInputChange}
            disabled={!isRunning}
          />
        </div>
      )}
      <div className="flex justify-center items-center gap-1">
        <p>© All Rights Reserved {year}</p>
        <a className="text-green-700 text-xl font-semibold hover:text-red-600 duration-300" href="https://gmmamunh.vercel.app/">
          RSM Develope
        </a>
      </div>

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Results</h2>
          <p>Words per minute: {result.wordsPerMinute.toFixed(2)}</p>
          <p>Accuracy: {result.accuracy.toFixed(2)}%</p>
          <p>Elapsed time: {result.elapsedTime} seconds</p>
          <p>Total characters: {result.totalChars}</p>
          <p>Characters written: {result.charsWritten}</p>
          {result.accuracy === 100 && (
            <p className="text-green-500 font-bold">
              Congratulations! You finished the text perfectly!
            </p>
          )}
        </div>
      )}
      {savedResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Previous Results</h2>
          <ul>
            {savedResults.map((res, idx) => (
              <li key={idx} className="mb-2 p-2 border border-gray-300 rounded">
                <p>Words per minute: {res.wordsPerMinute.toFixed(2)}</p>
                <p>Accuracy: {res.accuracy.toFixed(2)}%</p>
                <p>Elapsed time: {res.elapsedTime} seconds</p>
                <p>Total characters: {res.totalChars}</p>
                <p>Characters written: {res.charsWritten}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TypingTest;
