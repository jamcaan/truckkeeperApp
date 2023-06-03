interface User {
  id: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  username: string;
  password: string;
  active: boolean;
}
