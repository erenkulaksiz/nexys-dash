import Link from "next/link";

import Codeblock from "@/components/Codeblock";
import Switch from "@/components/Switch";
import { Log } from "@/utils";
import { setCurrentProject, useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import { projectSetting } from "@/utils/service/project/setting";

export default function API() {
  const validatedUser = useAuthStore((state) => state.validatedUser);
  const project = useProjectStore((state) => state.currentProject);

  async function onLocalhostAccessChange() {
    const res = await projectSetting({
      id: project?._id?.toString() ?? "",
      uid: validatedUser?.uid ?? "",
      localhostAccess: !project?.localhostAccess,
    });
    if (!res) {
      Log.error("Failed to update project settings");
      return;
    }
    setCurrentProject({
      ...project,
      localhostAccess: !project?.localhostAccess,
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 gap-4">
      <div className="flex flex-col gap-2 items-start">
        <div className="flex flex-col">
          <label htmlFor="projectName">Public API Key</label>
          <div className="flex flex-row gap-2">
            <Codeblock data={project?.publicKey}>
              {project?.publicKey}
            </Codeblock>
          </div>
          <span className="text-neutral-500 text-sm">
            This API key should be used with Nexys Client Library.{" "}
            <Link href="https://docs.nexys.app" target="_blank">
              <span className="text-blue-600 font-semibold">Visit Docs</span>
            </Link>
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            <Switch
              id="test"
              value={project?.localhostAccess}
              onChange={onLocalhostAccessChange}
            />
            <span>Allow Localhost Access </span>
          </div>
          <span className="text-neutral-500 text-sm">
            Enables localhost access. This is useful for testing your API, also
            dangerous since anyone can access your API key from localhost. Make
            sure to create new project for your testing purposes.
          </span>
        </div>
      </div>
    </div>
  );
}
