<!-- Media Recorder App -->

A React-based application to record **audio** and **video**, preview the recording, and download the result. It supports pause/resume functionality and stores past recordings using `localStorage`.

---

<!-- Project Structure -->
media-recorder-app/
├── public/
│ └── index.html # Base HTML template
├── src/
│ ├── pages/
│ │ └── MediaRecorderApp.js # Main recording logic
│ ├── App.js # Loads routes
| |---routes.js # Loads MediaRecorderApp
│ ├── index.js # React entry point
│ └── index.css # styles and custom styles
├── package.json # Dependencies and scripts
└── README.md # You're reading this!

<!-- Clone the repo -->
   <!-- bash -->
   git clone https://github.com/mvmanikanta14/mediaRecorderApp.git
   cd mediaRecorderApp

<!-- # Open Terminal -->
<!-- # Install dependencies -->

  npm install

<!-- Start the development server -->

npm start

Open your browser at: http://localhost:3000

<!-- Features -->
 Record audio

 Record video with live preview

 Pause /  Resume recording

 Shows timer during recording

 Preview after recording

 Download .webm files

 Lists past recordings from localStorage

 <!-- Notes -->

 Works best on modern browsers (Chrome, Edge, Firefox)

 Permissions are required for mic and camera

 Video recording requires HTTPS or localhost



