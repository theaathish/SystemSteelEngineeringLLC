"use client";

import { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Question {
    id: string;
    type: "text" | "number" | "date" | "tel" | "textarea" | "select";
    label: string;
    options?: string[];
}

export default function EditForm({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const docRef = doc(db, "forms", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title);
                    setQuestions(data.questions || []);
                } else {
                    alert("Form not found");
                    router.push("/emp-admin");
                }
            } catch (error) {
                console.error("Error fetching form:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [id, router]);

    const addQuestion = (type: Question["type"] = "text") => {
        setQuestions([
            ...questions,
            { id: Date.now().toString(), type, label: "", options: [] },
        ]);
    };

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(
            questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
        );
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const docRef = doc(db, "forms", id);
            await updateDoc(docRef, {
                title,
                questions,
                updatedAt: serverTimestamp(),
            });
            alert("Form updated successfully");
            router.push("/emp-admin");
        } catch (error) {
            console.error("Error updating form:", error);
            alert("Failed to update form");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading form...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Form</h2>
                    <p className="text-slate-500 mt-1">Update existing form details and questions.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/emp-admin")}
                        className="px-5 py-2.5 bg-white text-slate-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-bold disabled:opacity-50"
                    >
                        {saving ? "Saving Changes..." : "💾 Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Form Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="text-xl">📝</span> General Details
                        </h3>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Form Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-slate-900 transition-all font-medium placeholder-slate-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Questions Builder */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="text-xl">🏗️</span> Form Questions
                            </h3>
                            <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-1 rounded border border-gray-200">
                                {questions.length} Questions
                            </span>
                        </div>

                        <div className="p-6 space-y-6">
                            {questions.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                    <p className="text-slate-400 font-medium mb-4">No questions added yet.</p>
                                    <button
                                        type="button"
                                        onClick={() => addQuestion("text")}
                                        className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition font-semibold shadow-sm"
                                    >
                                        + Add First Question
                                    </button>
                                </div>
                            )}

                            {questions.map((q, index) => (
                                <div key={q.id} className="relative group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(q.id)}
                                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                                        >
                                            🗑️ Remove
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200">
                                            {index + 1}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {index + 1}</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-8">
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Question Label</label>
                                            <input
                                                type="text"
                                                required
                                                value={q.label}
                                                onChange={(e) => updateQuestion(q.id, "label", e.target.value)}
                                                className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-slate-900 text-sm font-medium transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-4">
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Input Type</label>
                                            <div className="relative">
                                                <select
                                                    value={q.type}
                                                    onChange={(e) =>
                                                        updateQuestion(q.id, "type", e.target.value as Question["type"])
                                                    }
                                                    className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-slate-900 text-sm font-medium appearance-none transition-all cursor-pointer"
                                                >
                                                    <option value="text">abc Text Input</option>
                                                    <option value="number">123 Number</option>
                                                    <option value="date">📅 Date Picker</option>
                                                    <option value="tel">📞 Phone Number</option>
                                                    <option value="textarea">📝 Long Text Area</option>
                                                    <option value="select">▼ Dropdown Menu</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500 text-xs">
                                                    ▼
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                            <button
                                type="button"
                                onClick={() => addQuestion("text")}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition font-bold shadow-sm"
                            >
                                <span className="bg-blue-100 text-blue-600 h-5 w-5 rounded-full flex items-center justify-center text-xs">＋</span>
                                Add Another Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
