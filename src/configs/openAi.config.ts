import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

export const DETAIL_PHOTO_DALLE = {
  NUMB: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  SIZE: {
    SIZE1: '256x256',
    SIZE2: '512x512',
    SIZE3: '1024x1024'
  }
}
