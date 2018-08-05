import { DynamoDBModel } from "../../framework";
import { InstallableResource } from "../resources/installable";

export class Installable extends DynamoDBModel<InstallableResource> {
  protected tableName = process.env.DYNAMODB_INSTALLS_TABLE;
}
