import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect, Suspense } from "react";
import { SendVideoForm } from "./forms/SendVideoForm";
import { GenerateVideoList } from "./videoList/GenerateVideoList";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Dashboard!" },
  ];
};

export default function DashboardPage() {
  const [videoList, setVideoList] = useState<File[]>([]);

  useEffect(() => {
    videoList.forEach((vod: File) => {
      return URL.revokeObjectURL(URL.createObjectURL(vod));
    });
  }, [videoList]);

  return (
    <div className="flex w-full items-center justify-center">
      <SendVideoForm setVideoList={setVideoList} />
      <div className="relative w-[300px] h-[300px] mx-auto mt-20">
        <Suspense fallback={<p>Loading ...</p>}>
          <GenerateVideoList videoList={videoList} />
        </Suspense>
      </div>
    </div>
  );
}
