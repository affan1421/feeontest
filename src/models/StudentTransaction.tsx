export interface StudentTransaction {
  _id: string;
  date: string;
  dueAmount: number;
  paidAmount: number;
  netAmount: number;
  status: string;
  studentId: {
    _id: string;
    name: string;
  };
}
