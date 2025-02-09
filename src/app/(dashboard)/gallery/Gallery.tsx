"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetUserProfile } from "@/hooks/useQuery";
import { UploadCloud, Trash } from "lucide-react";
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

// A simple fetcher for SWR; you can add caching options here if needed.
const fetcher = (url: string) =>
  fetch(url, { cache: "force-cache" }).then((res) => res.json());

export default function AlumniGallery() {
  const currentUserProfile = useGetUserProfile();
  const [selectedImage, setSelectedImage] = useState<Picture | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: userProfile, isLoading: isLoadingUserProfile } =
    currentUserProfile;
  const isAdmin = userProfile?.user?.role === "ADMIN";

  // Use SWR to fetch gallery data (which will be cached automatically)
  const {
    data: galleryData,
    error: galleryError,
    mutate,
  } = useSWR("/api/gallery", fetcher, { revalidateOnFocus: false });

  // Transform the fetched data into our Picture type
  const pictures: Picture[] = galleryData
    ? galleryData.resources.map(
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
    : [];

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

      // Optimistically update the gallery cache
      mutate(
        (
          currentData:
            | { resources: { public_id: string; secure_url: string }[] }
            | undefined
        ) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            resources: [
              ...currentData.resources,
              {
                public_id: data.public_id || "123", // Use actual public_id from data if available
                secure_url: data.url,
              },
            ],
          };
        },
        false
      );

      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (picture: Picture) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`/api/gallery/${picture.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete image.");
      toast.success("Image deleted successfully!");

      // Optimistically update the gallery cache after deletion
      mutate(
        (
          currentData:
            | { resources: { public_id: string; secure_url: string }[] }
            | undefined
        ) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            resources: currentData.resources.filter(
              (resource) => resource.public_id !== picture.id
            ),
          };
        },
        false
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <h3 className="text-3xl font-bold mb-6 text-center">
        Alumni Photo Gallery
      </h3>
      <div className="flex items-center justify-end mb-2">
        {isAdmin && !isLoadingUserProfile && (
          <Button
            variant="outline"
            onClick={() => setIsEditing((prev) => !prev)}
            className="h-10"
          >
            {isEditing ? "Done" : "Edit Gallery"}
          </Button>
        )}
      </div>

      {/* Uploader Panel (only visible in edit mode) */}
      {isAdmin && !isLoadingUserProfile && isEditing && (
        <div className="mb-6 p-6 border rounded-lg shadow-lg bg-gray-100 max-w-md mx-auto transition-all duration-300">
          {/* Drag & Drop / Clickable File Selection Area */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() =>
              document.getElementById("upload-file-input")?.click()
            }
          >
            <UploadCloud className="h-10 w-10 text-gray-500 mb-2" />
            {file ? (
              <span className="text-green-600 text-sm font-medium">
                File added: {file.name}
              </span>
            ) : (
              <span
                className={`text-sm ${
                  isDragging ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Drag &amp; drop a file here, or click to select one
              </span>
            )}
          </div>
          <Input
            id="upload-file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Upload button placed outside the clickable drag area */}
          <div className="mt-4 self-center text-center">
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}

      {/* Gallery */}
      {galleryError ? (
        <div className="text-center text-red-500">
          Failed to load images. Please try again.
        </div>
      ) : !galleryData ? (
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
              {/* Show delete button only when editing */}
              {isAdmin && isEditing && (
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

      {/* Modal for Enlarged Image */}
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
