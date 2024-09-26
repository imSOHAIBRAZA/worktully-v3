
'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useDropzone } from '@uploadthing/react/hooks';
import { useUploadThing } from '@/utils/uploadthing';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import isEmpty from 'lodash/isEmpty'; // Fix the missing import
import { PiPencilSimple } from 'react-icons/pi';
import { Loader, Text, FieldError } from 'rizzui';
import cn from '@/utils/class-names';
import { FileWithPath } from 'react-dropzone';
import { ClientUploadedFileData } from 'uploadthing/types';

interface AvatarUploadProps {
  name: string;
  getValues: any;
  setValue: any;
  className?: string;
  error?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  name,
  error,
  getValues,
  setValue,
  className,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const formValue = getValues(name); // Get the value for the avatar from the form

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing('avatar', {
    onClientUploadComplete: (res: ClientUploadedFileData<any>[] | undefined) => {
      if (res && res.length > 0 && setValue) {
        const uploadedFile = res[0]; // Set the first uploaded file URL
        setValue(name, {
          name: uploadedFile.name,
          size: uploadedFile.size,
          url: uploadedFile.url,
        });
        toast.success(<Text as="b">Avatar updated successfully</Text>);
      }
    },
    onUploadError: (error: Error) => {
      console.error('Upload error:', error);
      toast.error(error.message);
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    );
    startUpload(acceptedFiles); // Trigger the upload when files are dropped
  }, [startUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <div
        {...getRootProps()}
        className="relative w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer"
      >
        <input {...getInputProps()} />
        {!isEmpty(formValue?.url) && isEmpty(files) ? (
          <Image
            src={formValue.url}
            alt="Avatar"
            layout="fill"
            className="rounded-full object-cover"
          />
        ) : files.length > 0 ? (
          <Image
            src={files[0].preview}
            alt="Preview"
            layout="fill"
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <PiPencilSimple className="text-gray-500 w-8 h-8" />
            <span className="text-sm text-gray-600">Upload Avatar</span>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <Loader className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      {error && <FieldError error={error} />}
    </div>
  );
};

export default AvatarUpload;

