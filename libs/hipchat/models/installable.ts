import { DynamoModel } from "../../framework";
import { InstallableResource } from "../resources/installable";

export class Installable extends DynamoModel<InstallableResource> {
  protected tableName = process.env.DYNAMODB_INSTALLS_TABLE;
}
