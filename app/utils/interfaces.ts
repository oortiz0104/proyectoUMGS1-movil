export interface PC {
  _id: string
  brand: string
  model: string
  serialNumber: string
  purchaseOrder?: string
  ubication: ubication
  state: string
  deleted: boolean
}

export interface ubication {
  _id: string
  cellarNumber: Number
  shelve: string
  occupied: boolean
  deleted: boolean
}

export interface PCRegister {
  _id: string
  check_in: string
  check_out: string
  user: User
  pc: PC
}

export interface User {
  _id: string
  name: string
  surname: string
  username: string
  password: string
  email: string
  phone: string
  role: string
}

