export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  role: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
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

export interface HttpResponseObject<T> {
  success: boolean;
  message?: string;
  data?: T | undefined;
  status: number;
}
