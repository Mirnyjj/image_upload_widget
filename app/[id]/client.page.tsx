"use client";

import { useEffect, useState } from "react";
import { GetData } from "../service/GetData";
import FBdataSource from "../components/FBdataSource/FBdataSource";
import StableDropzone from "../components/converterBase64/Upload";

type Props = {
  id: string;
  token: string;
  authority: string;
  baseUrl: string;
};

export default function ClientPage({ id, token, authority, baseUrl }: Props) {
  const [base64Img, setBase64Img] = useState<string | ArrayBuffer | null>(null);
  const [error, setError] = useState("");
  const [isObjectID, setIsObjectID] = useState<string | null>(null);
  const [isDeviceID, setIsDeviceID] = useState<string | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(true);
  const [index, setIndex] = useState<number>();
  const [messageRequest, setMessageRequest] = useState("");
  const API_BASE_URL_TB = `${baseUrl}:8080`;

  useEffect(() => {
    if (isDeviceID || isObjectID) {
      setDisabled(false);
      setError("");
    } else {
      setDisabled(true);
      setError("Выберите устройство, либо объект из списка");
    }

    if (isDeviceID) {
      const url = `${API_BASE_URL_TB}/api/device/${isDeviceID}/credentials`;

      GetData(token, url)
        .then((data) => {
          if (Object.keys(data).length !== 0) {
            setDeviceToken(data.credentialsId);
          }
        })
        .catch((error) => {
          setError(`Ошибка получения токена устройства: ${error.message}`);
        });
    }
  }, [isDeviceID, isObjectID]);

  console.log(API_BASE_URL_TB);
  const handleChangeData = async (
    objectID: string | null,
    API_BASE_URL: string,
    token: string,
    data: string | ArrayBuffer
  ) => {
    if (deviceToken) {
      console.log(isDeviceID);
      const urlAtrDevice = `${API_BASE_URL}/api/v1/${deviceToken}/attributes`;
      fetch(urlAtrDevice, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ [`img_${index ? index + 1 : 0}`]: data }),
      })
        .then((data) => {
          if (data.status === 200) {
            setMessageRequest("Изображение успешно загружено!");
            setBase64Img(null);
            setIsDeviceID(null);
            setIndex;
            setTimeout(() => setMessageRequest(""), 2000);
          }
        })
        .catch((error) => setError(error.message));
    }
    if (!objectID) return;

    const newPhoto = {
      entity_id: objectID,
      entity_type: "ASSET",
      attribute_type: "SERVER_SCOPE",
      attribute_key: `img_${index ? index : 0}`,
      str_v: data,
    };
    const url = `/api`;

    fetch(url, {
      method: "POST",
      body: JSON.stringify(newPhoto),
    })
      .then((data) => {
        if (data.status === 201) {
          setMessageRequest("Изображение успешно загружено!");
          setBase64Img(null);
          setIsObjectID(null);
          setIndex;
          setTimeout(() => setMessageRequest(""), 2000);
        }
      })
      .catch((error) => setError(error.message));
  };
  if (messageRequest.length !== 0) {
    return <h2 className="section">{messageRequest}</h2>;
  }
  return (
    <section className="section">
      <FBdataSource
        ID_USER={id}
        token={token}
        API_BASE_URL={API_BASE_URL_TB}
        isObject={setIsObjectID}
        isDevice={setIsDeviceID}
        authority={authority}
        setIndex={setIndex}
      />
      <StableDropzone setBase64Img={setBase64Img} />
      {base64Img && (
        <button
          onClick={() =>
            handleChangeData(isObjectID, API_BASE_URL_TB, token, base64Img)
          }
          className="button"
          type="submit"
          disabled={disabled}
        >
          Загрузить на сервер
        </button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </section>
  );
}
