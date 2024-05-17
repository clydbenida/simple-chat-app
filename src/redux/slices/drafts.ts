import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AttachmentTypes, MessageType } from "../../types";

export interface DraftItem extends Omit<MessageType, "participant_id" | "message_id" | "createdAt" | "updatedAt" | "read_status"> {
  attachments: AttachmentTypes[];
}

const initialState: DraftItem[] = [];

export const draftSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    addDraftItem: (state, action: PayloadAction<DraftItem>) => {
      state.push(action.payload)
    }
  },
});

export const { addDraftItem } = draftSlice.actions;

export default draftSlice.reducer;
