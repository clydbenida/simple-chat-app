import { createRef, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { MediaCaptureDialogProps } from "../types";

export default function MediaCaptureDialog(props: MediaCaptureDialogProps) {
  const [noMedia, setNoMedia] = useState(true);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const videoRef = createRef<HTMLVideoElement>();

  const handleCancelClick = () => {
    props.closeMediaCapture();
  }

  const handleCaptureClick = () => {
    const domCanvas = document.createElement("canvas")
    const canvasCtx = domCanvas.getContext("2d");

    if (videoRef.current) {
      domCanvas.width = videoRef.current.videoWidth!;
      domCanvas.height = videoRef.current.videoHeight!;

      canvasCtx?.drawImage(videoRef.current, 0, 0);

      console.log(domCanvas)

      const canvasDataUrl = domCanvas.toDataURL();
      props.setAttachments((prev) => {
        if (prev?.length) {
          return [...prev, canvasDataUrl]
        }

        return [canvasDataUrl]
      });
    }
  }

  useEffect(() => {
    const intitializeVideo = async () => {
      try {
        const resUserMedia = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(resUserMedia);

        if (videoRef.current) {
          videoRef.current.srcObject = resUserMedia;
        }

      } catch (err) {
        console.log(err)
        setNoMedia(true);
      }

    }

    if (props.open && videoRef.current !== undefined) {
      intitializeVideo();
    }
  }, [props.open, videoRef.current]);

  useEffect(() => {
    if (!props.open && videoRef.current !== undefined) {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }, [props.open]);

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <div>
          Video content
          <video autoPlay ref={videoRef} />
        </div>

        <button onClick={handleCancelClick}>Cancel</button>
        <button onClick={handleCaptureClick}>Capture</button>

      </DialogContent>
    </Dialog>
  );
}
