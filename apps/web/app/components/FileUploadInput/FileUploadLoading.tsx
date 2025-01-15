export const FileUploadLoading = () => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
      <p className="body-sm text-neutral-950">Uploading...</p>
      <p className="details text-neutral-600">This make take some time</p>
    </div>
  );
};
