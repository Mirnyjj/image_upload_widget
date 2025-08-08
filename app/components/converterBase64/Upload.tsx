"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { debounce } from "lodash";

const baseStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "10px",
  alignItems: "center",
  padding: "20px",
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

type FilePrev = File & { preview: string };

function StableDropzone({
  setBase64Img,
}: {
  setBase64Img: React.Dispatch<
    React.SetStateAction<string | ArrayBuffer | null>
  >;
}) {
  const [files, setFiles] = useState<FilePrev[]>([]);

  const handleDragOver = debounce((e: React.DragEvent) => {
    e.preventDefault();
  }, 100);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const newFiles = acceptedFiles.map((file) => ({
        ...file,
        preview: URL.createObjectURL(file),
      }));

      setFiles(newFiles);

      const reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onload = () => {
        if (reader.result) setBase64Img(reader.result);
      };
    },
    [setBase64Img]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpg": [],
      "image/jpeg": [],
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  console.log(files);
  const thumbs = files.map((file) => (
    <img
      key={file.preview}
      src={file.preview}
      alt="Изображение для загрузки"
      className="imgStyle"
    />
  ));

  // Очистка Blob URL при размонтировании
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div
      {...getRootProps({ style, onDragOver: handleDragOver })}
      className="imgStyle"
    >
      <input {...getInputProps()} name="img-data" />
      <div style={{ textAlign: "center" }}>
        Перетащите сюда вашe изображениe, или кликните по выделенной области,
        для выбора из файловой системы.
      </div>
      <aside className="contentCenter">{thumbs}</aside>
    </div>
  );
}

export default StableDropzone;
