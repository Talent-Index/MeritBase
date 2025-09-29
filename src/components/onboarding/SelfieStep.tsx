
'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Camera, Loader2, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SelfieStep() {
  const [isPending, setIsPending] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        // Cleanup: stop camera stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setPhotoDataUrl(dataUrl);
      }
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
     if (!photoDataUrl) {
      toast({
        variant: "destructive",
        title: "No Selfie Taken",
        description: "Please capture a selfie before proceeding.",
      });
      return;
    }
    setIsPending(true);
    setTimeout(() => {
        toast({
            title: "Verification Submitted!",
            description: "Your identity is being verified. You will be redirected to your dashboard.",
        });
        router.push('/dashboard-freelancer');
        setIsPending(false);
    }, 1500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden border">
           <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
           {photoDataUrl && <img src={photoDataUrl} alt="Your selfie" className="absolute inset-0 w-full h-full object-cover z-10" />}
           <canvas ref={canvasRef} className="hidden" />
        </div>
        
        {hasCameraPermission === false && (
            <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access in your browser settings to use this feature.
                </AlertDescription>
            </Alert>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <Button type="button" variant="outline" onClick={handleCapture} disabled={!hasCameraPermission || isPending}>
                <Camera className="mr-2 h-4 w-4" />
                {photoDataUrl ? 'Retake Photo' : 'Take Photo'}
            </Button>
            <Button type="submit" disabled={isPending || !photoDataUrl} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Verification <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </form>
  )
}
