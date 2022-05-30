export interface ISerializable {
  toJSON(): any;
}

export abstract class ASerializable implements ISerializable {
  abstract toJSON(): any;
}
