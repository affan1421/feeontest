import { Dayjs } from "dayjs";

export interface TransportationStudent {
  classId: string;
  studentName: string;
  vehicleId: string;
  route: string;
  transportSchedule: string;
}

export interface RouteDetail {
  schoolId: string;
  routeName: string;
  startingPoint?: string;
  stops: {
    data: {
      stop: string;
      oneWay: number | undefined;
      roundTrip: number | undefined;
    };
  }[];
}

export interface DriverInfo {
  _id?: string;
  name: string;
  contactNumber: number | null;
  emergencyNumber: number | null;
  drivingLicense: string;
  aadharNumber: number | null;
  bloodGroup: string;
  address: string;
  schoolId: string;
  attachments: string[];
}

interface Attachments {
  name: string;
  url: string;
}

interface Driver {
  _id: string;
  name: string;
}

export interface VehicleInfo {
  _id?: string;
  registrationNumber: string;
  assignedVehicleNumber: number | null;
  seatingCapacity: number | null;
  taxValid: string;
  fcValid: string;
  vehicleMode: string;
  schoolId: string;
  attachments: string[];
}

export interface StudentInfo {
  _id?: string;
  schoolId: string;
  sectionId: string;
  studentId: string;
  transportSchedule: "pickup" | "drop" | "both" | undefined; // Assuming it's one of these values
  selectedRouteId: string;
  stopId: string;
  feeMonths: string[];
  status: string;
  monthlyFees: number | null;
}
