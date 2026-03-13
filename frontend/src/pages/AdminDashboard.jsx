import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Settings,
  Calendar,
  Users,
  MessageSquare,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit,
  X,
  Menu,
  Download,
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
  const [activeTab, setActiveTab] = useState('settings');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [settings, setSettings] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [downloads, setDownloads] = useState([]);

  // Form states
  const [editingProgram, setEditingProgram] = useState(null);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    is_active: true,
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
      const [settingsRes, programsRes, contactsRes, downloadsRes] = await Promise.all([
        axios.get(`${API}/settings`),
        axios.get(`${API}/programs`),
        axios.get(`${API}/contact/submissions`, { headers }),
        axios.get(`${API}/brochure/downloads`, { headers }),
      ]);
      setSettings(settingsRes.data);
      setPrograms(programsRes.data);
      setContacts(contactsRes.data);
      setDownloads(downloadsRes.data);
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

  const handleCreateProgram = async () => {
    try {
      await axios.post(`${API}/programs`, newProgram, { headers });
      toast.success('Program created successfully!');
      setProgramDialogOpen(false);
      setNewProgram({ title: '', description: '', date: '', location: '', is_active: true });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to create program');
    }
  };

  const handleUpdateProgram = async () => {
    try {
      await axios.put(`${API}/programs/${editingProgram.id}`, editingProgram, { headers });
      toast.success('Program updated successfully!');
      setEditingProgram(null);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update program');
    }
  };

  const handleDeleteProgram = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      await axios.delete(`${API}/programs/${id}`, { headers });
      toast.success('Program deleted successfully!');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete program');
    }
  };

  const menuItems = [
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'programs', label: 'Programs', icon: Calendar },
    { id: 'contacts', label: 'Contact Messages', icon: MessageSquare },
    { id: 'downloads', label: 'Brochure Downloads', icon: Download },
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
        <button onClick={handleLogout} data-testid="mobile-logout">
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
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 bg-sage-500 rounded-full"></div>
              <span className="font-display text-xl text-white">Hatha Path</span>
            </div>

            {/* Menu */}
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

          {/* Logout */}
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
                      data-testid="settings-whatsapp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal/70 mb-2">Instagram Handle</label>
                    <Input
                      value={settings.instagram || ''}
                      onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                      className="bg-sand-50 border-sand-200 focus:border-terracotta-500"
                      placeholder="hatha_path"
                      data-testid="settings-instagram"
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
                      data-testid="settings-email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal/70 mb-2">Location</label>
                    <Input
                      value={settings.location || ''}
                      onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                      className="bg-sand-50 border-sand-200 focus:border-terracotta-500"
                      placeholder="Pune, Maharashtra, India"
                      data-testid="settings-location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal/70 mb-2">Location Detail</label>
                    <Input
                      value={settings.location_detail || ''}
                      onChange={(e) => setSettings({ ...settings, location_detail: e.target.value })}
                      className="bg-sand-50 border-sand-200 focus:border-terracotta-500"
                      placeholder="Isha Yoga Center"
                      data-testid="settings-location-detail"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateSettings}
                    className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-6"
                    data-testid="save-settings-btn"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div data-testid="programs-tab">
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl text-charcoal">Upcoming Programs</h1>
                <Button
                  onClick={() => setProgramDialogOpen(true)}
                  className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full"
                  data-testid="add-program-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Program
                </Button>
              </div>

              <div className="admin-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-charcoal/50">
                          No programs yet. Add your first program!
                        </TableCell>
                      </TableRow>
                    ) : (
                      programs.map((program) => (
                        <TableRow key={program.id} className="table-row-hover" data-testid={`program-row-${program.id}`}>
                          <TableCell className="font-medium">{program.title}</TableCell>
                          <TableCell>{program.date}</TableCell>
                          <TableCell>{program.location}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                program.is_active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {program.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => setEditingProgram(program)}
                              className="p-2 text-charcoal/60 hover:text-terracotta-500 transition-colors"
                              data-testid={`edit-program-${program.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProgram(program.id)}
                              className="p-2 text-charcoal/60 hover:text-red-500 transition-colors"
                              data-testid={`delete-program-${program.id}`}
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

              {/* Add Program Dialog */}
              <Dialog open={programDialogOpen} onOpenChange={setProgramDialogOpen}>
                <DialogContent data-testid="add-program-dialog">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Add New Program</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input
                      placeholder="Program Title"
                      value={newProgram.title}
                      onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                      className="bg-sand-50 border-sand-200"
                      data-testid="new-program-title"
                    />
                    <Textarea
                      placeholder="Description"
                      value={newProgram.description}
                      onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                      className="bg-sand-50 border-sand-200"
                      data-testid="new-program-description"
                    />
                    <Input
                      placeholder="Date (e.g., March 15-20, 2026)"
                      value={newProgram.date}
                      onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })}
                      className="bg-sand-50 border-sand-200"
                      data-testid="new-program-date"
                    />
                    <Input
                      placeholder="Location"
                      value={newProgram.location}
                      onChange={(e) => setNewProgram({ ...newProgram, location: e.target.value })}
                      className="bg-sand-50 border-sand-200"
                      data-testid="new-program-location"
                    />
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newProgram.is_active}
                        onCheckedChange={(checked) => setNewProgram({ ...newProgram, is_active: checked })}
                        data-testid="new-program-active"
                      />
                      <span className="text-sm text-charcoal/70">Active</span>
                    </div>
                    <Button
                      onClick={handleCreateProgram}
                      className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full"
                      data-testid="create-program-btn"
                    >
                      Create Program
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Edit Program Dialog */}
              <Dialog open={!!editingProgram} onOpenChange={() => setEditingProgram(null)}>
                <DialogContent data-testid="edit-program-dialog">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">Edit Program</DialogTitle>
                  </DialogHeader>
                  {editingProgram && (
                    <div className="space-y-4 mt-4">
                      <Input
                        placeholder="Program Title"
                        value={editingProgram.title}
                        onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                        className="bg-sand-50 border-sand-200"
                        data-testid="edit-program-title"
                      />
                      <Textarea
                        placeholder="Description"
                        value={editingProgram.description}
                        onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                        className="bg-sand-50 border-sand-200"
                        data-testid="edit-program-description"
                      />
                      <Input
                        placeholder="Date"
                        value={editingProgram.date}
                        onChange={(e) => setEditingProgram({ ...editingProgram, date: e.target.value })}
                        className="bg-sand-50 border-sand-200"
                        data-testid="edit-program-date"
                      />
                      <Input
                        placeholder="Location"
                        value={editingProgram.location}
                        onChange={(e) => setEditingProgram({ ...editingProgram, location: e.target.value })}
                        className="bg-sand-50 border-sand-200"
                        data-testid="edit-program-location"
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingProgram.is_active}
                          onCheckedChange={(checked) => setEditingProgram({ ...editingProgram, is_active: checked })}
                          data-testid="edit-program-active"
                        />
                        <span className="text-sm text-charcoal/70">Active</span>
                      </div>
                      <Button
                        onClick={handleUpdateProgram}
                        className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full"
                        data-testid="update-program-btn"
                      >
                        Update Program
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
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
                        <TableRow key={contact.id} className="table-row-hover" data-testid={`contact-row-${contact.id}`}>
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
                        <TableRow key={download.id} className="table-row-hover" data-testid={`download-row-${download.id}`}>
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
