  export interface Drivers {
    id: string;
    firstName: string;
    lastName: string;
    truckNumber: string;
    licenseNo: string;
    phoneNumber: string;
    email: string;
    address: {
      street: string;
      state: string;
      city: string;
      zipCode: string;
    },
    active: boolean
    userId?: string;
  }
