import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import { toast } from "react-toastify";

const authenticator = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/upload-auth`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }
      const data = await response.json();
      return data; // Return the entire response object (signature, token, expire)
    } catch (error) {
      console.error("Error in authenticator:", error);
      throw error;
    }
  };
  

const Upload = ({children, type, setProgress, setData}) => {

    const ref = useRef(null);
    
      const handleUploadError = (err) => {
        console.error("Upload Error:", err);
        toast.error("Failed to upload image. Please try again.");
      };
    
      const handleUploadSuccess = (res) => {
        console.log("Upload Success:", res);
        setData(res)
        toast.success("Image uploaded successfully!");
      };
    
      const handleUploadProgress = (progressEvent) => {
        const percentage = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setProgress(percentage);
      };
    

  return (
    <IKContext
    publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
    authenticator={authenticator}
  >
    <IKUpload
      useUniqueFileName
      onError={handleUploadError}
      onSuccess={handleUploadSuccess}
      onUploadProgress={handleUploadProgress}
      className="hidden"
      ref={ref}
      accept={`${type}/*`}
    />

    <div className='cursor-pointer' onClick={()=>ref.current.click()}>{children}</div>
  </IKContext>

  );
};

export default Upload;