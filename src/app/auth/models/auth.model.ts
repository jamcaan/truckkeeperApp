export interface User {
  id: number;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Drivers {
  id: number;
  driverFname: string;
  middleInitial: string;
  driverLname: string;
  truckNumber: string;
  licenseNo: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    state: string;
    city: string;
    zipCode: string;
  };
  userId: number;
  active: boolean;
}
