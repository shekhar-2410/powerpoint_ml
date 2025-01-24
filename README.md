AI-Generated Presentation Slides
![Uploading image.png…]()

This project leverages Azure GPT-3.5-turbo for generating text content and DALL·E 3 for generating images. It allows users to provide a single prompt, and the system will generate a report containing text and image content. The content is then presented in a PowerPoint-like slide presentation format on the frontend.

Table of Contents
Project Overview
Technologies Used
Features
Installation
Usage
API Endpoints
Frontend
Contributors
License
Project Overview
This project allows users to:

Enter a single prompt.
Call the backend API to generate text and an image based on the prompt.
Receive a JSON response containing the generated text and image.
View the results in a presentation-like format, similar to PowerPoint slides.
The frontend mimics a PowerPoint presentation interface where each generated slide takes up the entire screen. Users can easily navigate through the slides, view images and text, and present them just like in PowerPoint.

Technologies Used
Backend:

Node.js (Express)
Azure GPT-3.5-turbo for text generation
DALL·E 3 for image generation
Axios for API requests
JSON format for combining text and image data
Frontend:

React.js
Chakra UI for layout and styling
Vite for development and build tooling
Other Tools:

Azure for API management and AI services
GitHub for version control
Features
Text and Image Generation: Generate text and images with a single prompt.
JSON Response: Text and image data are combined into a single JSON response for easy handling.
Presentation Mode: Display generated content in a presentation-like slide format.
User Interaction: Users provide prompts, generate slides, and navigate through them as they would in PowerPoint.
Responsive Design: Optimized for both desktop and mobile devices, ensuring a smooth user experience.
Installation
To run the project locally:

Clone the repository:
bash
Copy
Edit
git clone https://github.com/your-username/ai-presentation-generator.git
cd ai-presentation-generator
Install dependencies:
bash
Copy
Edit
npm install
Run the frontend:
bash
Copy
Edit
npm run dev
Run the backend:
Ensure you have the correct Azure API keys set up in your environment variables (.env).
In the backend directory, run:
bash
Copy
Edit
npm install
npm start
Usage
Frontend: Open the frontend application. You will be prompted to enter a single-line prompt.
Generate Slides: After entering the prompt, click Generate Slides to call the backend API.
Presentation Mode: Once the response is received, it will be displayed as slides. You can navigate through the slides, each slide containing generated text and an image.
View Full Screen: Each slide will take up the full screen, simulating a PowerPoint-like experience.
API Endpoints
POST /api/generate
Generate text and image content based on a user prompt.

Request Body:

json
Copy
Edit
{
  "prompt": "A detailed description of your presentation topic"
}
Response:

json
Copy
Edit
{
  "title": "Generated Slide Title",
  "content": "Generated Slide Text Content",
  "imageUrl": "https://link-to-generated-image.com"
}
This response will be combined and returned as a JSON object, with the text and image ready to be presented on the frontend.

GET /api/slides
Retrieve the generated slides.

Frontend
The frontend of the application displays the generated slides in full-screen presentation mode. It ensures that each slide is centered, with the image and text adjusted for optimal viewing.

Key Frontend Features:
Responsive Layout: Automatically adjusts to different screen sizes.
Next/Previous Buttons: Navigate through slides using intuitive controls.
Single Slide Mode: Each slide is shown one at a time in full screen, making the presentation smooth and engaging.
Contributors
Shekhar Suman
