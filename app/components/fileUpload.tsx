"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import './upload.css';
import { set } from "mongoose";

interface FileUploadProps {
    onSuccess: (res: any) => void
    onProgress?: (progress: number) => void
    fileType?: "Image" | "Video"

}

const fileUpload = ({
    onSuccess,
    onProgress,
    fileType
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const validationFile = (file: File) => {
        if (fileType === "Video") {
            if (!file.type.startsWith("Video/")) {
                setError("Please Upload a valid Video file ")
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less that 100MB")
        }
        return true

    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file || !validationFile(file)) return
        setUploading(true)
        setError(null)

        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const auth = await authRes.json()

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,

                // Authentication parameters

                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent))
                    }
                },

            });
            onSuccess(res)
        } catch (error) {
            console.error("Upload failed", error)
        } finally {
            setUploading(false)
        }


    }
    return (
        <>


            <input
                type="file"
                accept={fileType === "Video" ? "Video/*" : "Image/*"}
                onChange={handleFileChange}

            />
            {uploading &&
                <span>loading....</span>

            }


        </>
    );
};

export default fileUpload;