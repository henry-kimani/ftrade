
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";

import Editor from "@/components/notes/Editor";
import CreateNoteForm from "@/components/forms/CreateNoteForm";
import { getNote } from "@/db/queries";
import { format } from "date-fns";

export default async function Notes({ tradeId }: { tradeId: string }) {

  const noteData = await getNote(tradeId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notes</CardTitle>
        {noteData &&
          <CardDescription className="grid">
            {noteData.createdAt && <div>Created At: {format(noteData.createdAt, "PP")}</div>}
            {noteData.updatedAt && <div>Last Updated: {format(noteData.updatedAt, "PP")}</div>}
          </CardDescription>
        }
      </CardHeader>
      <CardContent>
        { !noteData ?
          <CreateNoteForm tradeId={tradeId} /> :
          <Editor 
            noteId={noteData.noteId} 
            note={noteData.note} 
            tradeId={tradeId}
          />
        }
      </CardContent>
    </Card>
  );
}

