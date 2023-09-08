import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useProjectStore } from "@/stores/projectStore";

export default function Telegram() {
  const project = useProjectStore((state) => state.currentProject);
  const [editingBotId, setEditingBotId] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 gap-4">
      <div className="flex flex-col gap-2 items-start">
        <div className="flex flex-col w-full">
          <label htmlFor="projectName">Telegram Bot Id</label>
          <div className="flex flex-row items-center gap-2 w-full">
            <Input
              id="test"
              height="h-10"
              containerClassName="w-full"
              value="not set"
            />
            <Button className="px-2">edit</Button>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="projectName">Telegram Target Id</label>
          <div className="flex flex-row items-center gap-2 w-full">
            <Input
              id="test"
              height="h-10"
              containerClassName="w-full"
              value="not set"
            />
            <Button className="px-2">edit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
