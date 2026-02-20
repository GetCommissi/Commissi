'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  ActionButton,
  Badge,
} from '@/components/design-system/page-container';
import { 
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  Briefcase,
  Edit2,
  Save,
  X,
  Calendar,
  CheckCircle2,
  Clock,
  PhoneCall,
  FileText,
  History,
  Trash2,
  AlertCircle,
  PhoneOff,
  Send,
  Plus,
  Calculator,
  Wifi,
  Smartphone,
  Tv,
  CheckIcon,
  ChevronRight
} from 'lucide-react';

interface Lead {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string;
  phoneHash: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  province: string | null;
  niche: string | null;
  currentProvider: string | null;
  status: string;
  source: string;
  consentPhone: boolean;
  doNotCall: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CallLog {
  id: string;
  result: string;
  notes: string | null;
  duration: number | null;
  calledAt: string;
}

const statusOptions = [
  { value: 'NEW', label: 'Nieuw', color: 'bg-blue-100 text-blue-700' },
  { value: 'CONTACTED', label: 'Gecontacteerd', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'QUOTED', label: 'Offerte', color: 'bg-purple-100 text-purple-700' },
  { value: 'SALE_MADE', label: 'Verkocht', color: 'bg-green-100 text-green-700' },
  { value: 'NOT_INTERESTED', label: 'Geen Interesse', color: 'bg-red-100 text-red-700' },
];

// Internet & Mobile options for calculator
const INTERNET_OPTIONS = [
  { key: 'START', name: 'Start Fiber', speed: '200 Mbps', price: 53 },
  { key: 'ZEN', name: 'Zen Fiber', speed: '500 Mbps', price: 62, popular: true },
  { key: 'GIGA', name: 'Giga Fiber', speed: '1000 Mbps', price: 72 },
];

const MOBILE_OPTIONS = [
  { key: 'CHILD', name: 'Child', data: '2 GB', price: 14, commission: 5 },
  { key: 'SMALL', name: 'Small', data: '12 GB', price: 15, commission: 15 },
  { key: 'MEDIUM', name: 'Medium', data: '70 GB', price: 23, commission: 40 },
  { key: 'LARGE', name: 'Large', data: '140 GB', price: 30, commission: 55 },
  { key: 'UNLIMITED', name: 'Unlimited', data: '∞', price: 40, commission: 65 },
];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Appointment form
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('PHYSICAL');
  const [appointmentLocation, setAppointmentLocation] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // Offer form
  const [selectedInternet, setSelectedInternet] = useState<string | null>(null);
  const [mobileLines, setMobileLines] = useState<Array<{plan: string; portability: boolean}>>([]);
  const [selectedTv, setSelectedTv] = useState('NONE');
  const [offerTotal, setOfferTotal] = useState(0);
  const [offerCommission, setOfferCommission] = useState(0);

  // Fetch lead data
  useEffect(() => {
    if (leadId) {
      fetchLead();
      fetchCallLogs();
    }
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      if (response.ok) {
        const data = await response.json();
        setLead(data);
        setEditedLead(data);
      } else if (response.status === 404) {
        router.push('/leads');
      }
    } catch (error) {
      console.error('Failed to fetch lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCallLogs = async () => {
    try {
      const response = await fetch(`/api/leads/${leadId}/calls`);
      if (response.ok) {
        const data = await response.json();
        setCallLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch call logs:', error);
    }
  };

  const handleSave = async () => {
    if (!editedLead) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: leadId,
          ...editedLead,
        }),
      });

