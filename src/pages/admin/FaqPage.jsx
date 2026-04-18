import React, { useEffect, useState } from "react";
import {
    getAllCategories,
    getAllFaqs,
    createFaq,
    updateFaq,
    deleteFaq
} from "../../api/faqApi";

const FaqPage = () => {
    const [categories, setCategories] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [activeFaqId, setActiveFaqId] = useState(null);

    // form state
    const [form, setForm] = useState({
        category_id: "",
        question: "",
        answer: ""
    });

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getAllCategories().then(setCategories);
        getAllFaqs().then(setFaqs);
    };

    const getFaqsByCategory = (categoryId) => {
        return faqs.filter(f => f.category_id === categoryId);
    };

    const toggle = (faqId) => {
        setActiveFaqId(prev => (prev === faqId ? null : faqId));
    };

    /* ================= CREATE ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.category_id || !form.question || !form.answer) return;

        if (editId) {
            await updateFaq(editId, form);
        } else {
            await createFaq(form);
        }

        setForm({ category_id: "", question: "", answer: "" });
        setEditId(null);
        fetchData();
    };

    /* ================= EDIT ================= */
    const handleEdit = (faq) => {
        setForm({
            category_id: faq.category_id,
            question: faq.question,
            answer: faq.answer
        });
        setEditId(faq.faq_id);
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this FAQ?")) return;
        await deleteFaq(id);
        fetchData();
    };

    return (
        // ONLY classNames updated — logic untouched

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">

            {/* HEADER */}
            <div className="max-w-4xl mx-auto text-center mb-14">
                <h1 className="text-5xl font-bold tracking-tight text-slate-800">
                    Frequently Asked Questions
                </h1>
                <p className="text-slate-500 mt-4 text-lg">
                    Manage and organize your FAQs efficiently
                </p>
            </div>

            {/* FORM */}
            <div className="max-w-4xl mx-auto mb-12 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200/60">

                <h2 className="text-xl font-semibold text-slate-700 mb-6">
                    {editId ? "Update FAQ" : "Add New FAQ"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <select
                        value={form.category_id}
                        onChange={e => setForm({ ...form, category_id: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.category_id} value={c.category_id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Question"
                        value={form.question}
                        onChange={e => setForm({ ...form, question: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    />

                    <textarea
                        placeholder="Answer"
                        value={form.answer}
                        onChange={e => setForm({ ...form, answer: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    />

                    <div className="flex gap-3 pt-2">
                        <button className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                            {editId ? "Update" : "Add"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setForm({ category_id: "", question: "", answer: "" });
                                }}
                                className="bg-slate-400 text-white px-6 py-2 rounded-xl hover:bg-slate-500 transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                </form>
            </div>

            {/* CONTENT */}
            <div className="max-w-4xl mx-auto space-y-10">

                {categories.map(category => {
                    const categoryFaqs = getFaqsByCategory(category.category_id);

                    if (!categoryFaqs.length) return null;

                    return (
                        <div
                            key={category.category_id}
                            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-slate-200/60 hover:shadow-xl transition-all"
                        >

                            <h2 className="text-2xl font-semibold text-slate-700 mb-5">
                                {category.name}
                            </h2>

                            <div className="space-y-4">
                                {categoryFaqs.map(faq => (
                                    <div
                                        key={faq.faq_id}
                                        className="border border-slate-200 rounded-2xl overflow-hidden bg-white/80 shadow-sm hover:shadow-md transition-all"
                                    >

                                        <button
                                            onClick={() => toggle(faq.faq_id)}
                                            className="w-full px-5 py-4 bg-slate-100/70 hover:bg-slate-200/70 transition flex justify-between items-center font-medium text-slate-700"
                                        >
                                            {faq.question}

                                            <span className="text-xl transition-transform duration-300">
                                                {activeFaqId === faq.faq_id ? "−" : "+"}
                                            </span>
                                        </button>

                                        <div
                                            className={`px-5 transition-all duration-300 ease-in-out ${activeFaqId === faq.faq_id
                                                    ? "max-h-40 py-4 opacity-100"
                                                    : "max-h-0 overflow-hidden opacity-0"
                                                }`}
                                        >
                                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                                {faq.answer}
                                            </p>

                                            {/* ACTIONS */}
                                            <div className="flex gap-4 text-sm">
                                                <button
                                                    onClick={() => handleEdit(faq)}
                                                    className="text-indigo-600 hover:underline"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(faq.faq_id)}
                                                    className="text-red-500 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default FaqPage;