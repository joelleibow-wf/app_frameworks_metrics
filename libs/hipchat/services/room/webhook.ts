import fetch from "node-fetch";

import { HipchatService } from "../service";

import { CreateRoomWebHook } from "../../resources/room";

export class WebHook extends HipchatService {
  constructor(roomId: string | number, key: string) {
    super(roomId);

    this.pathName = `v2/room/${roomId}/extension/webhook/${key}`;
  }

  public async create(body: CreateRoomWebHook) {
    return await fetch(this.createResourceUrl(), {
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json"
      },
      method: "PUT"
    });
  }
}
