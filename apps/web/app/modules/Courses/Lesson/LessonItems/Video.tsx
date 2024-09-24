export default function Video({ url }: { url: string }) {
  const isDev = process.env.NODE_ENV === "development";

  //TODO: add some demo video for local dev or load it from the file
  const src = isDev
    ? "https://file-examples.com/storage/fe40e015d566f1504935cfd/2017/04/file_example_MP4_480_1_5MG.mp4"
    : url;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <video width="100%" height="auto" controls className="rounded-lg">
        <source src={src} />
        <track kind="captions" />
      </video>
    </div>
  );
}
