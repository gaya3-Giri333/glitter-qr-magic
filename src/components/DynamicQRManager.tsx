import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit3, Save, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface DynamicQR {
  id: string;
  name: string;
  currentUrl: string;
  scheduledUpdates: Array<{
    date: string;
    time: string;
    url: string;
  }>;
  created: string;
}

const DynamicQRManager = () => {
  const [qrCodes, setQrCodes] = useState<DynamicQR[]>([]);
  const [newQR, setNewQR] = useState({
    name: '',
    url: '',
    scheduledDate: '',
    scheduledTime: '',
    scheduledUrl: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const createDynamicQR = () => {
    if (!newQR.name || !newQR.url) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and URL for the QR code.",
        variant: "destructive"
      });
      return;
    }

    const dynamicQR: DynamicQR = {
      id: Date.now().toString(),
      name: newQR.name,
      currentUrl: newQR.url,
      scheduledUpdates: newQR.scheduledDate && newQR.scheduledTime && newQR.scheduledUrl 
        ? [{
            date: newQR.scheduledDate,
            time: newQR.scheduledTime,
            url: newQR.scheduledUrl
          }]
        : [],
      created: new Date().toISOString()
    };

    setQrCodes([...qrCodes, dynamicQR]);
    setNewQR({ name: '', url: '', scheduledDate: '', scheduledTime: '', scheduledUrl: '' });
    
    toast({
      title: "Dynamic QR Created! 🎉",
      description: `${newQR.name} has been created successfully.`,
    });
  };

  const updateQRUrl = (id: string, newUrl: string) => {
    setQrCodes(qrCodes.map(qr => 
      qr.id === id ? { ...qr, currentUrl: newUrl } : qr
    ));
    setEditingId(null);
    
    toast({
      title: "QR Code Updated! ✨",
      description: "The QR code content has been updated successfully.",
    });
  };

  const deleteQR = (id: string) => {
    setQrCodes(qrCodes.filter(qr => qr.id !== id));
    toast({
      title: "QR Code Deleted",
      description: "The QR code has been removed from your collection.",
    });
  };

  const addScheduledUpdate = (id: string, date: string, time: string, url: string) => {
    if (!date || !time || !url) {
      toast({
        title: "Missing Schedule Information",
        description: "Please provide date, time, and URL for the scheduled update.",
        variant: "destructive"
      });
      return;
    }

    setQrCodes(qrCodes.map(qr => 
      qr.id === id 
        ? { 
            ...qr, 
            scheduledUpdates: [...qr.scheduledUpdates, { date, time, url }]
          }
        : qr
    ));

    toast({
      title: "Schedule Added! ⏰",
      description: "Scheduled update has been added to the QR code.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Create New Dynamic QR */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Plus className="w-5 h-5" />
            Create Dynamic QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qr-name">QR Code Name</Label>
              <Input
                id="qr-name"
                value={newQR.name}
                onChange={(e) => setNewQR({ ...newQR, name: e.target.value })}
                placeholder="My Dynamic QR"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="qr-url">Initial URL</Label>
              <Input
                id="qr-url"
                value={newQR.url}
                onChange={(e) => setNewQR({ ...newQR, url: e.target.value })}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-3">Schedule Future Update (Optional)</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="scheduled-date">Date</Label>
                <Input
                  id="scheduled-date"
                  type="date"
                  value={newQR.scheduledDate}
                  onChange={(e) => setNewQR({ ...newQR, scheduledDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="scheduled-time">Time</Label>
                <Input
                  id="scheduled-time"
                  type="time"
                  value={newQR.scheduledTime}
                  onChange={(e) => setNewQR({ ...newQR, scheduledTime: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="scheduled-url">New URL</Label>
                <Input
                  id="scheduled-url"
                  value={newQR.scheduledUrl}
                  onChange={(e) => setNewQR({ ...newQR, scheduledUrl: e.target.value })}
                  placeholder="https://new-url.com"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Button onClick={createDynamicQR} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            Create Dynamic QR Code
          </Button>
        </CardContent>
      </Card>

      {/* Existing Dynamic QR Codes */}
      <div className="grid gap-6">
        {qrCodes.map((qr) => (
          <Card key={qr.id} className="bg-white/80 backdrop-blur-sm border border-purple-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-purple-700">{qr.name}</CardTitle>
                  <p className="text-sm text-gray-500">Created: {new Date(qr.created).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(editingId === qr.id ? null : qr.id)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteQR(qr.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Current URL</Label>
                    {editingId === qr.id ? (
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={qr.currentUrl}
                          onChange={(e) => setQrCodes(qrCodes.map(q => 
                            q.id === qr.id ? { ...q, currentUrl: e.target.value } : q
                          ))}
                        />
                        <Button
                          size="sm"
                          onClick={() => updateQRUrl(qr.id, qr.currentUrl)}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded text-sm break-all">{qr.currentUrl}</p>
                    )}
                  </div>

                  {qr.scheduledUpdates.length > 0 && (
                    <div>
                      <Label>Scheduled Updates</Label>
                      <div className="mt-2 space-y-2">
                        {qr.scheduledUpdates.map((update, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">{update.date}</span>
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">{update.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 break-all">{update.url}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <QRCode
                      value={qr.currentUrl}
                      size={150}
                      fgColor="#4c1d95"
                      bgColor="transparent"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {qrCodes.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No Dynamic QR Codes Yet</h3>
          <p className="text-gray-400">Create your first dynamic QR code to get started!</p>
        </div>
      )}
    </div>
  );
};

export default DynamicQRManager;
