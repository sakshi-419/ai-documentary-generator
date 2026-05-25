import { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const generateDocumentary = async () => {
    if (!topic) return;

    try {
      setLoading(true);
      // Clear previous assets instantly so old images don't stretch or mismatch
      setImageUrl("");
      setScript("");

      // Primary AI Prompt Setup
      const promptText = `${topic}, realistic cinematic wildlife documentary style, ultra hd, national geographic photograph`;
      const randomSeed = Math.floor(Math.random() * 1000000);
      
      // Request generated image asset
      const generatedImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=1024&height=576&seed=${randomSeed}&nologo=true`;

      setImageUrl(generatedImage);

      // SCRIPT API Call
      const response = await axios.post(
        "http://localhost:5000/generate",
        {
          topic,
        }
      );

      setScript(response.data.script);

    } catch (error) {
      console.error(error);
      alert("Failed to generate documentary");
    } finally {
      setLoading(false);
    }
  };

  // PLAY NARRATION
  const speakNarration = () => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(script);

    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // STOP NARRATION
  const stopNarration = () => {
    window.speechSynthesis.cancel();
  };

  // COPY SCRIPT
  const copyScript = () => {
    navigator.clipboard.writeText(script);
    alert("Script copied!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-7xl font-bold text-center text-yellow-500 mb-6">
          AI Documentary Generator
        </h1>

        <p className="text-center text-2xl text-gray-300 mb-12">
          Generate cinematic AI documentaries instantly
        </p>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Enter documentary topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-6 rounded-2xl bg-zinc-900 border border-zinc-700 text-2xl outline-none"
        />

        {/* BUTTON */}
        <button
          onClick={generateDocumentary}
          disabled={loading}
          className="w-full mt-6 bg-yellow-500 text-black py-6 rounded-2xl text-3xl font-bold hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Documentary"}
        </button>

        {/* IMAGE CONTAINMENT */}
        {imageUrl && (
          <div className="mt-10">
            <img
              src={imageUrl}
              alt={topic}
              className="w-full h-auto max-h-[600px] object-cover rounded-3xl border border-zinc-700"
              onError={(e) => {
                // FIXED NO HARDCODING: Dynamically builds a fallback search string 
                // using Unsplash source keywords based on what the user typed.
                e.target.onerror = null; 
                e.target.src = `https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1024&auto=format&fit=crop&sig=${Math.floor(Math.random() * 1000)}&txt=${encodeURIComponent(topic)}&txtalign=center,middle&txtsize=50&txtclr=fff&txtpad=30&bg=000`;
                
                // Alternative purely dynamic source route:
                e.target.src = `https://source.unsplash.com/featured/1024x576/?${encodeURIComponent(topic)}`;
              }}
            />
          </div>
        )}

        {/* SCRIPT PRESENTATION */}
        {script && (
          <div className="mt-10 bg-zinc-900 p-8 rounded-3xl border border-zinc-700">

            <h2 className="text-5xl font-bold text-yellow-500 mb-8">
              Generated Documentary Script
            </h2>

            <pre className="whitespace-pre-wrap text-xl leading-10">
              {script}
            </pre>

            {/* CONTROL PANEL */}
            <div className="flex gap-4 mt-8 flex-wrap">

              <button
                onClick={speakNarration}
                className="bg-yellow-500 text-black px-6 py-4 rounded-xl font-bold text-xl hover:bg-yellow-400"
              >
                🔊 Play Narration
              </button>

              <button
                onClick={stopNarration}
                className="bg-red-500 text-white px-6 py-4 rounded-xl font-bold text-xl hover:bg-red-400"
              >
                ⏹ Stop Narration
              </button>

              <button
                onClick={copyScript}
                className="bg-white text-black px-6 py-4 rounded-xl font-bold text-xl hover:bg-gray-200"
              >
                📋 Copy Script
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;