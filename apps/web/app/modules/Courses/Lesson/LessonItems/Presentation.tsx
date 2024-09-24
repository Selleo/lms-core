import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

export default function Presentation({ url }: { url: string }) {
  const isDev = process.env.NODE_ENV === "development";

  const docs = [
    {
      //TODO: add some demo presentation for local dev or load it from the file
      uri: isDev
        ? "https://res.cloudinary.com/dvbqyxjv3/raw/upload/v1727089130/best_precka_ever_wzg4hc.pptx"
        : url,
      fileType: "pptx",
      fileName: "Presentation",
    },
  ];

  return (
    <div className="w-full h-full flex justify-center items-center">
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
            disableFileName: false,
          },
        }}
      />
    </div>
  );
}
