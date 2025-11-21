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

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const primaryColor = "#2563eb"; 
    const grey = "#6b7280";
    const pageWidth = doc.internal.pageSize.width;

    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 70, "F");
    doc.setFontSize(22);
    doc.setTextColor("white");
    doc.text("NextGen Tutor – AI Feedback Report", 30, 45);

    let y = 100;

    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text("Recommended:", 30, y);
    doc.setFontSize(12);
    doc.setTextColor("black");
    doc.text(doc.splitTextToSize(jsonData.Feedback.Recommended, 540), 30, y + 20);

    y += 80;
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text("Improvements:", 30, y);
    doc.setFontSize(12);
    doc.setTextColor("black");
    doc.text(doc.splitTextToSize(jsonData.Feedback.improvements, 540), 30, y + 20);

    y += 80;
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text("Summary:", 30, y);
    doc.setFontSize(12);
    doc.setTextColor("black");
    doc.text(doc.splitTextToSize(jsonData.Feedback.summary, 540), 30, y + 20);

    y += 100;

    autoTable(doc, {
      startY: y,
      headStyles: { fillColor: primaryColor },
      head: [["Metric", "Score"]],
      body: Object.entries(jsonData.Feedback.rating).map(([key, val]) => [key, val]),
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const footerY = doc.internal.pageSize.height - 20;
      doc.setFontSize(10);
      doc.setTextColor(grey);
      doc.text(`NextGen Tutor • AI Evaluation Report • Page ${i}/${pageCount}`, 30, footerY);
    }

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