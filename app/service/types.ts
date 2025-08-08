export type ObjectData = {
  id: string;
  name: string;
  type: string;
  typeObj?: string;
  children?: ObjectData[];
};

export type Data = {
  objects: ObjectData[];
  devices: ObjectData[];
  root: Root;
};

type IEntityTypeAndId = {
  id: string;
  entityType: string;
};

export type Root = {
  additionalInfo: string | null;
  createdTime: number;
  customerId: IEntityTypeAndId;
  id: IEntityTypeAndId;
  type: string;
  name: string;
  label: string | null;
  tenantId: IEntityTypeAndId;
};

export type FetchData = {
  data: Root[];
  hasNext: boolean;
  nextPageLink: boolean | null;
};

export type Attribute = {
  entity_id: string;
  entity_type: 'DEVICE' | 'ASSET';
  attribute_type: 'SERVER_SCOPE'| 'CLIENT_SCOPE' | 'SHARED_SCOPE';
  attribute_key: string;
  bool_v: boolean | null;
  str_v: string;
  long_v: number | null;
  dbl_v: number | null;
  json_v: string | null;
  last_update_ts: number;
}

export type AttributeValue = {
      lastUpdateTs: number;
    key: string;
    value: string | number;
}