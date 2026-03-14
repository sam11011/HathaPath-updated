import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Settings,
  Calendar,
  MessageSquare,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit,
  Menu,
  Download,
  Upload,
  FileText,
  Check,
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [brochureInfo, setBrochureInfo] = useState(null);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);

  // Workshop form states
  const [workshopDialogOpen, setWorkshopDialogOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    dates: '',
    image: '',
    is_active: true,
    order: 0,
  });

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchAllData();
  }, [token, navigate]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, settingsRes, workshopsRes, contactsRes, downloadsRes, brochureRes] = await Promise.all([
        axios.get(`${API}/analytics`, { headers }),
        axios.get(`${API}/settings`),
        axios.get(`${API}/workshops/all`, { headers }),
        axios.get(`${API}/contact/submissions`, { headers }),
        axios.get(`${API}/brochure/downloads`, { headers }),
        axios.get(`${API}/brochure/info`),
      ]);
      setAnalytics(analyticsRes.data);
      setSettings(settingsRes.data);
      setWorkshops(workshopsRes.data);
      setContacts(contactsRes.data);
      setDownloads(downloadsRes.data);
      setBrochureInfo(brochureRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin');
  };

  const handleUpdateSettings = async () => {
    try {
      await axios.put(`${API}/settings`, settings, { headers });
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleCreateWorkshop = async () => {
    try {
      await axios.post(`${API}/workshops`, newWorkshop, { headers });
      toast.success('Workshop created successfully!');
      setWorkshopDialogOpen(false);
      setNewWorkshop({ title: '', dates: '', image: '', is_active: true, order: 0 });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to create workshop');
    }
  };

  const handleUpdateWorkshop = async () => {
    try {
      await axios.put(`${API}/workshops/${editingWorkshop.id}`, editingWorkshop, { headers });
      toast.success('Workshop updated successfully!');
      setEditingWorkshop(null);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update workshop');
    }
  };

  const handleDeleteWorkshop = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;
    try {
      await axios.delete(`${API}/workshops/${id}`, { headers });
      toast.success('Workshop deleted successfully!');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete workshop');
    }
  };

  const handleBrochureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploadingBrochure(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API}/brochure/upload`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Brochure uploaded successfully!');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to upload brochure');
    }
    setUploadingBrochure(false);
  };

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'workshops', label: 'Workshops', icon: Calendar },
    { id: 'brochure', label: 'Brochure', icon: FileText },
    { id: 'contacts', label: 'Messages', icon: MessageSquare },
    { id: 'downloads', label: 'Downloads', icon: Download },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center">
        <div className="text-charcoal">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100" data-testid="admin-dashboard">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-sand-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} data-testid="mobile-menu-toggle">
          <Menu className="w-6 h-6 text-charcoal" />
        </button>
        <span className="font-display text-lg text-charcoal">Admin</span>
        <button onClick={handleLogout}>
          <LogOut className="w-5 h-5 text-charcoal/60" />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`admin-sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          data-testid="admin-sidebar"
        >
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 bg-sage-500 rounded-full"></div>
              <span className="font-display text-xl text-white">Hatha Path</span>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white transition-colors"
              data-testid="logout-btn"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div data-testid="analytics-tab">
              <h1 className="font-display text-3xl text-charcoal mb-8">Analytics Dashboard</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stats-card rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sage-500/20 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-display text-charcoal">{analytics.total_visits}</p>
                      <p className="text-sm text-charcoal/60">Total Visits</p>
                    </div>
                  </div>
                </div>

                <div className="stats-card rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-terracotta-500/20 rounded-full flex items-center justify-center">
                      <Download className="w-6 h-6 text-terracotta-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-display text-charcoal">{analytics.total_downloads}</p>
                      <p className="text-sm text-charcoal/60">Brochure Downloads</p>
                    </div>
                  </div>
                </div>

                <div className="stats-card rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-display text-charcoal">{analytics.total_contacts}</p>
                      <p className="text-sm text-charcoal/60">Contact Messages</p>
                    </div>
                  </div>
                </div>

                <div className="stats-card rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-display text-charcoal">{analytics.visits_today}</p>
                      <p className="text-sm text-charcoal/60">Visits Today</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Trends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="admin-card p-6">
                  <h3 className="font-display text-xl text-charcoal mb-4">Visit Trends</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal/70">This Week</span>
                      <span className="font-medium text-charcoal">{analytics.visits_this_week} visits</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal/70">This Month</span>
                      <span className="font-medium text-charcoal">{analytics.visits_this_month} visits</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal/70">All Time</span>
                      <span className="font-medium text-charcoal">{analytics.total_visits} visits</span>
                    </div>
                  </div>
                </div>

                <div className="admin-card p-6">
                  <h3 className="font-display text-xl text-charcoal mb-4">SEO & Reach</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal/70">Conversion Rate</span>
                      <span className="font-medium text-charcoal">
                        {analytics.total_visits > 0 
                          ? ((analytics.total_downloads / analytics.total_visits) * 100).toFixed(1) 
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-charcoal/70">Contact Rate</span>
                      <span className="font-medium text-charcoal">
                        {analytics.total_visits > 0 
                          ? ((analytics.total_contacts / analytics.total_visits) * 100).toFixed(1) 
                          : 0}%
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/50 mt-4">
                      Tip: Share your site on social media and optimize content for search engines to increase reach.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && settings && (
            <div data-testid="settings-tab">
              <h1 className="font-display text-3xl text-charcoal mb-8">Site Settings</h1>
              <div className="admin-card p-6 max-w-2xl">
                <h2 className="font-display text-xl text-charcoal mb-6">Contact Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-charcoal/70 mb-2">WhatsApp Number</label>
                    <Input
                      value={settings.whatsapp || ''}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="bg-sand-50 border-sand-200 focus:border-terracotta-500"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal/70 mb-2">Instagram Handle</label>
                    <Input
                      value={settings.instagram || ''}
                      onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                      className="bg-sand-50 border-sand-200 focus:border-terracotta-500"
                      placeholder="hatha_path"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal/70 mb-2">Email</label>
                    <Input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="bg-sand-50 border-sand-200 focus:border-terracotta-500"
                      placeholder="contact@hathapath.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal/70 mb-2">Location</label>
                    <Input
                      value={settings.location || ''}
                      onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                      className="bg-sand-50 border-sand-200 focus:border-terracotta-500"
                      placeholder="Pune, Maharashtra, India"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateSettings}
                    className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-6"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Workshops Tab */}
          {activeTab === 'workshops' && (
            <div data-testid="workshops-tab">
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl text-charcoal">Workshops</h1>
                <Button
                  onClick={() => setWorkshopDialogOpen(true)}
                  className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Workshop
                </Button>
              </div>

              <div className="admin-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workshops.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-charcoal/50">
                          No workshops yet. Add your first workshop!
                        </TableCell>
                      </TableRow>
                    ) : (
                      workshops.map((workshop) => (
                        <TableRow key={workshop.id} className="table-row-hover">
                          <TableCell className="font-medium">{workshop.title}</TableCell>
                          <TableCell>{workshop.dates}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              workshop.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {workshop.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => setEditingWorkshop(workshop)}
                              className="p-2 text-charcoal/60 hover:text-terracotta-500 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWorkshop(workshop.id)}
                              className="p-2 text-charcoal/60 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Add Workshop Dialog */}
              <Dialog open={workshopDialogOpen} onOpenChange={setWorkshopDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Add New Workshop</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input
                      placeholder="Workshop Title (e.g., SURYA KRIYA WORKSHOP)"
                      value={newWorkshop.title}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
                      className="bg-sand-50 border-sand-200"
                    />
                    <Input
                      placeholder="Dates (e.g., 7th-8th March)"
                      value={newWorkshop.dates}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, dates: e.target.value })}
                      className="bg-sand-50 border-sand-200"
                    />
                    <Input
                      placeholder="Image URL (optional)"
                      value={newWorkshop.image}
                      onChange={(e) => setNewWorkshop({ ...newWorkshop, image: e.target.value })}
                      className="bg-sand-50 border-sand-200"
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newWorkshop.is_active}
                        onCheckedChange={(checked) => setNewWorkshop({ ...newWorkshop, is_active: checked })}
                      />
                      <span className="text-sm text-charcoal/70">Active</span>
                    </div>
                    <Button
                      onClick={handleCreateWorkshop}
                      className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full"
                    >
                      Create Workshop
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Workshop Dialog */}
              <Dialog open={!!editingWorkshop} onOpenChange={() => setEditingWorkshop(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Edit Workshop</DialogTitle>
                  </DialogHeader>
                  {editingWorkshop && (
                    <div className="space-y-4 mt-4">
                      <Input
                        placeholder="Workshop Title"
                        value={editingWorkshop.title}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                        className="bg-sand-50 border-sand-200"
                      />
                      <Input
                        placeholder="Dates"
                        value={editingWorkshop.dates}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, dates: e.target.value })}
                        className="bg-sand-50 border-sand-200"
                      />
                      <Input
                        placeholder="Image URL"
                        value={editingWorkshop.image || ''}
                        onChange={(e) => setEditingWorkshop({ ...editingWorkshop, image: e.target.value })}
                        className="bg-sand-50 border-sand-200"
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingWorkshop.is_active}
                          onCheckedChange={(checked) => setEditingWorkshop({ ...editingWorkshop, is_active: checked })}
                        />
                        <span className="text-sm text-charcoal/70">Active</span>
                      </div>
                      <Button
                        onClick={handleUpdateWorkshop}
                        className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full"
                      >
                        Update Workshop
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Brochure Tab */}
          {activeTab === 'brochure' && (
            <div data-testid="brochure-tab">
              <h1 className="font-display text-3xl text-charcoal mb-8">Brochure Management</h1>
              
              <div className="admin-card p-6 max-w-2xl">
                <h2 className="font-display text-xl text-charcoal mb-6">Upload Brochure PDF</h2>
                
                <div className="mb-6 p-4 bg-sand-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-sage-500" />
                    <div>
                      {brochureInfo?.exists ? (
                        <>
                          <p className="font-medium text-charcoal flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            Brochure Uploaded
                          </p>
                          <p className="text-sm text-charcoal/60">
                            {brochureInfo.filename}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-charcoal">No Brochure Uploaded</p>
                          <p className="text-sm text-charcoal/60">Upload a PDF file to enable downloads</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-sand-300 rounded-xl p-8 text-center hover:border-terracotta-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleBrochureUpload}
                    className="hidden"
                    id="brochure-upload"
                  />
                  <label htmlFor="brochure-upload" className="cursor-pointer block">
                    <Upload className="w-12 h-12 text-charcoal/40 mx-auto mb-4" />
                    <p className="font-medium text-charcoal mb-2">
                      {uploadingBrochure ? 'Uploading...' : 'Click to upload brochure'}
                    </p>
                    <p className="text-sm text-charcoal/50">PDF files only</p>
                  </label>
                </div>

                {brochureInfo?.exists && (
                  <div className="mt-6">
                    <a
                      href={`${API}/brochure/file`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Preview Brochure
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div data-testid="contacts-tab">
              <h1 className="font-display text-3xl text-charcoal mb-8">Contact Messages</h1>
              <div className="admin-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-charcoal/50">
                          No messages yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      contacts.map((contact) => (
                        <TableRow key={contact.id} className="table-row-hover">
                          <TableCell className="font-medium">
                            {contact.first_name} {contact.last_name}
                          </TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                          <TableCell className="text-sm text-charcoal/60">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === 'downloads' && (
            <div data-testid="downloads-tab">
              <h1 className="font-display text-3xl text-charcoal mb-8">Brochure Downloads</h1>
              <div className="admin-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Downloaded At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {downloads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-charcoal/50">
                          No downloads yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      downloads.map((download) => (
                        <TableRow key={download.id} className="table-row-hover">
                          <TableCell className="font-medium">{download.name}</TableCell>
                          <TableCell>{download.email || '-'}</TableCell>
                          <TableCell className="text-sm text-charcoal/60">
                            {new Date(download.downloaded_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
