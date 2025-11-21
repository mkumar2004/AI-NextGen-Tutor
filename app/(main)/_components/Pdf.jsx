import React from "react";
import { Button } from "@/components/ui/button"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";




function Pdf({message}) {
//   const jsonData = {
//     Feedback: {
//       Recommended:
//         "Yes, with reservations, as the user shows initiative in exploring AI for their project but needs more focused direction and possibly more background knowledge.",
//       improvements:
//         "The user could benefit from clarifying their specific goals for the AI integration to receive tailored advice.",
//       rating: {
//         communication: 7,
//         credits: 6,
//         problemSolving: 5,
//         technicalSkills: 6,
//       },
//       summary:
//         "The user is exploring AI integration into a full-stack concert model application, showing interest in specific technologies and frameworks. The conversation establishes a desire to use AI in both the front and back end. The user seeks a broad overview and demonstrates a basic understanding of the topic.",
//     },
//   };
  
    const feedbackHandler = async () => {
    try {
      const res = await axios.post("/api/feedback", {
        conversation: message,
      });

      console.log("Feedback API response:", res.data.feedback);

      let feedbackData = res.data.feedback;

      // If it's a string with code blocks, clean and parse it
      if (typeof feedbackData === 'string') {
        // Remove markdown code blocks
        feedbackData = feedbackData
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();

        // Parse to JSON
        feedbackData = JSON.parse(feedbackData);
      }

      // Return the entire object (with Feedback wrapper)
      return feedbackData;

    } catch (err) {
      console.log("Feedback API error:", err.response?.data || err);
      return null;
    }
  };
 
  const generatePDF = async () => {
      const jsonData  = await feedbackHandler();
    const doc = new jsPDF("p", "pt", "a4");

    const primaryColor = "#2563eb"; // Blue brand
    const grey = "#6b7280";
    const pageWidth = doc.internal.pageSize.width;

    // HEADER
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 70, "F");
    doc.setFontSize(22);
    doc.setTextColor("white");
    doc.text("NextGen Tutor – AI Feedback Report", 30, 45);

    // CONTENT
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

    // RATINGS TABLE
    autoTable(doc, {
      startY: y,
      headStyles: { fillColor: primaryColor },
      head: [["Metric", "Score"]],
      body: Object.entries(jsonData.Feedback.rating).map(([key, val]) => [key, val]),
    });

    // FOOTER on ALL pages
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
    <Button onClick={generatePDF} className="bg-blue-600 text-white">
      Download Feedback PDF
    </Button>
  );
}

export default Pdf;
