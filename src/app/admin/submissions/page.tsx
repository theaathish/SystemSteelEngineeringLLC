"use client";
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  userAgent: string;
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading submissions...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Form Submissions</h1>
          
          {submissions.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                      <p className="text-gray-600">{submission.email}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{new Date(submission.submittedAt).toLocaleDateString()}</p>
                      <p>{new Date(submission.submittedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                    <p className="text-gray-800 whitespace-pre-wrap">{submission.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