      if (response.ok) {
        const updatedLead = await response.json();
        setLead(updatedLead);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          result: 'NOTE',
          notes: newNote,
          duration: 0,
        }),
      });

      if (response.ok) {
        setNewNote('');
        setAddingNote(false);
        fetchCallLogs();
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Weet je zeker dat je deze lead wilt verwijderen?')) return;
    
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/leads');
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  // Appointment handlers
  const handleScheduleAppointment = async () => {
    if (!appointmentDate || !appointmentTime) return;

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          clientName: lead?.contactName || lead?.companyName,
          company: lead?.companyName,
          date: appointmentDate,
          time: appointmentTime,
          type: appointmentType,
          location: appointmentLocation || (appointmentType === 'PHONE' ? 'Telefoongesprek' : 'Fysiek bezoek'),
          notes: appointmentNotes,
          status: 'SCHEDULED',
        }),
      });

      if (response.ok) {
        // Reset form
        setAppointmentDate('');
        setAppointmentTime('');
        setAppointmentType('PHYSICAL');
        setAppointmentLocation('');
        setAppointmentNotes('');
        setShowAppointmentModal(false);
        
        // Update lead status
        await fetch('/api/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: leadId,
            status: 'CONTACTED',
          }),
        });
        
        fetchLead();
        alert('Afspraak succesvol ingepland!');
        router.push('/appointments');
      }
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
    }
  };

  // Offer calculation
  useEffect(() => {
    let total = 0;
    let commission = 0;

    if (selectedInternet) {
      const internet = INTERNET_OPTIONS.find(i => i.key === selectedInternet);
      if (internet) {
        total += internet.price;
        commission += 20; // Base commission
      }
    }

    mobileLines.forEach((line, idx) => {
      const plan = MOBILE_OPTIONS.find(p => p.key === line.plan);
      if (plan) {
        total += plan.price;
        commission += plan.commission;
        if (idx === 0 && selectedInternet) {
          commission += 12; // Convergence bonus
        }
        if (line.portability && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan)) {
          commission += 20;
        }
      }
    });

    if (selectedTv !== 'NONE') {
      const tvPrice = selectedTv === 'LIFE' ? 10 : selectedTv === 'TV' ? 20 : 32;
      total += tvPrice;
      commission += 10;
    }

    setOfferTotal(total);
    setOfferCommission(commission);
  }, [selectedInternet, mobileLines, selectedTv]);

  const handleSendOffer = async () => {
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          clientName: lead?.contactName || lead?.companyName,
          company: lead?.companyName,
          email: lead?.email,
          phone: lead?.phone,
          internet: selectedInternet,
          mobileLines,
          tv: selectedTv,
          totalPrice: offerTotal,
          commission: offerCommission,
          status: 'PENDING',
        }),
      });

      if (response.ok) {
        // Reset form
        setSelectedInternet(null);
        setMobileLines([]);
        setSelectedTv('NONE');
        setShowOfferModal(false);

        // Update lead status
        await fetch('/api/leads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: leadId,
            status: 'QUOTED',
          }),
        });

        fetchLead();
        alert('Offerte succesvol verstuurd!');
        router.push('/offers');
      }
    } catch (error) {
      console.error('Failed to send offer:', error);
    }
  };

  const addMobileLine = () => {
    setMobileLines([...mobileLines, { plan: '', portability: false }]);
  };

  const removeMobileLine = (idx: number) => {
    setMobileLines(mobileLines.filter((_, i) => i !== idx));
  };

  const updateMobileLine = (idx: number, field: string, value: any) => {
    const updated = [...mobileLines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMobileLines(updated);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageContainer>
    );
  }

  if (!lead) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <p className="text-gray-500">Lead niet gevonden</p>
          <Link href="/leads" className="text-orange-600 hover:underline mt-2 inline-block">
            Terug naar leads
          </Link>
        </div>
      </PageContainer>
    );
  }

  const currentStatus = statusOptions.find(s => s.value === lead.status) || statusOptions[0];

  return (
    <PageContainer>
      <PageHeader
        title={lead.companyName}
        subtitle={`${lead.contactName || 'Geen contactpersoon'} • ${lead.city || 'Geen stad'}`}
        icon={<Building2 className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <Link
              href="/leads"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug
            </Link>
            <Link
              href={`/call-center?lead=${lead.id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:shadow-lg"
            >
              <PhoneCall className="w-4 h-4" />
              Bellen
            </Link>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lead Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info Card */}
            <SmartCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-500" />
                    Bedrijfsinformatie
                  </h2>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditedLead(lead);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <X className="w-4 h-4" />
                          Annuleren
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:shadow-lg disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {saving ? 'Opslaan...' : 'Opslaan'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100"
                      >
                        <Edit2 className="w-4 h-4" />
                        Bewerken
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrijfsnaam
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.companyName || ''}
                        onChange={(e) => setEditedLead({...editedLead, companyName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{lead.companyName}</p>
                    )}
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contactpersoon
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.contactName || ''}
                        onChange={(e) => setEditedLead({...editedLead, contactName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{lead.contactName || '-'}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefoonnummer
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.phone || ''}
                        onChange={(e) => setEditedLead({...editedLead, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <a href={`tel:${lead.phone}`} className="text-orange-600 hover:underline">
                        {lead.phone}
                      </a>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedLead.email || ''}
                        onChange={(e) => setEditedLead({...editedLead, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{lead.email || '-'}</p>
                    )}
                  </div>

                  {/* Niche */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Niche / Branche
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.niche || ''}
                        onChange={(e) => setEditedLead({...editedLead, niche: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{lead.niche || '-'}</p>
                    )}
                  </div>

                  {/* Current Provider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Huidige Provider
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.currentProvider || ''}
                        onChange={(e) => setEditedLead({...editedLead, currentProvider: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{lead.currentProvider || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
            </SmartCard>

            {/* Address Card */}
            <SmartCard>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Adres
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Straat + Huisnummer
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.address || ''}
                        onChange={(e) => setEditedLead({...editedLead, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{lead.address || '-'}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gemeente
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.city || ''}
                        onChange={(e) => setEditedLead({...editedLead, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{lead.city || '-'}</p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.postalCode || ''}
                        onChange={(e) => setEditedLead({...editedLead, postalCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{lead.postalCode || '-'}</p>
                    )}
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provincie
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedLead.province || ''}
                        onChange={(e) => setEditedLead({...editedLead, province: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900">{lead.province || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
            </SmartCard>

            {/* Notes Section */}
            <SmartCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Notities
                  </h2>
                  <button
                    onClick={() => setAddingNote(!addingNote)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100"
                  >
                    {addingNote ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    {addingNote ? 'Annuleren' : 'Notitie toevoegen'}
                  </button>
                </div>

                {addingNote && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Schrijf een notitie..."
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <button
                      onClick={handleAddNote}
                      className="mt-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:shadow-lg"
                    >
                      Notitie opslaan
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {callLogs.length === 0 ? (
                    <p className="text-gray-500 text-sm">Geen notities</p>
                  ) : (
                    callLogs.map((log) => (
                      <div key={log.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(log.calledAt).toLocaleDateString('nl-BE', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {log.duration && log.duration > 0 && (
                            <span className="text-xs text-gray-500">
                              {Math.floor(log.duration / 60)}:{(log.duration % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700">{log.notes}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SmartCard>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <SmartCard>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  Status
                </h2>

                {isEditing ? (
                  <select
                    value={editedLead.status || 'NEW'}
                    onChange={(e) => setEditedLead({...editedLead, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge className={currentStatus.color}>
                    {currentStatus.label}
                  </Badge>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Aangemaakt: {new Date(lead.createdAt).toLocaleDateString('nl-BE')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Laatst bijgewerkt: {new Date(lead.updatedAt).toLocaleDateString('nl-BE')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Bron: {lead.source || 'Onbekend'}
                  </p>
                </div>
              </div>
            </SmartCard>

            {/* Quick Actions */}
            <SmartCard>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Snelle Acties
                </h2>

                <div className="space-y-3">
                  <Link
                    href={`/call-center?lead=${lead.id}`}
                    className="flex items-center gap-3 w-full p-3 text-left bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <PhoneCall className="w-5 h-5" />
                    <span className="font-medium">Bellen</span>
                  </Link>

                  {/* Appointment Button - Opens Modal */}
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="flex items-center gap-3 w-full p-3 text-left bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Afspraak Inplannen</span>
                  </button>

                  {/* Send Offer Button - Opens Modal */}
                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="flex items-center gap-3 w-full p-3 text-left bg-orange-50 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    <span className="font-medium">Offerte Versturen</span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-3 w-full p-3 text-left bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="font-medium">Verwijderen</span>
                  </button>
                </div>
              </div>
            </SmartCard>

            {/* GDPR */}
            {lead.doNotCall && (
              <SmartCard className="border-rose-200 bg-rose-50">
                <div className="p-4">
                  <div className="flex items-center gap-2 text-rose-700">
                    <PhoneOff className="w-5 h-5" />
                    <span className="font-medium">DNCM - Niet Bellen</span>
                  </div>
                  <p className="text-sm text-rose-600 mt-1">
                    Deze lead heeft aangegeven niet gebeld te willen worden.
                  </p>
                </div>
              </SmartCard>
            )}
          </div>
        </div>
      </main>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAppointmentModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                Afspraak Inplannen
              </h3>
              <button onClick={() => setShowAppointmentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tijd</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PHYSICAL">Fysiek bezoek</option>
                  <option value="PHONE">Telefonisch</option>
                  <option value="VIDEO">Video call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locatie / Link</label>
                <input
                  type="text"
                  value={appointmentLocation}
                  onChange={(e) => setAppointmentLocation(e.target.value)}
                  placeholder={appointmentType === 'PHONE' ? 'Telefoongesprek' : 'Adres of Zoom link'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notities</label>
                <textarea
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  placeholder="Extra informatie over de afspraak..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Annuleren
              </button>
              <button
                onClick={handleScheduleAppointment}
                disabled={!appointmentDate || !appointmentTime}
                className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckIcon className="w-4 h-4" />
                Afspraak Bevestigen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowOfferModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Send className="w-6 h-6 text-orange-500" />
                Offerte Opstellen
              </h3>
              <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Internet Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Internet</label>
                <div className="grid grid-cols-3 gap-3">
                  {INTERNET_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedInternet(selectedInternet === option.key ? null : option.key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        selectedInternet === option.key
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{option.name}</p>
                      <p className="text-orange-600 font-bold">€{option.price}</p>
                      <p className="text-xs text-gray-500">{option.speed}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Lines */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Mobile Lines</label>
                  <button
                    onClick={addMobileLine}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100"
                  >
                    <Plus className="w-4 h-4" />
                    Toevoegen
                  </button>
                </div>
                
                <div className="space-y-3">
                  {mobileLines.length === 0 ? (
                    <p className="text-gray-400 text-sm">Geen mobile lines toegevoegd</p>
                  ) : (
                    mobileLines.map((line, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                        <select
                          value={line.plan}
                          onChange={(e) => updateMobileLine(idx, 'plan', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Kies plan</option>
                          {MOBILE_OPTIONS.map((plan) => (
                            <option key={plan.key} value={plan.key}>
                              {plan.name} - €{plan.price} (comm: €{plan.commission})
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={line.portability}
                            onChange={(e) => updateMobileLine(idx, 'portability', e.target.checked)}
                            className="w-4 h-4 text-orange-500"
                          />
                          Portability (+€20)
                        </label>
                        <button
                          onClick={() => removeMobileLine(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* TV Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TV (Optioneel)</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: 'NONE', name: 'Geen TV', price: 0 },
                    { key: 'LIFE', name: 'TV Life', price: 10 },
                    { key: 'TV', name: 'Orange TV', price: 20 },
                    { key: 'PLUS', name: 'TV Plus', price: 32 },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedTv(option.key)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedTv === option.key
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{option.name}</p>
                      {option.price > 0 && <p className="text-orange-600 font-bold">€{option.price}</p>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Totaal prijs voor klant:</span>
                  <span className="text-2xl font-bold text-gray-900">€{offerTotal}/maand</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Jouw commissie:</span>
                  <span className="text-xl font-bold text-orange-600">€{offerCommission}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Annuleren
              </button>
              <button
                onClick={handleSendOffer}
                disabled={!selectedInternet && mobileLines.length === 0}
                className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-xl hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Offerte Versturen
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
