const decodeBase64MP3Audio = (encodedAudio: string) =>
  new Audio(`data:audio/mp3;base64,${encodedAudio}`);

export default decodeBase64MP3Audio;
