import { Children } from "react";

import type { ViewProps, ViewIfElseProps } from "./View.types";

export default function View({ viewIf, children }: ViewProps) {
  if (Children.count(children) > 2)
    throw new Error(
      "View component can only have 2 children, View.If and View.Else"
    );
  if (viewIf === true) return <>{Children.toArray(children)[0]}</>;
  return <>{Children.toArray(children)[1]}</>;
}

function ViewIf({ children, hidden, visible }: ViewIfElseProps) {
  if (typeof hidden == null && typeof visible == null) return <>{children}</>;
  if (hidden === true) return <></>;
  if (visible === false) return <></>;
  return <>{children}</>;
}

View.If = ViewIf;
View.Else = ViewIf;
