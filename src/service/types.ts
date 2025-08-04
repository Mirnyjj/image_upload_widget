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