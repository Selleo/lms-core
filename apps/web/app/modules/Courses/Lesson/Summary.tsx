import { Card, CardContent } from "~/components/ui/card";

export default function Summary() {
  return (
    <Card className="w-full rounded-none max-w-[410px] mr-[-24px] mt-[-24px] lg:block hidden">
      <CardContent className="p-4 flex flex-col">Summary</CardContent>
    </Card>
  );
}
