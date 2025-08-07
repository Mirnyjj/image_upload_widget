'use client'

import { useEffect, useState } from "react";
import { GetHomeParams } from "../../service/GetHomeParams";
import type { Data } from "../../service/types";
import { GetData } from "../../service/GetData";

type Props = {
  API_BASE_URL: string;
  token: string;
  ID_USER: string;
  isObject: React.Dispatch<React.SetStateAction<string | null>>;
  isDevice: React.Dispatch<React.SetStateAction<string | null>>;
  authority: string
  setIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export default function FBdataSource({API_BASE_URL, token, ID_USER, isObject, isDevice, authority, setIndex}: Props){
    const [isData, setIsData] = useState<Data | null>(null);
    const [objectID, setObjectID] = useState<string | null>(null);
    const [deviceID, setDeviceID] = useState<string | null>(null);


const fetchDataAttr = async(deviceId: string, controller: AbortController) => {
  const type = deviceID ? 'DEVICE' : 'ASSET';
   const url = `${API_BASE_URL}/api/plugins/telemetry/${type}/${deviceId}/keys/attributes`;
   const responce: string[] = await GetData(token, url, controller.signal);
   if(responce.length !== 0){
     const imgAttrSort = responce.filter(item => item.includes('img'))?.sort();
     if(imgAttrSort.length !== 0){
       const imgIndex = +imgAttrSort[imgAttrSort.length - 1].split('_')[1];
       setIndex(imgIndex);
     }


   }
}

useEffect(() => {
      const controller = new AbortController();
      
      if(objectID){
        isObject(objectID)
        GetData(token, `${API_BASE_URL}/api/asset/${objectID}`).then((data) => console.log(data))
        fetchDataAttr(objectID, controller)
      } else if(deviceID){
            isDevice(deviceID)
        fetchDataAttr(deviceID, controller)
      }
       return () => {
      controller.abort();
    };
}, [objectID, deviceID])

    useEffect(() => {
    const controller = new AbortController();
    if (token) {
      GetHomeParams(token, API_BASE_URL, ID_USER,authority, controller.signal)
        .then(data => {
          if (data && data.objects) {
            setIsData(data)
          }
        })
        .catch(error => {
          console.log(error.message)
        });
    }
    return () => {
      controller.abort();
    };
  }, [token]);


  if(!isData){
    return <div>Loading...</div>
  }
    return <div>
      {isData.objects.length !== 0 && 
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <h2>Выберите объект из списка</h2>
    <select name="objects" id="objects" onChange={(e) => {setObjectID(e.target.value); setDeviceID(null)}} defaultValue='Выберите из списка'>
      {isData.objects.map(item => 
      <option value={item.id} key={item.id}>{item.name}</option>)}
    </select>
      </div>}
      {isData.devices.length !== 0 && 
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <h2>Выберите устройство из списка</h2>
        <select name="devices" id="devices" onChange={(e) => {setDeviceID(e.target.value); setObjectID(null)}} defaultValue='Выберите из списка'>
          {isData.devices.map(item => 
          <option value={item.id} key={item.id}>{item.name}</option>)} 
          </select>
        </div>}
        </div>
}

