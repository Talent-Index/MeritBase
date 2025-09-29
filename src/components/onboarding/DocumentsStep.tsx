
'use client';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Loader2, UploadCloud, File, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function DocumentsStep() {
    const [isPending, setIsPending] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { toast } = useToast();

    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    variant: "destructive",
                    title: "File too large",
                    description: "Please upload a file smaller than 5MB.",
                });
                return;
            }
            setFile(selectedFile);
        }
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileChange(droppedFile);
    };
    
    const onFileInputClick = () => {
        fileInputRef.current?.click();
    };


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            toast({
                variant: "destructive",
                title: "No file selected",
                description: "Please upload your government-issued ID.",
            });
            return;
        }
        setIsPending(true);

        setTimeout(() => {
            toast({
                title: "Documents Uploaded!",
                description: "Next, let's confirm your identity with a quick selfie.",
            });
            router.push('/signup-freelancer/selfie');
            setIsPending(false);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                 <Label className="font-medium">Government-issued ID</Label>
                 <RadioGroup defaultValue="identity-card" className="grid grid-cols-3 gap-4">
                     <div>
                         <RadioGroupItem value="passport" id="passport" className="peer sr-only" />
                         <Label htmlFor="passport" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                             Passport
                         </Label>
                     </div>
                     <div>
                         <RadioGroupItem value="drivers-license" id="drivers-license" className="peer sr-only" />
                         <Label htmlFor="drivers-license" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                             Driver's License
                         </Label>
                     </div>
                     <div>
                         <RadioGroupItem value="identity-card" id="identity-card" className="peer sr-only" />
                         <Label htmlFor="identity-card" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                             Identity Card
                         </Label>
                     </div>
                 </RadioGroup>
            </div>
            
            <div className="space-y-2">
                 <div
                    onClick={onFileInputClick}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={cn(
                        "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                        isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                        accept="image/png, image/jpeg, application/pdf"
                    />
                    <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-center text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 5MB)</p>
                </div>
            </div>

            {file && (
                <div className="p-3 bg-muted rounded-md flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <File className="w-5 h-5" />
                        <span className="font-medium truncate">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFile(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <div className="flex justify-end pt-4">
                 <Button type="submit" disabled={isPending || !file} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Next: Liveness Check <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
