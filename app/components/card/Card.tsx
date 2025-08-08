"use client";
import { AttributeValue } from "@/app/service/types";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import TrashIcon from "../../asset/trash-bin-trash-svgrepo-com.svg";
import { DeleteConfirmationModal } from "./PopUp";

type Props = {
  item: AttributeValue;
  id: string;
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

export default function Card({ item, id, setRefresh }: Props) {
  const [isDelete, setIsDelete] = useState(false);
  const onDeleteAttr = async () => {
    try {
      const response = await fetch(`/api/${id}?attribute_key=${item.key}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete attribute");
      }

      return await response.json();
    } catch (error) {
      console.error("Delete attribute failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      setIsDelete(false);
      setRefresh((prev) => !prev);
    }
  };

  return (
    <div>
      <Image
        src={String(item.value)}
        width={100}
        height={100}
        alt="Изображение устройства, или объекта"
        style={{ borderRadius: "5px" }}
      />
      <button className="buttonTrash" onClick={() => setIsDelete(true)}>
        <Image
          src={TrashIcon}
          width={20}
          height={20}
          alt="Иконка удаления изображения"
          className="imageTrash"
        />
      </button>
      <DeleteConfirmationModal
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        onConfirm={() => onDeleteAttr()}
      />
    </div>
  );
}
