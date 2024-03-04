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

// export interface Drivers {
//   id: number;
//   driverFname: string;
//   middleInitial: string;
//   driverLname: string;
//   truckNumber: string;
//   licenseNo: string;
//   phoneNumber: string;
//   email: string;
//   address: {
//     street: string;
//     state: string;
//     city: string;
//     zipCode: string;
//   };
//   userId: number;
//   active: boolean;
// }

export interface Credentials {
  username: string;
  password: string;
}

export interface HttpResponseObject<T> {
  success: boolean;
  message?: string;
  data: T | undefined;
  status: number;
}

export interface HttpResponse<T> {
  data: T | undefined;
}

// export interface HttpLoginResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     accessToken: string;
//     userId: string;
//     username: string;
//     userRole: string;
//     expiresIn: number;
//   };
// }

export interface HttpLoginResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  userId?: string;
  username?: string;
  userRole?: string;
  expiresIn?: number;
}

export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  count?: number;
  data:T;
}
