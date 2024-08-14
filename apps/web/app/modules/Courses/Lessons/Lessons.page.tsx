import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

export default function LessonsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Lessons</h1>
        <Button>Create lesson</Button>
      </div>
      <div className="grid grid-cols-4 gap-4 w-fit">
        <Card className="overflow-hidden">
          <CardHeader className="p-0 mb-2 relative">
            <div className="w-full overflow-hidden rounded-t-lg">
              <img
                src="https://via.assets.so/game.png?id=2&q=95&w=720&h=480&fit=fill"
                className="object-cover w-full"
                alt=""
              />
            </div>
            <div className="absolute bottom-0 left-0 px-6 py-2 w-full bg-gradient-to-b from-background/50 to-background">
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
