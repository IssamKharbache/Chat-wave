"use client";
import { useSettingsContext } from "@/context/provider/settings-context";
import { Icon } from "@iconify/react";
import { Button, Typography } from "antd";

const SideBarButton = () => {
  const { setSettings } = useSettingsContext();
  return (
    <Button
      type="text"
      onClick={() =>
        setSettings((prev) => ({ ...prev, isSideBarOpen: !prev.isSideBarOpen }))
      }
    >
      <Icon icon="mingcute:menu-line" width="28px" />
    </Button>
  );
};

export default SideBarButton;
