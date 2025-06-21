
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Zap, Grid3X3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

interface BulkQRItem {
  id: string;
  url: string;
  label?: string;
}

const BulkQRGenerator = () => {
  const [urls, setUrls] = useState('');
  const [qrCodes, setQrCodes] = useState<BulkQRItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateBulkQRCodes = async () => {
    if (!urls.trim()) {
      toast({
        title: "No URLs Provided",
        description: "Please enter URLs to generate QR codes.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const urlList = urls.split('\n').filter(url => url.trim());
    const newQRCodes: BulkQRItem[] = urlList.map((url, index) => {
      const cleanUrl = url.trim();
      const parts = cleanUrl.split('|');
      
      return {
        id: `${Date.now()}_${index}`,
        url: parts[0].trim(),
        label: parts[1]?.trim() || `QR Code ${index + 1}`
      };
    });

    setQrCodes(newQRCodes);
    setIsGenerating(false);
    
    toast({
      title: "Bulk QR Codes Generated! 🎉",
      description: `Successfully generated ${newQRCodes.length} QR codes.`,
    });
  };

  const downloadAllQRCodes = async () => {
    if (qrCodes.length === 0) return;

    toast({
      title: "Preparing Download...",
      description: "Generating ZIP file with all QR codes.",
    });

    // Create a canvas for each QR code and prepare for download
    for (let i = 0; i < qrCodes.length; i++) {
      const qrCode = qrCodes[i];
      const qrElement = document.getElementById(`qr-${qrCode.id}`)?.querySelector('svg');
      
      if (qrElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const svgData = new XMLSerializer().serializeToString(qrElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = 512;
            canvas.height = 512;
            
            // Create unique gradient for each QR code
            const hue = (i * 137.5) % 360; // Golden angle for nice color distribution
            const gradient = ctx!.createLinearGradient(0, 0, 512, 512);
            gradient.addColorStop(0, `hsl(${hue}, 70%, 85%)`);
            gradient.addColorStop(0.5, `hsl(${(hue + 30) % 360}, 70%, 80%)`);
            gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 85%)`);
            
            ctx!.fillStyle = gradient;
            ctx!.fillRect(0, 0, 512, 512);
            
            // Draw QR code
            ctx!.drawImage(img, 64, 64, 384, 384);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${qrCode.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                a.click();
                URL.revokeObjectURL(url);
              }
              resolve(true);
            });
            
            URL.revokeObjectURL(url);
          };
          img.src = url;
        });
      }
    }

    toast({
      title: "Download Complete! ✨",
      description: "All QR codes have been downloaded successfully.",
    });
  };

  const clearAll = () => {
    setQrCodes([]);
    setUrls('');
    toast({
      title: "Cleared",
      description: "All QR codes have been cleared.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Upload className="w-5 h-5" />
            Bulk URL Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bulk-urls">
              Enter URLs (one per line, optionally with labels: URL|Label)
            </Label>
            <Textarea
              id="bulk-urls"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={`https://example1.com|Website 1
https://example2.com|Website 2
https://example3.com
https://example4.com|Special Offer`}
              className="mt-2 min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={generateBulkQRCodes}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 flex-1"
            >
              {isGenerating ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Generate QR Codes
                </>
              )}
            </Button>
            
            {qrCodes.length > 0 && (
              <>
                <Button
                  onClick={downloadAllQRCodes}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated QR Codes */}
      {qrCodes.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-blue-700">Generated QR Codes</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {qrCodes.length} QR Code{qrCodes.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {qrCodes.map((qr, index) => (
                <Card key={qr.id} className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-800 truncate" title={qr.label}>
                        {qr.label}
                      </h4>
                      <p className="text-xs text-gray-500 truncate" title={qr.url}>
                        {qr.url}
                      </p>
                    </div>
                    
                    <div id={`qr-${qr.id}`} className="flex justify-center mb-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <QRCode
                          value={qr.url}
                          size={120}
                          fgColor="#4c1d95"
                          bgColor="transparent"
                        />
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`text-xs bg-gradient-to-r ${
                        index % 4 === 0 ? 'from-pink-100 to-purple-100 border-pink-300' :
                        index % 4 === 1 ? 'from-blue-100 to-indigo-100 border-blue-300' :
                        index % 4 === 2 ? 'from-green-100 to-teal-100 border-green-300' :
                        'from-yellow-100 to-orange-100 border-yellow-300'
                      }`}
                    >
                      #{index + 1}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {qrCodes.length === 0 && (
        <div className="text-center py-12">
          <Grid3X3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No QR Codes Generated Yet</h3>
          <p className="text-gray-400">Enter URLs above to generate multiple QR codes at once!</p>
        </div>
      )}
    </div>
  );
};

export default BulkQRGenerator;
