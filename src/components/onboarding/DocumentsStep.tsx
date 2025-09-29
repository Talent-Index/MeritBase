
'use client';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Camera, Loader2, RefreshCw, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

type CaptureStep = 'front' | 'back' | 'selfie' | 'done';

const STEP_CONFIG = {
    front: { title: "Front of ID", instruction: "Position the front of your ID card in the frame and take a photo." },
    back: { title: "Back of ID", instruction: "Now, flip the card over and capture the back." },
    selfie: { title: "Liveness Check", instruction: "Finally, position your face in the center of the frame for a selfie." },
    done: { title: "Verification Submitted", instruction: "" }
};


export default function DocumentsStep() {
    const [isPending, setIsPending] = useState(false);
    const [currentStep, setCurrentStep] = useState<CaptureStep>('front');
    
    const [frontId, setFrontId] = useState<string | null>(null);
    const [backId, setBackId] = useState<string | null>(null);
    const [selfie, setSelfie] = useState<string | null>(null);
    
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const router = useRouter();
    const { toast } = useToast();

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
                
                switch (currentStep) {
                    case 'front':
                        setFrontId(dataUrl);
                        break;
                    case 'back':
                        setBackId(dataUrl);
                        break;
                    case 'selfie':
                        setSelfie(dataUrl);
                        break;
                }
            }
        }
    };

    const handleRetake = () => {
         switch (currentStep) {
            case 'front':
                setFrontId(null);
                break;
            case 'back':
                setBackId(null);
                break;
            case 'selfie':
                setSelfie(null);
                break;
        }
    }
    
    const handleNextStep = () => {
        switch (currentStep) {
            case 'front':
                if(frontId) setCurrentStep('back');
                break;
            case 'back':
                if(backId) setCurrentStep('selfie');
                break;
            case 'selfie':
                 if(selfie) handleSubmit();
                break;
        }
    };
    
    const currentPhoto = {
        front: frontId,
        back: backId,
        selfie: selfie
    }[currentStep];
    
    const isCaptureDisabled = !hasCameraPermission || isPending;
    const isNextDisabled = !currentPhoto || isPending;


    const handleSubmit = () => {
        if (!frontId || !backId || !selfie) {
            toast({
                variant: "destructive",
                title: "Incomplete Verification",
                description: "Please capture all required images.",
            });
            return;
        }
        
        // In a real app, we'd upload these to IPFS and get CIDs.
        // For now, we'll save placeholders to localStorage.
        const verificationData = {
            govIdFrontCid: 'ipfs://placeholder_front_id',
            govIdBackCid: 'ipfs://placeholder_back_id',
            selfieCid: 'ipfs://placeholder_selfie',
        };
        localStorage.setItem('freelancerVerification', JSON.stringify(verificationData));

        setIsPending(true);
        setTimeout(() => {
            toast({
                title: "Identity Verified!",
                description: "Just one more step to register on-chain.",
            });
            router.push('/signup-freelancer/register');
            setIsPending(false);
        }, 1000);
    };

    const progressValue = { front: 25, back: 50, selfie: 75, done: 100 }[currentStep];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="font-semibold">{STEP_CONFIG[currentStep].title}</h3>
                <p className="text-sm text-muted-foreground">{STEP_CONFIG[currentStep].instruction}</p>
            </div>
            <Progress value={progressValue} className="h-2" />

             <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden border">
               <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
               {currentPhoto && <img src={currentPhoto} alt="Capture preview" className="absolute inset-0 w-full h-full object-cover z-10" />}
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
                {currentPhoto ? (
                     <Button type="button" variant="outline" onClick={handleRetake} disabled={isPending}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retake
                    </Button>
                ) : (
                    <Button type="button" variant="outline" onClick={handleCapture} disabled={isCaptureDisabled}>
                        <Camera className="mr-2 h-4 w-4" />
                        Capture
                    </Button>
                )}
                
                <Button 
                    type="button" 
                    onClick={handleNextStep} 
                    disabled={isNextDisabled} 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentStep === 'selfie' ? (
                        <>Complete Verification <UserCheck className="ml-2 h-4 w-4" /></>
                    ) : (
                        <>Next Step <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                </Button>
            </div>
        </div>
    );
}
