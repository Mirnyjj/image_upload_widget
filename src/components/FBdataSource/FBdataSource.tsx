import { useEffect, useState } from "react";
import { GetHomeParams } from "../../service/GetHomeParams";
import type { Data } from "../../service/types";

export default function FBdataSource(){
    const [isData, setIsData] = useState<Data | null>(null)
    const urlRes = window.location.href;
    const url = new URL(urlRes)
    if(url.pathname.length === 0 && url.search.length === 0) return
    const ID_USER = url.pathname.slice(1, url.pathname.length - 1);
    const token = url.search.slice(7);
    const API_BASE_URL = 'http://localhost:8080'
    useEffect(() => {
    const controller = new AbortController();
    if (token) {
      GetHomeParams(token, API_BASE_URL, ID_USER, controller.signal)
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
    return <div>{isData.objects.length !== 0 && <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <h2>Выберите объект из списка</h2>
    <select name="objects" id="objects">{isData.objects.map(item => <option value={item.id}>{item.name}</option>)}<option selected hidden>Выберите из списка</option></select>
    
        </div>
    }{isData.devices.length !== 0 && <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <h2>Выберите устройство из списка</h2>
        <select name="devices" id="devices">{isData.devices.map(item => <option value={item.id}>{item.name}</option>)} <option selected hidden>Выберите из списка</option></select>
        </div>}</div>
}