import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import useAuth from '../../hooks/useAuth';
import { API_BASE_URL } from "../../config/api";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

const AdminContactsPage: React.FC = () => {
  const { session } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const updateContactStatus = async (contactId: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setContacts(contacts.map(contact =>
          contact.id === contactId ? { ...contact, status } : contact
        ));
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== contactId));
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-secondary-800">Contact Messages</h1>
          <div className="text-sm text-secondary-600">
            Total: {contacts.length}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="p-4 border-b border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-800">Messages</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="p-4 text-center text-secondary-500">
                  No contact messages yet
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 border-b border-secondary-100 cursor-pointer hover:bg-secondary-50 ${
                      selectedContact?.id === contact.id ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-secondary-800 truncate">{contact.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600 truncate">{contact.subject}</p>
                    <p className="text-xs text-secondary-400 mt-1">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-soft">
            {selectedContact ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-800">{selectedContact.name}</h2>
                    <p className="text-secondary-600">{selectedContact.email}</p>
                    <p className="text-sm text-secondary-500 mt-1">
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedContact.status}
                      onChange={(e) => updateContactStatus(selectedContact.id, e.target.value as 'unread' | 'read' | 'replied')}
                      className="px-3 py-1 text-sm border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                    <button
                      onClick={() => deleteContact(selectedContact.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-2">Subject</h3>
                  <p className="text-secondary-700">{selectedContact.subject}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-secondary-800 mb-2">Message</h3>
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <p className="text-secondary-700 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-secondary-500">
                <svg className="mx-auto h-12 w-12 text-secondary-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p>Select a contact message to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContactsPage;
