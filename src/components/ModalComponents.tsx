"use client";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";
import React, { useState, useEffect, useRef } from "react";

import { ModalManager } from "@/lib/ModalManager";

interface CustomChildrenProps extends CommonProps {
  children?: React.ReactNode;
}

export const ModalBackdrop = createStyledComponent<CustomChildrenProps>(
  ({ children, ...props }: CustomChildrenProps) => (
    <div {...props}>{children}</div>
  ),
  "ModalBackdrop"
);

export interface ModalProps extends CustomChildrenProps {
  id: string;
}

export const Modal = createStyledComponent<CustomChildrenProps>(
  ({ id, children, ...props }: ModalProps) => {
    const [visible, setVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<Record<string, any>>({});

    const open = () => setVisible(true);
    const close = () => setVisible(false);

    // Register with the global manager
    useEffect(() => {
      ModalManager.register(id, { open, setData, close });
      return () => ModalManager.unregister(id);
    }, [id]);

    // Close on click outside
    useEffect(() => {
      if (!visible) return;
      const handleClickOutside = (event: MouseEvent) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(event.target as Node)
        ) {
          close();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [visible]);

    if (!visible) return null;

    return (
      <ModalBackdrop>
        <div ref={modalRef} {...props}>
          {/* Close Button */}
          <button
            onClick={close}
            className="absolute top-3 right-3 text-gray-600 hover:text-black dark:hover:text-white"
          >
            ✕
          </button>
          {children}
        </div>
      </ModalBackdrop>
    );
  },
  "Modal"
);
