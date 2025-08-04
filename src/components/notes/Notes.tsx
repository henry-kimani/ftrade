
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";

import Editor from "@/components/notes/Editor";
import CreateNoteForm from "@/components/forms/CreateNoteForm";
import { getNote } from "@/db/queries";
import { format } from "date-fns";
import { AlarmClockCheck, AlarmClockPlus } from "lucide-react";
import { isCurrentUserAdmin } from "@/lib/dal";

export default async function Notes({ tradeId }: { tradeId: string }) {

  const isAdmin = await isCurrentUserAdmin();

  const noteData = await getNote(tradeId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notes</CardTitle>
        {noteData &&
          <CardDescription className="grid gap-2 @md/main:grid-flow-col @md/main:gap-0">
            {noteData.createdAt && 
              <div className="dark:text-yellow-200 flex gap-2">
                <span><AlarmClockPlus /></span>
                <span>{format(noteData.createdAt, "PPpp")}</span>
              </div>
            }
            {noteData.updatedAt &&
              <div className="dark:text-green-200 flex gap-2">
                <span><AlarmClockCheck /></span>
                <span>{format(noteData.updatedAt, "PPpp")}</span>
              </div>
            }
          </CardDescription>
        }
      </CardHeader>
      <CardContent>
        { !noteData ? (
            isAdmin ?
            <CreateNoteForm tradeId={tradeId} /> :
            <p className="text-muted-foreground">No note yet.</p>
          ): 
          <Editor 
            readOnly={!isAdmin}
            noteId={noteData.noteId} 
            note={noteData.note} 
            tradeId={tradeId}
          />
        }
      </CardContent>
    </Card>
  );
}

