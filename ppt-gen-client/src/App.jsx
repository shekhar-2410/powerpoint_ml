import { Routes, Route } from "react-router";

import AIPromptPage from "./components/AIPromptPage";
import GeneratedContentPage from "./components/PptDiplay";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AIPromptPage />} />
      {/* <Route path="/ai-prompt" element={<AIPromptPage />} /> */}
      <Route path="/generated-content" element={<GeneratedContentPage />} />
    </Routes>
  );
}

export default App;
