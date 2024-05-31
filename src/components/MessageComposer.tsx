import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { MessageComposerPropTypes } from "../types";
import { useMemo } from "react";
import { faCamera, faVideo } from "@fortawesome/free-solid-svg-icons";

export default function MessageComposer({ sendMessage, message, setMessage, openMediaCapture, attachments }: MessageComposerPropTypes) {
  const buttonClassName = "p-2 mx-2 rounded-full hover:bg-gray-100"

  const handlePhotoClick = () => {
  }

  const renderAttachments = useMemo(() => {
    if (attachments?.length) {
      return attachments.map((item) => (
        <div className="mx-2 my-1">
          <img width="100" height="100" src={item} />
        </div>
      ))
    }
  }, [attachments]);

  return (
    <div>
      <div className="flex flex-row-reverse">
        {renderAttachments}
      </div>
      <div className="h-14 flex p-2 items-center justify-evenly">
        <button className={buttonClassName} onClick={openMediaCapture}>
          <FontAwesomeIcon icon={faVideo} width={25} height={25} />
        </button>
        <button className={buttonClassName} onClick={handlePhotoClick}>
          <FontAwesomeIcon icon={faCamera} width={25} height={25} />
        </button>
        <form className="flex flex-grow" onSubmit={sendMessage}>
          <input
            type="text"
            multiple
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white p-2 flex-grow border-gray-100 rounded-lg border mr-2"
          />
          <button type="submit" className="bg-sky-50 font-bold px-3">Send</button>
        </form>
      </div>
    </div>
  )
}
