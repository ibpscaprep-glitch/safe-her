import React from 'react';
import { User, Phone, Plus, Edit2, Trash2 } from 'lucide-react';

export default function ContactList({ contacts, onAddClick, onEditClick, onDeleteClick }) {
  
  const getRelationBadgeColor = (rel) => {
    const r = rel.toLowerCase();
    if (r === 'mother' || r === 'mom' || r === 'father' || r === 'dad' || r === 'parent') {
      return 'bg-purple-100 text-purple-800';
    } else if (r === 'sister' || r === 'brother' || r === 'sibling') {
      return 'bg-pink-100 text-pink-800';
    } else if (r === 'husband' || r === 'wife' || r === 'partner' || r === 'spouse') {
      return 'bg-rose-100 text-rose-800';
    } else if (r === 'friend' || r === 'bestfriend') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="glass-panel p-6 border border-white/60">
      
      {/* Widget Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Emergency Contacts</h2>
          <p className="text-xs text-slate-500">Your trusted circle who will receive SOS alerts</p>
        </div>
        <button
          onClick={onAddClick}
          className="p-2.5 rounded-xl bg-safety-purple-600 hover:bg-safety-purple-700 text-white font-semibold flex items-center justify-center space-x-1 transition shadow-sm"
          title="Add Contact"
        >
          <Plus className="h-4.5 w-4.5" />
          <span className="text-xs hidden sm:inline">Add Contact</span>
        </button>
      </div>

      {/* Contacts List Grid */}
      {contacts.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-150 rounded-2xl">
          <div className="inline-flex p-3 rounded-full bg-slate-50 text-slate-400 mb-3">
            <User className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No emergency contacts added yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            You must add at least one contact to send WhatsApp SOS alerts with your live location.
          </p>
          <button
            onClick={onAddClick}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-safety-purple-700 bg-safety-purple-50 hover:bg-safety-purple-100 transition"
          >
            Add First Contact
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className="flex justify-between items-center p-4 bg-white/70 hover:bg-white rounded-xl border border-slate-100 hover:shadow-md transition duration-200"
            >
              
              {/* Contact Info */}
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-safety-purple-500 to-safety-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-800 text-sm">{contact.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getRelationBadgeColor(contact.relationship)}`}>
                      {contact.relationship}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>+{contact.phoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-1">
                <button
                  onClick={() => onEditClick(contact)}
                  className="p-2 rounded-lg text-slate-400 hover:text-safety-purple-700 hover:bg-slate-50 transition"
                  title="Edit Contact"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteClick(contact.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Delete Contact"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
