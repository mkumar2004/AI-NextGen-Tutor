'use client';

import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useMutation } from 'convex/react';
import { useUser } from '@stackframe/stack';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { STAFF_MEMBERS } from '@/constants';

export default function Pdf({ message, Discoussdata }) {
  const [jsonData, setFeedBack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readyToDownload, setReadyToDownload] = useState(false);

  const user = useUser();
  const MentorPic = STAFF_MEMBERS.find((s) => s.name === Discoussdata?.Mentor);
  const UpdateConversion = useMutation(api.DicussRoom.UpdateConversation);

  const feedbackHandler = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/feedback', { conversation: message });
      let feedbackData = res.data.feedback;

      if (typeof feedbackData === 'string') {
        feedbackData = feedbackData
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        feedbackData = JSON.parse(feedbackData);
      }

      setFeedBack(feedbackData);
      setReadyToDownload(true);

      if (Discoussdata?._id) {
        await UpdateConversion({
          id: Discoussdata._id,
          coversation: message,
          Feedback: feedbackData,
        });
      }
    } catch (err) {
      console.error('Feedback Handler Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  const downloadPdf = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 15;

    // Header gradient banner
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Interview Performance Report', 15, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 28);
    currentY = 48;

    // Mentor and Candidate details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Session Overview', 15, currentY);
    currentY += 6;

    autoTable(doc, {
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      head: [['Candidate', 'Mentor', 'Topic', 'Coaching Option']],
      body: [
        [
          user?.displayName || 'User',
          Discoussdata?.Mentor || 'Coach',
          Discoussdata?.topic || 'N/A',
          Discoussdata?.coachingOption || 'General',
        ],
      ],
      styles: { fontSize: 10 },
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // Ratings Section
    const ratings = jsonData?.Feedback?.rating || jsonData?.rating;
    if (ratings && typeof ratings === 'object') {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Performance Evaluation', 15, currentY);
      currentY += 6;

      const ratingRows = Object.entries(ratings).map(([key, value]) => [
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        `${value} / 10`,
      ]);

      autoTable(doc, {
        startY: currentY,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        head: [['Evaluation Metric', 'Score']],
        body: ratingRows,
        styles: { fontSize: 10 },
      });

      currentY = doc.lastAutoTable.finalY + 12;
    }

    // Summary & Recommendations
    const summary = jsonData?.Feedback?.summary || jsonData?.summary;
    const improvements = jsonData?.Feedback?.improvements || jsonData?.improvements;
    const recommended = jsonData?.Feedback?.Recommended || jsonData?.recommended;

    if (summary || improvements || recommended) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Feedback & Recommendations', 15, currentY);
      currentY += 6;

      const feedbackRows = [];
      if (summary) feedbackRows.push(['Summary', typeof summary === 'string' ? summary : JSON.stringify(summary)]);
      if (improvements) feedbackRows.push(['Areas for Improvement', typeof improvements === 'string' ? improvements : JSON.stringify(improvements)]);
      if (recommended) feedbackRows.push(['Recommendation', typeof recommended === 'string' ? recommended : JSON.stringify(recommended)]);

      autoTable(doc, {
        startY: currentY,
        theme: 'grid',
        headStyles: { fillColor: [147, 51, 234] },
        head: [['Section', 'Comments']],
        body: feedbackRows,
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45 } },
      });
    }

    doc.save(`Interview-Feedback-${Discoussdata?.topic || 'Session'}.pdf`);
  };

  return (
    <div className="flex gap-2">
      {!readyToDownload ? (
        <Button
          onClick={feedbackHandler}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-sm hover:opacity-90"
        >
          {loading ? 'Generating Feedback...' : '📄 Generate Feedback'}
        </Button>
      ) : (
        <Button
          onClick={downloadPdf}
          className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
        >
          ⬇️ Download PDF Report
        </Button>
      )}
    </div>
  );
}

