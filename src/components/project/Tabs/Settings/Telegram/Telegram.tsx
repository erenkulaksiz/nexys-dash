import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function Telegram() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 gap-4">
      <div className="flex flex-col gap-2 items-start">
        <div className="flex flex-col w-full">
          <label htmlFor="projectName">Telegram API Key</label>
          <div className="flex flex-row items-center gap-2 w-full">
            <Input id="test" height="h-10" className="w-full" value="not set" />
            <Button className="px-2">edit</Button>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="projectName">Telegram API Key</label>
          <div className="flex flex-row items-center gap-2 w-full">
            <Input id="test" height="h-10" className="w-full" value="not set" />
            <Button className="px-2">edit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
