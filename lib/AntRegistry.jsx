"use client";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { useServerInsertedHTML } from "next/navigation";
import { useMemo, useRef } from "react";

const StyledComponentRegistry = ({ children }) => {
  const cache = useMemo(() => createCache(), []);
  const isServedInserted = useRef(false);

  useServerInsertedHTML(() => {
    if (isServedInserted.current) {
      return;
    }
    isServedInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default StyledComponentRegistry;
