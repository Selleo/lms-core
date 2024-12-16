export const FileUploadLoading = () => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-white items-center justify-center">
      <p className="text-neutral-950 body-sm">Uploading...</p>
      <p className="text-neutral-600 details">This make take some time</p>
    </div>
  );
};
