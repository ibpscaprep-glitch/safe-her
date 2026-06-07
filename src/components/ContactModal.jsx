import React, { useState, useEffect } from 'react';
import { X, User, Phone, Users, AlertCircle } from 'lucide-react';

export default function ContactModal({ isOpen, onClose, onSave, contact }) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setPhoneNumber(contact.phoneNumber || '');
      setRelationship(contact.relationship || '');
    } else {
      setName('');
      setPhoneNumber('');
      setRelationship('');
    }
    setError('');
  }, [contact, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phoneNumber.trim() || !relationship.trim()) {
      return setError('Please fill in all fields.');
    }

    // Clean phone number validation: WhatsApp requires numbers with country code, no + or spaces
    // Let's strip spaces, dashes, and brackets, but verify it only contains numbers
    const cleanNumber = phoneNumber.replace(/[\s\-\+\(\)]/g, '');
    if (!/^\d{7,15}$/.test(cleanNumber)) {
      return setError('Please enter a valid phone number with country code (numbers only, e.g. 919876543210).');
    }

    try {
      await onSave({
        name: name.trim(),
        phoneNumber: cleanNumber,
        relationship: relationship.trim()
      });
    } catch (err) {
      console.error("Error in ContactModal handleSubmit:", err);
      if (err.code === 'permission-denied') {
        setError('Firestore database permission denied. Make sure you have enabled the Firestore Database and that your Security Rules allow users to write to their subcollections.');
      } else {
        setError(err.message || 'Failed to save contact. Please check your network connection or Firestore setup.');
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {contact ? 'Edit Contact' : 'Add Emergency Contact'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start space-x-2.5 text-red-700 text-xs animate-fadeIn">
              <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Name field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Contact Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="block w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-safety-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Phone number field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
              Phone Number
            </label>
            <span className="block text-[10px] text-slate-400 mb-1.5">
              Include country code, digits only (e.g. 919876543210 for India, 15551234567 for US)
            </span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 919876543210"
                className="block w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-safety-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Relationship field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Relationship
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Mother, Sister, Friend"
                className="block w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-safety-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm gradient-btn shadow-md hover:shadow-lg"
            >
              Save Contact
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
