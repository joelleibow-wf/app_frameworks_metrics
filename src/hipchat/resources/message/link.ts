import { LinkResource } from "../link";
import { TwitterStatusResource, TwitterUserResource } from "../twitter";
import { VideoResource } from "../video";

export interface LinkResource {
  image: {
    image: string;
    name: string;
  };
  twitter_user: TwitterUserResource;
  twitter_status: TwitterStatusResource;
  url: string;
  video: VideoResource;
  link: LinkResource;
  type: "image" | "video" | "link" | "twitter_status" | "twitter_user";
}
