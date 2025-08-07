import { GetData } from "./GetData";
import type { Data, FetchData, Root } from "./types";

export const GetHomeParams = async (
  token: string,
  url: string,
  fetchCustomerId: string,
  authority: string,
  signal?: AbortSignal,
): Promise<Data> => {
  const data = {
    root: {} as Root,
    devices: [],
    objects: [],
  };

  try {
 
    const customerPath = authority === 'tenant' ? 'tenant' :`${authority}/${fetchCustomerId}`;

    const URL_ASSETS = `${url}/api/${customerPath}/assets?limit=100`;
    const URL_DEVICES = `${url}/api/${customerPath}/devices?limit=1000`;

    const allDataObjects: FetchData = await GetData(token, URL_ASSETS, signal);
    const allDataDevices: FetchData = await GetData(token, URL_DEVICES, signal);
    // console.log(allDataDevices);
    if (allDataObjects?.data && allDataObjects?.data.length !== 0) {
      const rootObj = allDataObjects.data.find(item => item.type === 'root');
      Object.assign(data, {root: rootObj});
      const objects = allDataObjects.data
        .filter(item => item.type !== 'area' && item.type !== 'root')
        .map(item => ({
          name: item.name,

          // name: item.name,
          id: item.id.id,
          typeObj: item.type ? item.type : '',
          type: item.id.entityType,
        }));
      Object.assign(data, {objects});
    }
    if (allDataDevices?.data && allDataDevices?.data.length !== 0) {
      const devices = allDataDevices.data
        .filter(item => item.type !== 'Alarm')
        .map(item => ({
          name: item.name,
          // name: item.name,
          id: item.id.id,
          typeObj: item.type ? item.type : '',
          type: item.id.entityType,
        }));
      Object.assign(data, {devices});
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    return data;
  }
};