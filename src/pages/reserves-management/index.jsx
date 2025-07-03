import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MainNavigation from '../../components/ui/MainNavigation';
import Icon from '../../components/AppIcon';
import AddReserveModal from './components/AddReserveModal';
import EditReserveModal from './components/EditReserveModal';
import ReserveProjectCard from './components/ReserveProjectCard';

const ReservesManagement = () => {
  const [reserves, setReserves] = useState([]);
  const [filteredReserves, setFilteredReserves] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReserve, setEditingReserve] = useState(null);
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for reserves
  const mockReserves = [
    {
      id: 1,
      projectName: "Office Renovation Phase 1",
      items: [
        {
          id: 1,
          article: "PNL-001",
          productName: "Acoustic Panel Standard",
          reservedQuantity: 25,
          comments: "For conference room installation"
        },
        {
          id: 2,
          article: "DIV-003",
          productName: "Glass Partition System",
          reservedQuantity: 8,
          comments: "Executive office dividers"
        }
      ],
      reservationDate: "2024-01-15",
      status: "Active",
      totalItems: 2,
      totalQuantity: 33,
      createdBy: "John Smith",
      createdAt: "2024-01-10T10:30:00Z"
    },
    {
      id: 2,
      projectName: "Warehouse Expansion",
      items: [
        {
          id: 3,
          article: "ACC-005",
          productName: "Heavy Duty Brackets",
          reservedQuantity: 50,
          comments: "For new shelving units"
        },
        {
          id: 4,
          article: "PNL-002",
          productName: "Fire Resistant Panel",
          reservedQuantity: 15,
          comments: "Safety compliance requirement"
        },
        {
          id: 5,
          article: "DIV-001",
          productName: "Modular Room Divider",
          reservedQuantity: 12,
          comments: "Temporary workspace separation"
        }
      ],
      reservationDate: "2024-01-20",
      status: "Active",
      totalItems: 3,
      totalQuantity: 77,
      createdBy: "Sarah Johnson",
      createdAt: "2024-01-12T14:15:00Z"
    },
    {
      id: 3,
      projectName: "Client Demo Setup",
      items: [
        {
          id: 6,
          article: "ACC-001",
          productName: "Standard Mounting Kit",
          reservedQuantity: 10,
          comments: "Demo installation materials"
        }
      ],
      reservationDate: "2024-01-08",
      status: "Cancelled",
      totalItems: 1,
      totalQuantity: 10,
      createdBy: "Mike Wilson",
      createdAt: "2024-01-05T09:20:00Z"
    },
    {
      id: 4,
      projectName: "Factory Floor Upgrade",
      items: [
        {
          id: 7,
          article: "PNL-004",
          productName: "Industrial Sound Barrier",
          reservedQuantity: 30,
          comments: "Noise reduction project"
        },
        {
          id: 8,
          article: "ACC-003",
          productName: "Vibration Dampener",
          reservedQuantity: 20,
          comments: "Equipment isolation"
        }
      ],
      reservationDate: "2024-02-01",
      status: "Active",
      totalItems: 2,
      totalQuantity: 50,
      createdBy: "Lisa Chen",
      createdAt: "2024-01-18T11:45:00Z"
    }
  ];

  useEffect(() => {
    setReserves(mockReserves);
  }, []);

  useEffect(() => {
    let filtered = reserves;

    // Filter by project
    if (projectFilter !== 'all') {
      filtered = filtered.filter(reserve => reserve.projectName === projectFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reserve => reserve.status.toLowerCase() === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reserve => 
        reserve.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserve.items.some(item => 
          item.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredReserves(filtered);
  }, [reserves, projectFilter, statusFilter, searchTerm]);

  const handleAddReserve = (newReserve) => {
    const reserve = {
      id: Date.now(),
      ...newReserve,
      createdBy: "Current User",
      createdAt: new Date().toISOString()
    };
    setReserves(prev => [...prev, reserve]);
    setIsAddModalOpen(false);
  };

  const handleEditReserve = (updatedReserve) => {
    setReserves(prev => prev.map(reserve => 
      reserve.id === updatedReserve.id ? updatedReserve : reserve
    ));
    setEditingReserve(null);
  };

  const handleDeleteReserve = (reserveId) => {
    if (window.confirm('Are you sure you want to delete this reserve? This action cannot be undone.')) {
      setReserves(prev => prev.filter(reserve => reserve.id !== reserveId));
    }
  };

  const handleStatusChange = (reserveId, newStatus) => {
    setReserves(prev => prev.map(reserve => 
      reserve.id === reserveId ? { ...reserve, status: newStatus } : reserve
    ));
  };

  const getUniqueProjects = () => {
    return [...new Set(reserves.map(reserve => reserve.projectName))];
  };

  const getStatusCounts = () => {
    const active = reserves.filter(r => r.status === 'Active').length;
    const cancelled = reserves.filter(r => r.status === 'Cancelled').length;
    return { active, cancelled, total: reserves.length };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MainNavigation />
      
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  Reserves Management
                </h1>
                <p className="text-text-secondary font-body mt-2">
                  Manage project-based material reservations and track allocated inventory
                </p>
              </div>
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center space-x-2 font-body min-h-touch"
              >
                <Icon name="Plus" size={20} strokeWidth={2} />
                <span>Add New Reserve</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface rounded-lg shadow-card p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-body">Total Reserves</p>
                  <p className="text-2xl font-bold text-text-primary font-heading">
                    {statusCounts.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name="Package" size={24} color="#2563EB" strokeWidth={2} />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-card p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-body">Active Reserves</p>
                  <p className="text-2xl font-bold text-success font-heading">
                    {statusCounts.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} color="#059669" strokeWidth={2} />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-card p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-body">Cancelled</p>
                  <p className="text-2xl font-bold text-text-secondary font-heading">
                    {statusCounts.cancelled}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Icon name="XCircle" size={24} color="#64748B" strokeWidth={2} />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg shadow-card p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-body">Total Items</p>
                  <p className="text-2xl font-bold text-accent font-heading">
                    {reserves.reduce((sum, reserve) => sum + reserve.totalQuantity, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Icon name="Layers" size={24} color="#0EA5E9" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-surface rounded-lg shadow-card border border-border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  placeholder="Search projects or items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch"
                />
              </div>

              {/* Project Filter */}
              <div>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch"
                >
                  <option value="all">All Projects</option>
                  {getUniqueProjects().map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body min-h-touch"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div>
                <button
                  onClick={() => {
                    setProjectFilter('all');
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-3 border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body min-h-touch"
                >
                  <Icon name="X" size={16} className="inline mr-2" strokeWidth={2} />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Reserves List */}
          <div className="space-y-6">
            {filteredReserves.length === 0 ? (
              <div className="bg-surface rounded-lg shadow-card border border-border p-12 text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Package" size={32} color="#64748B" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2 font-heading">
                  No Reserves Found
                </h3>
                <p className="text-text-secondary font-body mb-6">
                  {reserves.length === 0 
                    ? "Get started by creating your first material reserve." :"Try adjusting your filters to see more results."
                  }
                </p>
                {reserves.length === 0 && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body"
                  >
                    <Icon name="Plus" size={20} className="inline mr-2" strokeWidth={2} />
                    Add First Reserve
                  </button>
                )}
              </div>
            ) : (
              filteredReserves.map(reserve => (
                <ReserveProjectCard
                  key={reserve.id}
                  reserve={reserve}
                  onEdit={setEditingReserve}
                  onDelete={handleDeleteReserve}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {isAddModalOpen && (
        <AddReserveModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddReserve}
        />
      )}

      {editingReserve && (
        <EditReserveModal
          isOpen={!!editingReserve}
          reserve={editingReserve}
          onClose={() => setEditingReserve(null)}
          onSave={handleEditReserve}
        />
      )}
    </div>
  );
};

export default ReservesManagement;