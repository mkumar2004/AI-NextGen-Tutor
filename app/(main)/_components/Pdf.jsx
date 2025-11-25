import React, { useState } from "react";
import { Button } from "@/components/ui/button"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@stackframe/stack";
import { staff } from "./UserInputDialong";  

function Pdf({ message, Discoussdata }) {
  const [jsonData, setFeedBack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readyToDownload, setReadyToDownload] = useState(false);

  const user = useUser();

  const MentorPic = staff.find((s)=>s.name==Discoussdata?.Mentor)
  


  // Add Convex mutation
  const UpdateConversion = useMutation(api.DicussRoom.UpdateConversation);

  const feedbackHandler = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/feedback", { conversation: message });
      let feedbackData = res.data.feedback;

      if (typeof feedbackData === "string") {
        feedbackData = feedbackData
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        feedbackData = JSON.parse(feedbackData);
      }

      setFeedBack(feedbackData);
      setReadyToDownload(true);

      // Save to Convex after getting feedback
      if (Discoussdata?._id) {
        await UpdateConversion({
          id: Discoussdata._id,
          coversation: message,
          Feedback: feedbackData
        });
        console.log("Saved to Convex successfully");
      }

    } catch (err) {
      console.log("Feedback API error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };


const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = () => reject("Image load failed");
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
};

const generatePDF = async () => {
  const doc = new jsPDF("p", "pt", "a4");

  /* -----------------------------
      GLOBAL LAYOUT SETTINGS  
  ------------------------------ */
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // Set consistent font globally
  doc.setFont("times", "normal");

  const colors = {
    primary: "#1f4eb8",
    border: "#d4d4d4",
    textDark: "#1a1a1a",
    textLight: "#5a5a5a",
    white: "#ffffff"
  };

  /* -----------------------------
           HEADER SECTION
  ------------------------------ */
  const headerHeight = 75;
  doc.setFillColor(31, 78, 184);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  doc.setFontSize(24);
  doc.setFont("times", "bold");
  doc.setTextColor("#ffffff");
  doc.text("AI Feedback Report", margin, 45);

  doc.setFontSize(12);
  doc.setFont("times", "italic");
  doc.text("NextGen Tutor", margin, 60);

  let y = headerHeight + 35; // Start content lower to give breathing room

  /* -----------------------------
          CARD COMPONENT
  ------------------------------ */
  const drawCard = (x, y, width, height) => {
    doc.setFillColor(colors.white);
    doc.roundedRect(x, y, width, height, 8, 8, "F");

    doc.setDrawColor(colors.border);
    doc.setLineWidth(0.8);
    doc.roundedRect(x, y, width, height, 8, 8, "S");
  };

  /* -----------------------------
           USER DETAILS
  ------------------------------ */
  const cardHeight = 90;
  const cardWidth = (contentWidth - 20) / 2;

  drawCard(margin, y, cardWidth, cardHeight);
  doc.setFontSize(14);
  doc.setFont("times", "bold");
  doc.setTextColor(colors.primary);
  doc.text("User Details", margin + 15, y + 25);

  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.setTextColor(colors.textDark);
  doc.text(`Name: ${user?.displayName || "Unknown User"}`, margin + 15, y + 47);

  doc.setFontSize(10);
  doc.setTextColor(colors.textLight);
  doc.text(`Email: ${user?.primaryEmail || "No Email"}`, margin + 15, y + 65);

  /* -----------------------------
          MENTOR DETAILS
  ------------------------------ */
  const mentorX = margin + cardWidth + 20;

  drawCard(mentorX, y, cardWidth, cardHeight);
  doc.setFontSize(14);
  doc.setFont("times", "bold");
  doc.setTextColor(colors.primary);
  doc.text("Mentor Details", mentorX + 15, y + 25);

  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.setTextColor(colors.textDark);
  doc.text(`Name: ${MentorPic?.name || "Mentor"}`, mentorX + 15, y + 47);

  // Circular Mentor Image
  if (MentorPic?.pic) {
    try {
      const img64 = await loadImageAsBase64(MentorPic.pic);
      const imgSize = 55;
      const imgX = mentorX + cardWidth - imgSize - 15;
      const imgY = y + 15;
      doc.addImage(img64, "JPEG", imgX, imgY, imgSize, imgSize);
    } catch {}
  }

  y += cardHeight + 30;

  /* -----------------------------
           DISCUSSION CARD
  ------------------------------ */
  drawCard(margin, y, contentWidth, 80);

  doc.setFontSize(14);
  doc.setFont("times", "bold");
  doc.setTextColor(colors.primary);
  doc.text("Discussion", margin + 15, y + 25);

  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.setTextColor(colors.textDark);
  doc.text(`Topic: ${Discoussdata?.topic || "No Topic"}`, margin + 15, y + 47);
  doc.text(`Coaching Option: ${Discoussdata?.coachingOption || "N/A"}`, margin + 15, y + 65);

  y += 100;

  /* -----------------------------
         FEEDBACK SECTIONS
  ------------------------------ */
  const feedbackCardHeight = 120;

  const renderSection = (title, text) => {
    drawCard(margin, y, contentWidth, feedbackCardHeight);

    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.setTextColor(colors.primary);
    doc.text(title, margin + 15, y + 25);

    doc.setFontSize(11);
    doc.setFont("times", "normal");
    doc.setTextColor(colors.textDark);
    const wrapped = doc.splitTextToSize(text, contentWidth - 30);
    doc.text(wrapped, margin + 15, y + 45);

    y += feedbackCardHeight + 25;
  };

  renderSection("Recommended", jsonData.Feedback.Recommended);
  renderSection("Improvements", jsonData.Feedback.improvements);
  renderSection("Summary", jsonData.Feedback.summary);

  /* -----------------------------
                FOOTER
  ------------------------------ */
  doc.setFontSize(10);
  doc.setFont("times", "italic");
  doc.setTextColor(colors.textLight);
  doc.text("Generated by NextGen Tutor AI", margin, pageHeight - 30);
  doc.text(new Date().toLocaleDateString(), pageWidth - margin - 60, pageHeight - 30);

  /* -----------------------------
              SAVE PDF
  ------------------------------ */
  doc.save("feedback-report.pdf");
};

  return (
    <div>
      {!readyToDownload && !loading && (
        <button 
          onClick={feedbackHandler}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate Feedback
        </button>
      )}

      {loading && (
        <button 
          disabled
          className="px-6 py-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-white font-semibold rounded-lg shadow-lg cursor-not-allowed flex items-center gap-2"
        >
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </button>
      )}

      {readyToDownload && !loading && (
        <button 
          onClick={generatePDF}
          className="px-6 py-3 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
          Download PDF
        </button>
      )}
    </div>
      
  );
}

export default Pdf;