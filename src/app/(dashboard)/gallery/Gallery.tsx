"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetUserProfile } from "@/hooks/useQuery";
import { UploadCloud, Trash } from "lucide-react"; // Added Trash icon for deletion
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";

interface Picture {
  id: string;
  src: string;
  alt: string;
}

export default function AlumniGallery() {
  const currentUserProfile = useGetUserProfile();
  const [selectedImage, setSelectedImage] = useState<Picture | null>(null);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const { data: userProfile, isLoading: isLoadingUserProfile } =
    currentUserProfile;
  const isAdmin = userProfile?.user?.role === "ADMIN";

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoadingImages(true);
      const response = await fetch("/api/gallery");
      if (!response.ok) throw new Error("Failed to fetch images.");
      const data = await response.json();
      setPictures(
        data.resources.map(
          ({
            public_id,
            secure_url,
          }: {
            public_id: string;
            secure_url: string;
          }) => ({
            id: public_id,
            src: secure_url,
            alt: "",
          })
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "AFSS07_PHOTO_GALLERY");

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image.");
      const data = await res.json();
      toast.success("Image uploaded successfully!", { autoClose: 1000 });
      setPictures((prev) => [
        ...prev,
        {
          id: data.public_id || "123", // Use actual public_id from data if available
          src: data.url,
          alt: "Uploaded Alumni Image",
        },
      ]);
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // New delete handler (only accessible by admin)
  const handleDelete = async (picture: Picture) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`/api/gallery/${picture.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete image.");
      toast.success("Image deleted successfully!");
      setPictures((prev) => prev.filter((pic) => pic.id !== picture.id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Alumni Photo Gallery
      </h1>

      {isAdmin && !isLoadingUserProfile && (
        <div className="mb-6 p-6 border rounded-lg shadow-lg bg-gray-100 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Upload New Picture
          </h2>
          <label className="border border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <UploadCloud className="h-10 w-10 text-gray-500 mb-2" />
            <span className="text-gray-600 text-sm">Click to upload</span>
            <Input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          <Button
            className="mt-4 w-full"
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      )}

      {isLoadingImages ? (
        <div className="flex items-center justify-center h-40">
          <ClipLoader size={40} color="#10B981" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {pictures.map((pic) => (
            <Card
              key={pic.id}
              className="relative cursor-pointer"
              onClick={() => setSelectedImage(pic)}
            >
              {isAdmin && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pic);
                  }}
                >
                  <Trash size={16} />
                </Button>
              )}
              <CardContent className="p-2">
                <Image
                  src={pic.src}
                  alt={pic.alt}
                  className="w-full h-auto object-cover rounded-lg"
                  width={200}
                  height={200}
                />
                <p className="text-center mt-2 text-sm text-gray-600">
                  {pic.alt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedImage && (
        <Dialog open={true} onOpenChange={() => setSelectedImage(null)}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" />
          <DialogContent className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full flex flex-col items-center">
            <DialogTitle>
              <VisuallyHidden.Root>Enlarged Image</VisuallyHidden.Root>
            </DialogTitle>
            <Image
              src={selectedImage.src}
              alt="Enlarged"
              className="max-w-full max-h-[80vh] rounded-lg"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
