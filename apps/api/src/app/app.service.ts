import { Injectable } from '@nestjs/common';
import { Vet } from '@turbo-vets/data';
import { Pet, PetSpecies } from '@turbo-vets/data';

@Injectable()
export class AppService {
  private pets: Pet[] = [
    { id: '101', name: 'Buddy', species: PetSpecies.Dog, breed: 'Golden Retriever', age: 3, ownerName: 'Alice' },
    { id: '102', name: 'Mittens', species: PetSpecies.Cat, breed: 'Tabby', age: 5, ownerName: 'Bob' }
  ];

  getVets(): Vet[] {
    return [
      { id: '1', name: 'Dr. Smith', specialty: 'Surgery', email: 'smith@turbovets.com' },
      { id: '2', name: 'Dr. Brown', specialty: 'Dermatology', email: 'brown@turbovets.com' }
    ];
  }

    getPets(): Pet[] {
    return this.pets;
  }

  addPet(newPet: Pet): Pet {
    this.pets.push(newPet);
    return newPet;
  }
}