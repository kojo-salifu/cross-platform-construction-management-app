"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  projectId: number;
  reportId?: number;
}

export function MobilePhotoUpload({ projectId, reportId }: PhotoUploadProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoData, setPhotoData] = useState<{
    base64?: string;
    lat?: number;
    lng?: number;
  }>({});
  const [tradeTag, setTradeTag] = useState("");
  const [gridLocation, setGridLocation] = useState("");
  const [caption, setCaption] = useState("");

  const capturePhoto = async () => {
    setIsCapturing(true);
    try {
      // Check if Capacitor is available (mobile app)
      if (typeof window !== "undefined" && (window as any).Capacitor) {
        const { Camera } = await import("@capacitor/camera");
        const { Geolocation } = await import("@capacitor/geolocation");

        // Get GPS location first
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        // Capture photo
        const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: (await import("@capacitor/camera")).CameraResultType.Base64,
          source: (await import("@capacitor/camera")).CameraSource.Camera,
          saveToGallery: true,
        });

        setPhotoData({
          base64: photo.base64String,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        toast.success("Photo captured with GPS location!");
      } else {
        // Fallback for web browser
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.capture = "environment";

        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              setPhotoData({
                base64: reader.result as string,
              });
              toast.success("Photo selected!");
            };
            reader.readAsDataURL(file);
          }
        };

        input.click();

        // Try to get GPS from browser
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            setPhotoData((prev) => ({
              ...prev,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }));
          });
        }
      }
    } catch (error: any) {
      console.error("Photo capture error:", error);
      toast.error(error?.message || "Failed to capture photo");
    } finally {
      setIsCapturing(false);
    }
  };

  const uploadPhoto = async () => {
    if (!photoData.base64) {
      toast.error("Please capture a photo first");
      return;
    }

    try {
      const response = await fetch("/api/photos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          reportId,
          photoBase64: photoData.base64,
          tradeTag,
          gridLocation,
          caption,
          latitude: photoData.lat,
          longitude: photoData.lng,
        }),
      });

      if (response.ok) {
        toast.success("Photo uploaded successfully!");
        // Reset form
        setPhotoData({});
        setTradeTag("");
        setGridLocation("");
        setCaption("");
      } else {
        toast.error("Failed to upload photo");
      }
    } catch (error) {
      toast.error("Upload error");
    }
  };

  return (
    <div className="space-y-4">
      {/* Capture Button */}
      <div className="flex gap-2">
        <Button
          onClick={capturePhoto}
          disabled={isCapturing}
          className="flex-1"
        >
          <Camera className="h-4 w-4 mr-2" />
          {isCapturing ? "Capturing..." : "Capture Photo"}
        </Button>
      </div>

      {/* Photo Preview */}
      {photoData.base64 && (
        <div className="border rounded-lg overflow-hidden">
          <img
            src={photoData.base64.startsWith("data:") ? photoData.base64 : `data:image/jpeg;base64,${photoData.base64}`}
            alt="Captured"
            className="w-full"
          />
          {photoData.lat && photoData.lng && (
            <div className="bg-green-50 border-t border-green-200 p-2 text-xs flex items-center gap-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-green-700">
                GPS: {photoData.lat.toFixed(6)}, {photoData.lng.toFixed(6)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Metadata Form */}
      {photoData.base64 && (
        <>
          <div className="space-y-2">
            <Label htmlFor="tradeTag">Trade Tag</Label>
            <Select value={tradeTag} onValueChange={setTradeTag}>
              <SelectTrigger>
                <SelectValue placeholder="Select trade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Foundation Pour">Foundation Pour</SelectItem>
                <SelectItem value="Slab Pour">Slab Pour</SelectItem>
                <SelectItem value="Column Work">Column Work</SelectItem>
                <SelectItem value="Steel Fixing">Steel Fixing</SelectItem>
                <SelectItem value="Formwork">Formwork</SelectItem>
                <SelectItem value="MEP Installation">MEP Installation</SelectItem>
                <SelectItem value="Solar Panel">Solar Panel</SelectItem>
                <SelectItem value="Facade">Facade</SelectItem>
                <SelectItem value="General Progress">General Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gridLocation">Grid Location</Label>
            <Input
              id="gridLocation"
              placeholder="e.g., Grid C3-D4"
              value={gridLocation}
              onChange={(e) => setGridLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              placeholder="Describe what's in the photo"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <Button onClick={uploadPhoto} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
        </>
      )}
    </div>
  );
}
