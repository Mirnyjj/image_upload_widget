'use client'

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const baseStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  gap: '10px',
  alignItems: 'center',
  padding: '20px',
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  transition: 'border .3s ease-in-out',
};
//   flexDirection: 'column',
const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

interface FilePrev extends File {
  preview: string;
}

function DropzoneComponent({
  setBase64Img,
}: {
  setBase64Img: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
}) {
  const [files, setFiles] = useState<FilePrev[]>([]);

  const onDrop = useCallback(
    <T extends File>(acceptedFiles: T[]) => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
      const file = acceptedFiles.find(f => f);
      const reader = new FileReader();
      if (file) reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader?.result) setBase64Img(reader.result);
      };
    },
    [setBase64Img],
  );

  const {getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject} =
    useDropzone({
      onDrop,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg'],
      },
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  );

  const thumbs = files.map(file => (
    <img key={file.name} src={file.preview} alt={file.name} className='imgStyle' />
  ));

  const imageUrlToBase64 = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image URL to Base64:', error);
      return null;
    }
  };
  // clean up
  useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  useEffect(() => {
    if (files[0]?.preview.length !== 0) {
      imageUrlToBase64(files[0]?.preview);
    }
  }, [files]);

  return (
    <div {...getRootProps({style})} className='imgStyle'>
      <input {...getInputProps()} name='img-data' />
      <div style={{textAlign: 'center'}}>
        Перетащите сюда вашe изображениe, или кликните по выделенной области, для выбора
        из файловой системы.
      </div>
      <aside className='contentCenter'>{thumbs}</aside>
    </div>
  );
}

export default DropzoneComponent;
