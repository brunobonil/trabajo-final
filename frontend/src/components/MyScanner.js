import { BrowserMultiFormatReader } from '@zxing/library';
import React, { useRef, useState, useEffect } from 'react';


export const BarcodeScanner = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const reader = useRef(new BrowserMultiFormatReader());
  
    useEffect(() => {
      if (!videoRef.current) return;
      const currentReader = reader.current;
      currentReader.decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: 'environment',
          },
        },
        videoRef.current,
        (result, error) => {
          if (result) console.log(result);
          if (error) console.log(error);
        }
      );
      return () => {
        currentReader.reset();
      }
    }, [videoRef]);
    return <video ref={videoRef}/>;
  };

export default BarcodeScanner;

  