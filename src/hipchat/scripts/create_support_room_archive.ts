import { createWriteStream, WriteStream } from "fs";
import { Transform as Json2csvTransform } from "json2csv";

import { RoomHistory, RoomHistoryResource } from "../resources/room";

// const teamMembers = [
//   "AaronLademann",
//   "ClaireSarsam",
//   "CorwinSheahan",
//   "DustinPauze",
//   "EvanWeible",
//   "GregLittlefield",
//   "JayUdey",
//   "JoelLeibow",
//   "KealJones",
//   "MaxPeterson",
//   "SebastianMalysa",
//   "ToddBeckman"
// ];

const supportRooms = [
  // {
  //   apiId: 2751222,
  //   name: "Support: App Intelligence"
  // },
  // {
  //   apiId: 2752715,
  //   name: "Support: H5 / Dart"
  // },
  // {
  //   apiId: 823785,
  //   name: "Support: UI Platform (UIP)"
  // },
  {
    apiId: 4240765,
    name: "Support: Unified Wdesk"
  }
  // {
  //   apiId: 2750828,
  //   name: "Support: Wdesk SDK"
  // }
];

const date = "2018-07-15T23:59:59.000";
const endDate = "2017-12-13T00:00:00.000";

supportRooms.forEach(room => {
  const hipchatSupportRoomCSVArchive = createWriteStream(
    `output/${room.name.toLowerCase().replace(/(\:\s)|\s/g, "_")}.csv`
  );

  hipchatSupportRoomCSVArchive.on("open", async () => {
    await createHipchatSupportRoomArchive(
      room.apiId,
      hipchatSupportRoomCSVArchive
    );
  });
});

async function createHipchatSupportRoomArchive(
  supportRoomApiId: number,
  supportRoomCSVArchive: WriteStream
) {
  const supportArchiveFields = [
    { label: "id", value: "items.id" },
    {
      label: "support_room_api_id",
      stringify: false,
      value: () => supportRoomApiId.toString()
    },
    { label: "date", value: "items.date" },
    { label: "type", value: "items.type" },
    { label: "from_user_id", value: "items.from.id" },
    { label: "from_user_mention_name", value: "items.from.mention_name" },
    { label: "from_user_name", value: "items.from.name" },
    { label: "message", value: "items.message" },
    {
      label: "raw_json",
      value: (row: RoomHistoryResource) => {
        return JSON.stringify(row.items);
      }
    }
  ];
  const json2csvTransform = new Json2csvTransform({
    fields: supportArchiveFields,
    unwind: ["items"]
  });

  const roomHistory = new RoomHistory(supportRoomApiId);
  const fetchHistoryResponse = await roomHistory.fetchHistory(null, {
    date,
    "end-date": endDate
  });

  fetchHistoryResponse.body.pipe(json2csvTransform).pipe(supportRoomCSVArchive);
}
