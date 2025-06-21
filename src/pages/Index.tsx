
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import DynamicQRManager from '@/components/DynamicQRManager';
import BulkQRGenerator from '@/components/BulkQRGenerator';
import { QrCode, Sparkles, Clock, Grid3X3 } from 'lucide-react';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <div className="animate-pulse">
          <QrCode className="w-16 h-16 text-purple-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-pink-300 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-300 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-indigo-300 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-pink-400 rounded-full animate-pulse opacity-30 animation-delay-3000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="w-12 h-12 text-purple-600" />
            <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent mb-4">
            Magical QR Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning QR codes with embedded star patterns, dynamic content management, and scheduled updates
          </p>
        </div>

        <Tabs defaultValue="generator" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              QR Generator
            </TabsTrigger>
            <TabsTrigger value="dynamic" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Dynamic QR
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Bulk Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">Generate QR Code</CardTitle>
                <CardDescription>
                  Create beautiful QR codes with star patterns and glitter effects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dynamic">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">Dynamic QR Management</CardTitle>
                <CardDescription>
                  Manage QR codes that can update their content automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicQRManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">Bulk QR Generation</CardTitle>
                <CardDescription>
                  Generate multiple QR codes simultaneously for large deployments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BulkQRGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
