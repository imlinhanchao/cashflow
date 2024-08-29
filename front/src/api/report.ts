import { DataSource } from "./data";

export class Report {
  name = '';
  description = '';
  datasrcId?: string;
  datasrc: DataSource = new DataSource();
  options: string = '';
  public: boolean = false;
}

export interface IReport extends Report {
  id: string;
  createAt: string;
  updateAt: string;
}