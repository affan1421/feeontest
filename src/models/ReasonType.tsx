import { Dayjs } from "dayjs";

export interface Reason {
  name: string;
  schoolId: string;
}

export interface ReasonTypeModel {
  id?: string | null;
  _id?: string | null;
  reason: string;
  schoolId?: string;
}
