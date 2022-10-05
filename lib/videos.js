import videosData from "../data/videos.json";
import { getMyListVideos, getWatchedVideos } from "./db/hasura";

const fetchVideos = async (URL) => {
  const BASE_URL = "https://youtube.googleapis.com/youtube/v3";
  const response = await fetch(
    `${BASE_URL}/${URL}&key=${process.env.YOUTUBE_API_KEY}`
  );
  return await response.json();
};

export const getCommonVideos = async (URL) => {
  // https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=dc%20trailer&key=[YOUR_API_KEY]

  try {
    const isDev = process.env.DEVELOPMENT;
    const data = isDev === "true" ? videosData : await fetchVideos(URL);

    if (data?.error) {
      console.error("Youtube API Error", data.error);
      return [];
    }

    return data?.items.map((item) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        id,
        title: snippet.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (e) {
    console.log("Something went wrong with the video library", e);
    return [];
  }
};

export const getVideos = (search) => {
  const URL = `search?part=snippet&maxResults=25&q=${search}`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  //GET videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&maxResults=25";

  return getCommonVideos(URL);
};

export const getVideoById = (id) => {
  //GET https://youtube.googleapis.com/youtube/v3/&key=[YOUR_API_KEY] HTTP/1.1

  if (process.env.DEVELOPMENT === "true") {
    const item = videosData.items.find((item) => item.id.videoId === id);

    return [{ ...item.snippet, statistics: { viewCount: "" } }];
  }

  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}`;

  return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (token, userId) => {
  const videos = await getWatchedVideos(token, userId);
  return videos?.map((video) => ({
    id: video.videoId,
    imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }));
};

export const getMyList = async (token, userId) => {
  const videos = await getMyListVideos(token, userId);
  return videos?.map((video) => ({
    id: video.videoId,
    imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }));
};
