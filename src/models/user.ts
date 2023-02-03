import { DataTypes, Model } from "https://deno.land/x/denodb@v1.2.0/mod.ts";

export class User extends Model {
  static table = 'Users';
  static fields = {
    id: {
      type: DataTypes.BIG_INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  };

  static timestamps = true;
}