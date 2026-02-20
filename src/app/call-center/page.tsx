'use client';

import { useState, useEffect } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneCall,
  PhoneOff,
  Clock,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  RotateCcw,
  User,
  Building2,
  MapPin,
  Mail,
  MoreHorizontal,
  ChevronRight,
  Mic,
  Pause,
  Play
} from 'lucide-react';

// Mock call queue
const callQueue = [
  { id: 1, company: 'Willems Group', contact: 'Sarah Willems', phone: '0428 25 24 75', city: 'Brussel', status: 'new', priority: 'high' },
  { id: 2, company: 'Tech Solutions', contact: 'Jan Janssen', phone: '0471 23 45 67', city: 'Antwerpen', status: 'callback', priority: 'medium' },
  { id: 3, company: 'Bakkerij De Lekkernij', contact: 'Maria Peeters', phone: '0478 90 12 34', city: 'Mechelen', status: 'new', priority: 'low' },
  { id: 4, company: 'Mertens NV', contact: 'Jan Mertens', phone: '0408 01 23 44', city: 'Gent', status: 'followup', priority: 'high' },
];

// Mock call history
const callHistory = [
  { id: 1, company: 'De Smet Group', result: 'No answer', duration: '0:00', time: '2 min ago' },
  { id: 2, company: 'Claes Solutions', result: 'Callback scheduled', duration: '5:23', time: '15 min ago' },
  { id: 3, company: 'Wouters NV', result: 'Not interested', duration: '2:45', time: '1 hour ago' },
];

// Call result options
const callResults = [
  { id: 'interested', label: 'Interested', icon: CheckCircle, color: 'green' },
  { id: 'not_interested', label: 'Not Interested', icon: XCircle, color: 'red' },
  { id: 'callback', label: 'Callback', icon: RotateCcw, color: 'orange' },
  { id: 'no_answer', label: 'No Answer', icon: PhoneOff, color: 'neutral' },
  { id: 'appointment', label: 'Appointment', icon: Calendar, color: 'purple' },
  { id: 'offer', label: 'Send Offer', icon: FileText, color: 'blue' },
];

export default function CallCenterPage() {
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedLead, setSelectedLead] = useState(callQueue[0]);
  const [callResult, setCallResult] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalling) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setIsCalling(true);
    setCallDuration(0);
    setCallResult(null);
  };

  const handleEndCall = () => {
    setIsCalling(false);
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Call Center Active</span>
        </div>
        <h1 className="h1">Call Center</h1>
        <p className="body-md text-text-secondary mt-1">Manage your calls and track conversations</p>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Queue & History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Call Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Call Queue</CardTitle>
              <Badge variant="orange" dot>{callQueue.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {callQueue.map((lead) => (
                  <div 
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedLead.id === lead.id 
                        ? 'bg-accent-glow border border-accent/30' 
                        : 'bg-bg-elevated hover:bg-bg-overlay'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-text-primary">{lead.company}</p>
                        <p className="text-sm text-text-secondary">{lead.contact}</p>
                      </div>
                      <Badge 
                        variant={
                          lead.priority === 'high' ? 'red' :
                          lead.priority === 'medium' ? 'orange' :
                          'neutral'
                        }
                      >
                        {lead.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {lead.city}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <span className="text-xs text-text-muted">Today</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {callHistory.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl">
                    <div>
                      <p className="font-medium text-text-primary">{call.company}</p>
                      <p className="text-xs text-text-muted">{call.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-secondary">{call.duration}</p>
                      <p className={`text-xs ${
                        call.result === 'Not interested' ? 'text-danger' :
                        call.result === 'Callback scheduled' ? 'text-warning' :
                        'text-text-muted'
                      }`}>{call.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Active Call */}
        <div className="lg:col-span-8">
          <Card className="h-full">
            {/* Call Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-accent-glow rounded-2xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h2 className="h3">{selectedLead.company}</h2>
                  <p className="text-text-secondary">{selectedLead.contact}</p>
                </div>
              </div>
              
              {/* Call Timer */}
              {isCalling && (
                <div className="flex items-center gap-3 px-4 py-2 bg-success-bg rounded-full">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-mono font-semibold text-success">{formatDuration(callDuration)}</span>
                </div>
              )}
            </div>

            {/* Lead Details */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border">
              <div className="p-4 bg-bg-elevated rounded-xl">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Phone</span>
                </div>
                <p className="font-medium text-text-primary">{selectedLead.phone}</p>
              </div>
              <div className="p-4 bg-bg-elevated rounded-xl">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">City</span>
                </div>
                <p className="font-medium text-text-primary">{selectedLead.city}</p>
              </div>
              <div className="p-4 bg-bg-elevated rounded-xl">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Email</span>
                </div>
                <p className="font-medium text-text-primary">contact@{selectedLead.company.toLowerCase().replace(/\s/g, '')}.be</p>
              </div>
              <div className="p-4 bg-bg-elevated rounded-xl">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Last Contact</span>
                </div>
                <p className="font-medium text-text-primary">3 days ago</p>
              </div>
            </div>

            {/* Call Actions */}
            <div className="p-6">
              {!isCalling ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-6">
                    <PhoneCall className="w-10 h-10 text-success" />
                  </div>
                  <h3 className="h3 mb-2">Ready to call?</h3>
                  <p className="text-text-secondary mb-6">Start calling {selectedLead.contact} at {selectedLead.company}</p>
                  <Button size="lg" onClick={handleStartCall}>
                    <Phone className="w-5 h-5 mr-2" />
                    Start Call
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* In-Call Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button className="w-14 h-14 bg-bg-elevated rounded-full flex items-center justify-center hover:bg-bg-overlay transition-colors">
                      <Mic className="w-6 h-6 text-text-secondary" />
                    </button>
                    <button className="w-14 h-14 bg-bg-elevated rounded-full flex items-center justify-center hover:bg-bg-overlay transition-colors">
                      <Pause className="w-6 h-6 text-text-secondary" />
                    </button>
                    <button 
                      onClick={handleEndCall}
                      className="w-16 h-16 bg-danger rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg"
                    >
                      <PhoneOff className="w-7 h-7 text-white" />
                    </button>
                  </div>

                  {/* Call Results */}
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-3">Call Result</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {callResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => setCallResult(result.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            callResult === result.id
                              ? 'border-accent bg-accent-glow'
                              : 'border-border bg-bg-elevated hover:border-border-strong'
                          }`}
                        >
                          <result.icon className={`w-6 h-6 mb-2 ${
                            result.color === 'green' ? 'text-success' :
                            result.color === 'red' ? 'text-danger' :
                            result.color === 'orange' ? 'text-warning' :
                            result.color === 'purple' ? 'text-purple' :
                            result.color === 'blue' ? 'text-blue' :
                            'text-text-muted'
                          }`} />
                          <p className="font-medium text-text-primary">{result.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-sm font-medium text-text-secondary mb-3">Call Notes</p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about the conversation..."
                      className="w-full h-32 p-4 bg-bg-elevated border border-border rounded-xl text-text-primary placeholder:text-text-muted resize-none focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Save Action */}
                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1">
                      Save & Next
                    </Button>
                    <Button className="flex-1">
                      Save & Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PremiumLayout>
  );
}
