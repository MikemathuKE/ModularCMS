"use client";

import React from "react";
import NextImage from "next/image";
import { createStyledComponent } from "@/lib/DynamicStyles";
import { CommonProps } from "@/lib/globals";

export interface AudioProps
  extends React.AudioHTMLAttributes<HTMLAudioElement> {
  src: string;
  controls?: boolean;
}

export const AudioMedia = createStyledComponent<AudioProps>(
  ({ src, controls = true, ...rest }: AudioProps) => (
    <audio src={src} controls={controls} {...rest} />
  ),
  "Audio"
);

export interface VideoProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  controls?: boolean;
  width?: number | string;
  height?: number | string;
}

export const VideoMedia = createStyledComponent<VideoProps>(
  ({ src, controls = true, width, height, ...rest }: VideoProps) => (
    <video
      src={src}
      controls={controls}
      width={width}
      height={height}
      {...rest}
    />
  ),
  "Video"
);

export interface ImageProps extends CommonProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: "fill" | "fixed" | "intrinsic" | "responsive";
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  priority?: boolean;
}

export const ImageMedia = createStyledComponent<ImageProps>(
  ({
    src,
    alt,
    width,
    height,
    layout = "intrinsic",
    objectFit = "cover",
    priority = false,
  }: ImageProps) => (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout={layout}
      objectFit={objectFit}
      priority={priority}
    />
  ),
  "Image"
);
