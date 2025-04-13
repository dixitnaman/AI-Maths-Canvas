# AI MATHS CANVAS

## Overview

The **AI Math Canvas** is an AI-powered tool that allows users to draw mathematical expressions on a digital canvas. The application processes the handwritten input, extracts the equation, solves it using AI, and returns the computed result in real-time.

It integrates **React** for the frontend, **FastAPI** for the backend, and **Gemini Flash AI API** for high-accuracy equation solving. By leveraging handwriting recognition (OCR) and AI, the calculator provides an intuitive and seamless experience for solving handwritten math problems.

## Technologies Used

### Frontend:
- **React:** Renders the canvas UI for drawing equations. Handles user interactions and dynamically displays results.
- **Shadcn:** Enhances UI components for a better user experience.
- **MathJax:** Properly formats and displays mathematical expressions in a clean, readable manner.

### Backend:
- **FastAPI (Python):** Acts as the backend server to process image input, extract equations, and communicate with the AI.
- **Uvicorn:** Runs the FastAPI server asynchronously to handle multiple user requests efficiently.
- **Pillow:** Preprocesses the drawn image (resizing, noise removal, binarization) for better OCR accuracy.

### AI Integration:
- **Gemini Flash API:** Takes the recognized equation, solves it, and returns the result with high accuracy.
- **OCR (Tesseract or custom model):** Extracts handwritten digits and operators from the image, converting them into a machine-readable equation.

## Technology Roles in the Process

| **Technology**          | **Role in the Process**                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------------------------|
| **React + Shadcn**       | Renders the canvas UI for drawing equations. Handles user interactions and displays results dynamically. |
| **FastAPI (Python)**     | Acts as the backend server to process image input, extract equations, and communicate with the AI.         |
| **Pillow**               | Preprocesses the drawn image (resizing, noise removal, binarization) for better OCR accuracy.              |
| **OCR (Tesseract or custom model)** | Extracts handwritten digits and operators from the image. Converts them into a machine-readable equation. |
| **Gemini Flash API**     | Takes the recognized equation, solves it, and returns the result with high accuracy.                        |
| **Uvicorn**              | Runs the FastAPI server asynchronously to handle multiple user requests efficiently.                      |
| **MathJax**              | Properly formats and displays mathematical expressions in a clean, readable manner.                        |

##LINK TO ONLINE [DEPLOYED PROJECT](https://calc-fe.vercel.app/)
