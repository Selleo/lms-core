import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

type PresentationProps = {
  url: string;
};

export default function Presentation({ url }: PresentationProps) {
  const docs = [
    {
      uri: url,
      fileType: "pptx",
      fileName: "Presentation",
    },
  ];

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
