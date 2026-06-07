import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, getDocs } from '../firebase';
import { User, Mail, Calendar, Shield, Phone, History, AlertTriangle } from 'lucide-react';

export default function Profile() {
  const { userProfile, currentUser } = useAuth();
  const [contactsCount, setContactsCount] = useState(0);
  const [sosCount, setSosCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchStats() {
      try {
        setLoadingStats(true);
        // Fetch contacts count
        const contactsRef = collection(db, 'users', currentUser.uid, 'contacts');
        const contactsSnap = await getDocs(contactsRef);
        setContactsCount(contactsSnap.size);

        // Fetch SOS alerts count
        const sosRef = collection(db, 'users', currentUser.uid, 'sos_activities');
        const sosSnap = await getDocs(sosRef);
        setSosCount(sosSnap.size);
      } catch (error) {
        console.error("Error loading profile stats:", error);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStats();
  }, [currentUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-safety-purple-100 text-safety-purple-700">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Profile</h1>
          <p className="text-sm text-slate-500">View and review your safety portal credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Stats cards */}
        <div className="md:col-span-1 space-y-4">
          
          {/* Total Contacts Stat */}
          <div className="glass-panel p-6 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Contacts</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loadingStats ? '...' : contactsCount}
              </h3>
            </div>
          </div>

          {/* SOS Alerts Stat */}
          <div className="glass-panel p-6 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">SOS Triggers</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {loadingStats ? '...' : sosCount}
              </h3>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="glass-panel p-5 bg-gradient-to-tr from-safety-purple-700 to-safety-pink-500 text-white">
            <div className="flex items-center space-x-2.5 mb-2">
              <Shield className="h-5 w-5 fill-white/20" />
              <h4 className="font-bold text-sm">Protected Account</h4>
            </div>
            <p className="text-xs text-purple-100 leading-relaxed">
              SafeHer is secure. Your identity is certified, and location coordinates are protected under your profile permissions.
            </p>
          </div>

        </div>

        {/* Right Side: Account Credentials Details */}
        <div className="md:col-span-2">
          <div className="glass-panel p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Account Registration Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Name Display */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Full Name</span>
                </span>
                <p className="text-base font-semibold text-slate-800">
                  {userProfile?.name || currentUser?.displayName || 'N/A'}
                </p>
              </div>

              {/* Email Display */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email Address</span>
                </span>
                <p className="text-base font-semibold text-slate-800">
                  {userProfile?.email || currentUser?.email || 'N/A'}
                </p>
              </div>

              {/* Account Created At */}
              <div className="space-y-1 sm:col-span-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Registered On</span>
                </span>
                <p className="text-base font-semibold text-slate-800">
                  {formatDate(userProfile?.createdAt)}
                </p>
              </div>

              {/* Unique UID Identifier */}
              <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-50">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  User ID Reference
                </span>
                <p className="text-xs font-mono bg-slate-50 text-slate-500 p-2.5 rounded-lg border border-slate-100 select-all break-all">
                  {currentUser?.uid}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
