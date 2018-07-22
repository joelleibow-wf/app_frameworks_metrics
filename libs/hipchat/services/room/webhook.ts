import fetch from "node-fetch";

import { HipchatService } from "../service";

import { CreateRoomWebHook } from "../../resources/room";

export class WebHook extends HipchatService {
  private url: string;

  constructor(roomId: number, key: string) {
    super(roomId);

    this.url = `${this.origin}/v2/room/${roomId}/extension/webhook/${key}`;
  }

  public async create(body: CreateRoomWebHook) {
    return await fetch(this.url, {
      body: JSON.stringify(body),
      method: "PUT"
    });
  }
}
