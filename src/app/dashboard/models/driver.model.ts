export interface Drivers {
  id?: string;
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
  };
  active?: boolean;
  userId?: string;
}

export interface DriversTtest {
  id?: string;
  first_name: string;
  last_name: string;
  truck_number: string;
  license_number: string;
  phone_number: string;
  email: string;
  address: {
    street: string;
    state: string;
    city: string;
    zipCode: string;
  };
  active?: boolean;
  userId?: string;
}
