import Tooltip from "@/components/Tooltip";
import View from "@/components/View";
import { ReactNode, useState, useEffect } from "react";
import { MdContentCopy, MdCheck } from "react-icons/md";

export default function Codeblock({
  children,
  data,
  disableCopy = false,
}: {
  children?: ReactNode;
  data?: string;
  disableCopy?: boolean;
}) {
  const [copied, setCopied] = useState<boolean>(false);

  function onCopy() {
    if (copied || disableCopy) return;
    navigator.clipboard.writeText(
      typeof data == "object" ? JSON.stringify(data) : data || ""
    );
    setCopied(true);
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  return (
    <div className="group border-[1px] p-2 w-full relative rounded-lg border-neutral-200 dark:border-neutral-900">
      <View viewIf={!!children}>
        <View.If>{children}</View.If>
        <View.Else>Empty</View.Else>
      </View>
      <div className="group-hover:flex hidden absolute right-2 top-[6px] items-center">
        <Tooltip outline content={copied ? "Copied!" : "Copy"}>
          <button
            className="p-1 rounded-lg border-[1px] border-neutral-200 dark:border-neutral-900"
            onClick={onCopy}
          >
            <View viewIf={copied}>
              <View.If>
                <MdCheck />
              </View.If>
              <View.Else>
                <MdContentCopy />
              </View.Else>
            </View>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
