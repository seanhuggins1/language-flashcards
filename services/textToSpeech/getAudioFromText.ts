import axios from "axios";
import { LanguageCode } from "../../types";
import decodeBase64MP3Audio from "./decodeBase64MP3Audio";

interface GetAudioFromTextOptions {
  readonly languageCode: LanguageCode;
}

const getAudioFromText = async (
  text: string,
  options?: GetAudioFromTextOptions
) => {
  const url = new URL(
    "https://texttospeech.googleapis.com/v1beta1/text:synthesize"
  );
  url.searchParams.set(
    "key",
    process.env.NEXT_PUBLIC_GOOGLE_TEXT_TO_SPEECH_API_KEY || ``
  );

  const languageCode = options?.languageCode || "EN";

  const response = await axios.post(url.toString(), {
    input: {
      text,
    },
    voice: {
      languageCode,
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  });

  return decodeBase64MP3Audio(response.data.audioContent);
};

export default getAudioFromText;
