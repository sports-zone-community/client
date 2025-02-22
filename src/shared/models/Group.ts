export interface GroupModel {
  _id: string;
  name: string;
  description: string;
  creator: string;
  members: string[];
  admins: string[];
  createdAt: string;
  updatedAt: string;
  image: string;
}

export interface CreateGroupModel {
  name: string;
  description: string;
  image: File;
}
