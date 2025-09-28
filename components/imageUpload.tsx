'use client'

import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";




const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;


const authenticator=async ()=>{
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

        const data = await response.json();

    const { signature, expire, token } = data;

    return { token, expire, signature };


    } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Authentication request failed: ${errorMessage}`);

    }
}





const ImageUpload = () => {
     


     const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);


    const onError = (error: any) => {
    console.log(error);

    toast({
      title: `${type} upload failed`,
      description: `Your ${type} could not be uploaded. Please try again.`,
      variant: "destructive",
    });
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
      title: `${type} uploaded successfully`,
      description: `${res.filePath} uploaded successfully!`,
    });
  };

   
  return (
        <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
          <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        
        fileName='test-upload.png'
        className="hidden"
      />

     </ImageKitProvider>
  )
}

export default ImageUpload
