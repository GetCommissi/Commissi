'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  Download,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Building2,
  ChevronDown,
  ArrowUpDown,
  Edit,
  Trash2,
  FileText,
  PhoneCall,
  Grid3X3,
  List
} from 'lucide-react';

// Mock leads data
const leadsData = [
  { id: 1, company: 'De Smet Group', contact: 'Luc De Smet', email: 'luc@desmet.be', phone: '0408 09 79 01', city: 'Kortrijk', status: 'offer_sent', lastContact: '1 week ago', value: '€2,450' },
  { id: 2, company: 'Claes Solutions', contact: 'Anna Claes', email: 'anna@claes.be', phone: '0499 91 12 07', city: 'Kortrijk', status: 'new', lastContact: '2+ weeks ago', value: '€1,890' },
  { id: 3, company: 'Wouters NV', contact: 'Peter Wouters', email: 'peter@wouters.be', phone: '0426 50 79 88', city: 'Hasselt', status: 'new', lastContact: '1 week ago', value: '€3,200' },
  { id: 4, company: 'Willems Group', contact: 'Sarah Willems', email: 'sarah@willems.be', phone: '0428 25 24 75', city: 'Brussel', status: 'contacted', lastContact: '1 week ago', value: '€2,100' },
  { id: 5, company: 'Willems BV', contact: 'Anna Willems', email: 'anna@willemsbv.be', phone: '0437 11 90 01', city: 'Antwerpen', status: 'followup', lastContact: '2+ weeks ago', value: '€1,750' },
  { id: 6, company: 'Wouters Group', contact: 'Jan Wouters', email: 'jan@wouters.be', phone: '0408 85 41 05', city: 'Hasselt', status: 'offer_sent', lastContact: '2+ weeks ago', value: '€2,800' },
  { id: 7, company: 'Mertens NV', contact: 'Jan Mertens', email: 'jan@mertens.be', phone: '0408 01 23 44', city: 'Gent', status: 'new', lastContact: '2+ weeks ago', value: '€3,500' },
  { id: 8, company: 'Claes BV', contact: 'Anna Claes', email: 'anna@claesbv.be', phone: '0435 92 77 83', city: 'Brussel', status: 'new', lastContact: '2+ weeks ago', value: '€1,950' },
];

// Stats
const stats = [
  { label: 'Total', value: 156, color: 'neutral' },
  { label: 'New', value: 55, color: 'blue' },
  { label: 'Contacted', value: 37, color: 'orange' },
  { label: 'Offer Sent', value: 22, color: 'purple' },
  { label: 'Converted', value: 14, color: 'green' },
];

const statusStyles: Record<string, { label: string; variant: 'blue' | 'orange' | 'purple' | 'green' | 'neutral' }> = {
  new: { label: 'New', variant: 'blue' },
  contacted: { label: 'Contacted', variant: 'orange' },
  offer_sent: { label: 'Offer Sent', variant: 'purple' },
  followup: { label: 'Follow-up', variant: 'orange' },
  converted: { label: 'Converted', variant: 'green' },
};

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  const toggleLeadSelection = (id: number) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedLeads.length === leadsData.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leadsData.map(l => l.id));
    }
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="h1">Leads</h1>
            <p className="body-md text-text-secondary mt-1">Manage and track all your leads ({leadsData.length} total)</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/leads/import">
              <Button variant="secondary">
                <Download className="w-4 h-4 mr-2" />
                Import
              </Button>
            </Link>
            <Link href="/leads/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Lead
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${
              stat.color === 'blue' ? 'text-blue' :
              stat.color === 'orange' ? 'text-warning' :
              stat.color === 'purple' ? 'text-purple' :
              stat.color === 'green' ? 'text-success' :
              'text-text-primary'
            }`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search by company, contact, city or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <select className="px-3 py-2.5 bg-bg-elevated border border-border rounded-lg text-text-primary text-sm focus:border-accent focus:outline-none">
                <option>All Status</option>
                <option>New</option>
                <option>Contacted</option>
                <option>Offer Sent</option>
                <option>Converted</option>
              </select>
              
              {/* View Toggle */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-bg-elevated text-accent' : 'text-text-muted hover:text-text-primary'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-bg-elevated text-accent' : 'text-text-muted hover:text-text-primary'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedLeads.length > 0 && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-text-secondary">{selectedLeads.length} selected</span>
              <Button variant="secondary" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="secondary" size="sm">
                <PhoneCall className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button variant="danger" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads List/Grid */}
      {viewMode === 'list' ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left">
                    <input 
                      type="checkbox" 
                      checked={selectedLeads.length === leadsData.length}
                      onChange={selectAll}
                      className="w-4 h-4 rounded border-border bg-bg-elevated text-accent focus:ring-accent"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-text-primary">
                      Company & Contact
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {leadsData.map((lead) => (
                  <tr key={lead.id} className="border-b border-border hover:bg-bg-elevated/50 transition-colors">
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLeadSelection(lead.id)}
                        className="w-4 h-4 rounded border-border bg-bg-elevated text-accent focus:ring-accent"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center text-accent font-semibold">
                          {lead.company[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{lead.company}</p>
                          <p className="text-sm text-text-muted">{lead.contact} • {lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusStyles[lead.status]?.variant || 'neutral'}>
                        {statusStyles[lead.status]?.label || lead.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-text-secondary">
                        <MapPin className="w-4 h-4" />
                        {lead.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-text-primary">{lead.value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-text-muted">{lead.lastContact}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`tel:${lead.phone}`}>
                          <button className="p-2 hover:bg-bg-elevated rounded-lg transition-colors">
                            <Phone className="w-4 h-4 text-text-secondary" />
                          </button>
                        </Link>
                        <Link href={`/leads/${lead.id}`}>
                          <button className="p-2 hover:bg-bg-elevated rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-text-secondary" />
                          </button>
                        </Link>
                        <button className="p-2 hover:bg-bg-elevated rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-text-secondary" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {leadsData.map((lead) => (
            <Card key={lead.id} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-accent-glow rounded-xl flex items-center justify-center text-accent font-bold text-lg">
                  {lead.company[0]}
                </div>
                <input 
                  type="checkbox" 
                  checked={selectedLeads.includes(lead.id)}
                  onChange={() => toggleLeadSelection(lead.id)}
                  className="w-4 h-4 rounded border-border bg-bg-elevated text-accent focus:ring-accent"
                />
              </div>
              
              <h3 className="font-semibold text-text-primary mb-1">{lead.company}</h3>
              <p className="text-sm text-text-secondary mb-4">{lead.contact}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Phone className="w-4 h-4" />
                  {lead.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin className="w-4 h-4" />
                  {lead.city}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Badge variant={statusStyles[lead.status]?.variant || 'neutral'}>
                  {statusStyles[lead.status]?.label || lead.status}
                </Badge>
                <span className="font-semibold text-text-primary">{lead.value}</span>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Link href={`tel:${lead.phone}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </Link>
                <Link href={`/leads/${lead.id}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PremiumLayout>
  );
}
