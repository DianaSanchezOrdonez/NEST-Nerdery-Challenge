export enum Role {
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
}

export type RoleType = keyof typeof Role;
