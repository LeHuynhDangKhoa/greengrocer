export type Anchor = "top" | "left" | "bottom" | "right";

export const toggleDrawer =
  (
    anchor: Anchor,
    open: boolean,
    drawerState?: {
      top: boolean;
      left: boolean;
      bottom: boolean;
      right: boolean;
    },
    setDrawerState?: React.Dispatch<
      React.SetStateAction<{
        top: boolean;
        left: boolean;
        bottom: boolean;
        right: boolean;
      }>
    >
  ) =>
  (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    if (drawerState && setDrawerState)
      setDrawerState({ ...drawerState, [anchor]: open });
  };
