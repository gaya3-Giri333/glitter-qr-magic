
import { useState, useRef, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Download, Link, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('https://example.com');
  const [isHovering, setIsHovering] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create glitter effect
      const glitter = document.createElement('div');
      glitter.className = 'glitter-particle';
      glitter.style.left = `${x}px`;
      glitter.style.top = `${y}px`;
      glitter.style.position = 'absolute';
      glitter.style.width = '4px';
      glitter.style.height = '4px';
      glitter.style.borderRadius = '50%';
      glitter.style.background = `linear-gradient(45deg, #ff6b9d, #c44569, #f8b500, #3742fa)`;
      glitter.style.animation = 'glitterFade 0.8s ease-out forwards';
      glitter.style.pointerEvents = 'none';
      glitter.style.zIndex = '10';
      
      container.appendChild(glitter);
      
      setTimeout(() => {
        if (container.contains(glitter)) {
          container.removeChild(glitter);
        }
      }, 800);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [isHovering]);

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      
      // Create gradient background
      const gradient = ctx!.createLinearGradient(0, 0, 512, 512);
      gradient.addColorStop(0, '#ffeaa7');
      gradient.addColorStop(0.5, '#fab1a0');
      gradient.addColorStop(1, '#fd79a8');
      
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, 512, 512);
      
      // Draw QR code
      ctx!.drawImage(img, 64, 64, 384, 384);
      
      // Add star pattern overlay
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        drawStar(ctx!, x, y, 5, 8, 4);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'magical-qr-code.png';
          a.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "QR Code Downloaded! ✨",
            description: "Your magical QR code has been saved successfully.",
          });
        }
      });
      
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-purple-600" />
          <Label htmlFor="url" className="text-lg font-medium text-gray-700">
            Enter URL
          </Label>
        </div>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="text-lg p-4 border-2 border-purple-200 focus:border-purple-400 rounded-xl bg-white/80 backdrop-blur-sm"
        />
      </div>

      <div 
        ref={containerRef}
        className="flex justify-center relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-purple-200 shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Star pattern overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 text-yellow-300 opacity-60">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="absolute top-4 right-4 text-pink-300 opacity-60">
              <Sparkles className="w-3 h-3 animate-pulse animation-delay-500" />
            </div>
            <div className="absolute bottom-4 left-4 text-purple-300 opacity-60">
              <Sparkles className="w-3 h-3 animate-pulse animation-delay-1000" />
            </div>
            <div className="absolute bottom-4 right-4 text-indigo-300 opacity-60">
              <Sparkles className="w-4 h-4 animate-pulse animation-delay-1500" />
            </div>
          </div>
          
          <div ref={qrRef} className="relative z-10">
            <QRCode
              value={url}
              size={256}
              fgColor="#4c1d95"
              bgColor="transparent"
              level="H"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={downloadQRCode}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          Download Magical QR Code
        </Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
