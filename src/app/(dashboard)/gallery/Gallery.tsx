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

// The type for each image used in the UI
interface Picture {
  id: string;
  src: string;
  alt: string;
  created_at?: string;
}

// The type for the API response from /api/gallery
interface GalleryResponse {
  resources: {
    public_id: string;
    secure_url: string;
    created_at?: string;
  }[];
}

// The type expected from your upload endpoint
interface UploadResponse {
  public_id?: string;
  url: string;
  created_at?: string;
}

// A fetcher that always gets fresh data and returns a GalleryResponse
const fetcher = (url: string): Promise<GalleryResponse> =>
  fetch(url, { cache: "no-cache" }).then((res) => res.json());

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

  // Fetch gallery data using SWR with the proper type
  const {
    data: galleryData,
    error: galleryError,
    mutate,
  } = useSWR<GalleryResponse>("/api/gallery", fetcher, {
    revalidateOnFocus: false,
  });

  // Map the API data to our Picture type and sort by created_at (if available)
  const pictures: Picture[] = galleryData
    ? galleryData.resources
        .map(
          ({ public_id, secure_url, created_at }): Picture => ({
            id: public_id,
            src: secure_url,
            alt: "",
            created_at,
          })
        )
        .sort((a: Picture, b: Picture) => {
          if (a.created_at && b.created_at) {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          }
          return 0;
        })
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
      const data: UploadResponse = await res.json();
      toast.success("Image uploaded successfully!", { autoClose: 1000 });

      // Create a new image object using the upload response.
      const newImage = {
        public_id: data.public_id || "123",
        secure_url: data.url,
        created_at: data.created_at || new Date().toISOString(),
      };

      // Optimistically update the gallery cache by prepending the new image.
      await mutate(
        (currentData: GalleryResponse | undefined): GalleryResponse => {
          if (!currentData || !currentData.resources) {
            return { resources: [newImage] };
          }
          return {
            ...currentData,
            resources: [newImage, ...currentData.resources],
          };
        },
        false
      ); // Do not immediately revalidate

      // Delay revalidation to allow Cloudinary time to update its index.
      setTimeout(() => {
        mutate();
      }, 3000);

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

      // Optimistically remove the deleted image.
      await mutate(
        (
          currentData: GalleryResponse | undefined
        ): GalleryResponse | undefined => {
          if (!currentData || !currentData.resources) return currentData;
          return {
            ...currentData,
            resources: currentData.resources.filter(
              (resource) => resource.public_id !== picture.id
            ),
          };
        },
        false
      );

      setTimeout(() => {
        mutate();
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <h3 className="text-2xl font-bold mb-6 text-center">
        AFSS07 Photo Gallery
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

      {/* Uploader Panel (visible only in edit mode) */}
      {isAdmin && !isLoadingUserProfile && isEditing && (
        <div className="mb-6 p-6 border rounded-lg shadow-lg bg-gray-100 max-w-md mx-auto transition-all duration-300">
          {/* Drag & Drop / Clickable File Selection */}
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
      ) : pictures.length === 0 ? (
        <div className="text-center text-gray-500">
          No image is uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {pictures.map((pic) => (
            <Card
              key={pic.id}
              className="relative cursor-pointer"
              onClick={() => setSelectedImage(pic)}
            >
              {/* Delete button for admin editing */}
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
