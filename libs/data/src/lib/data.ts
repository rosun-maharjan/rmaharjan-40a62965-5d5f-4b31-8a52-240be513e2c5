export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  orgId: string;
}

export interface Organization {
  id: string;
  name: string;
  parentOrgId?: string; 
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  orgId: string;
  creatorId: string;
}

export interface Vet {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

export enum PetSpecies {
  Dog = 'Dog',
  Cat = 'Cat',
  Bird = 'Bird',
  Rabbit = 'Rabbit',
  Other = 'Other'
}

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  ownerName: string;
  lastVisit?: string; // Using string for ISO dates is often easier for JSON
}