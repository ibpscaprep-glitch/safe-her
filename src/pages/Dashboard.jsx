import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  db,
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from '../firebase';
import ContactList from '../components/ContactList';
import ContactModal from '../components/ContactModal';
import SOSButton from '../components/SOSButton';
import ActivityHistory from '../components/ActivityHistory';
import { Shield, Sparkles } from 'lucide-react';
import EmergencyHelplines from '../components/EmergencyHelplines';
import NearbyServices from '../components/NearbyServices';

export default function Dashboard() {
  const { userProfile, currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch all emergency contacts
  async function fetchContacts() {
    if (!currentUser) return;
    try {
      setLoadingContacts(true);
      const querySnapshot = await getDocs(collection(db, 'users', currentUser.uid, 'contacts'));
      const contactData = [];
      querySnapshot.forEach((doc) => {
        contactData.push({ id: doc.id, ...doc.data() });
      });
      // Sort alphabetically
      contactData.sort((a, b) => a.name.localeCompare(b.name));
      setContacts(contactData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoadingContacts(false);
    }
  }

  // Fetch recent SOS activities
  async function fetchActivities() {
    if (!currentUser) return;
    try {
      setLoadingActivities(true);
      const querySnapshot = await getDocs(collection(db, 'users', currentUser.uid, 'sos_activities'));
      const activityData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let dateVal = new Date();
        if (data.timestamp?.toDate) {
          dateVal = data.timestamp.toDate();
        } else if (data.createdAt) {
          dateVal = new Date(data.createdAt);
        } else if (data.dateTimeString) {
          dateVal = new Date(data.dateTimeString);
        }
        activityData.push({ 
          id: doc.id, 
          ...data,
          parsedDate: dateVal
        });
      });
      // Sort in-memory to prevent complex composite index errors in Firestore
      activityData.sort((a, b) => b.parsedDate - a.parsedDate);
      setActivities(activityData.slice(0, 10)); // Keep top 10 logs
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  }

  useEffect(() => {
    fetchContacts();
    fetchActivities();
  }, [currentUser]);

  // Open Modal to Add Contact
  function handleAddClick() {
    setSelectedContact(null);
    setIsModalOpen(true);
  }

  // Open Modal to Edit Contact
  function handleEditClick(contact) {
    setSelectedContact(contact);
    setIsModalOpen(true);
  }

  // Save Contact (Create or Update)
  async function handleSaveContact(contactData) {
    if (!currentUser) {
      throw new Error("User is not authenticated.");
    }
    try {
      if (selectedContact) {
        // Edit Operation
        const contactRef = doc(db, 'users', currentUser.uid, 'contacts', selectedContact.id);
        await updateDoc(contactRef, contactData);
      } else {
        // Create Operation
        const contactsRef = collection(db, 'users', currentUser.uid, 'contacts');
        await addDoc(contactsRef, {
          ...contactData,
          createdAt: new Date().toISOString()
        });
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch (error) {
      console.error("Error saving contact:", error);
      throw error;
    }
  }

  // Delete Contact
  async function handleDeleteContact(contactId) {
    if (!currentUser) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmDelete) return;

    try {
      const contactRef = doc(db, 'users', currentUser.uid, 'contacts', contactId);
      await deleteDoc(contactRef);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  }

  // Handle SOS Button Geolocation Trigger
  async function handleSOSTriggered(latitude, longitude, mapsLink) {
    if (!currentUser) return;
    try {
      const timestampVal = new Date();
      const dateTimeString = timestampVal.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const activitiesRef = collection(db, 'users', currentUser.uid, 'sos_activities');
      await addDoc(activitiesRef, {
        latitude,
        longitude,
        mapsLink,
        timestamp: serverTimestamp(),
        createdAt: timestampVal.toISOString(),
        dateTimeString
      });

      // Reload activities history log
      fetchActivities();
    } catch (error) {
      console.error("Error logging SOS event in Firestore:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-safety-purple-800 to-safety-pink-600 rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl -translate-y-5 translate-x-5"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="p-3 bg-white/10 rounded-2xl hidden sm:block">
            <Shield className="h-8 w-8 text-pink-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-pink-200 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SafeHer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Welcome back, {userProfile?.name || currentUser?.displayName || 'User'}!
            </h1>
            <p className="text-sm text-purple-100 mt-1">
              All systems are active. Press the SOS button for instant emergency dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: SOS Trigger Widget */}
        <div className="lg:col-span-1 space-y-8">
          <SOSButton 
            contacts={contacts} 
            onSOSTriggered={handleSOSTriggered} 
          />
          <EmergencyHelplines />
          <NearbyServices />
        </div>

        {/* Right Side: Contacts list and SOS Logs history list */}
        <div className="lg:col-span-2 space-y-8">
          
          <ContactList 
            contacts={contacts} 
            onAddClick={handleAddClick} 
            onEditClick={handleEditClick} 
            onDeleteClick={handleDeleteContact} 
          />
          
          <ActivityHistory 
            activities={activities} 
            loading={loadingActivities} 
          />

        </div>

      </div>

      {/* Contact Form Overlay Modal */}
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveContact} 
        contact={selectedContact} 
      />

    </div>
  );
}
