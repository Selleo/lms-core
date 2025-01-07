import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

type PresentationProps = {
  url: string;
  isExternalUrl?: boolean;
};

export default function Presentation({ url, isExternalUrl }: PresentationProps) {
  const docs = [
    {
      uri: url,
      fileType: "pptx",
      fileName: "Presentation",
    },
  ];

  if (isExternalUrl) {
    return (
      <iframe title="Presentation" src={`${url}/embed`} className="aspect-video" allowFullScreen />
    );
  }

  return (
    <DocViewer
      documents={docs}
      pluginRenderers={DocViewerRenderers}
      config={{
        header: {
          disableFileName: false,
        },
      }}
    />
  );
}
