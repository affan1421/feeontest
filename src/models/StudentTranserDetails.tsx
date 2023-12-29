export interface TcResponseData {
    countsByType: {
      typeResult: {
        tcType: string;
        total: number;
        pending: number;
        approved: number;
        rejected: number;
      }[];
    };
    reasonsData: {
      reasonResult: {
        reason: string;
        count: number;
      }[];
    };
    classData: {
      classResult: {
        className: string;
        count: number;
      }[];
    };
    tcsCount: number;
    classCount: number;
    reasonCount: number;
  }