import "./App.css";
import WebcamDetector from "./components/WebcamDetector";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-[375px] h-[667px] bg-black rounded-3xl shadow-xl overflow-hidden relative">
        <div className="text-center p-4 text-lg font-bold bg-gray-800">
          Object Detector
        </div>
        <WebcamDetector />
      </div>
    </div>
  );
}
