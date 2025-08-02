'use client';

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import {  useState, useRef } from "react";
import ReactQuillNew, { DeltaStatic } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { updateNoteAction } from "@/lib/actions/note";
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type SaveNoteState = {
  message: string;
  errors?: undefined;
} | {
  errors: {
    note?: string[] | undefined;
  };
  message: string;
} | undefined;

export default function Editor (
  { noteId, note, tradeId }:
  {
    noteId: string,
    note: string | null,
    tradeId: string
  }
) {

  const [ deltaValue, setDeltaValue ] = useState<DeltaStatic | undefined>(JSON.parse(note));
  const [ isChanged, setIsChanged ] = useState(false);

  const quillRef = useRef<ReactQuillNew>(null);

  const formats = [ 'list', 'align', 'indent', 'link', 'bold', 'header', 'italic', 'strike', 'background', 'underline' ];

  const toolbarOptions = [
    [ { 'header': [ false, 1, 2, 3, 4, ] } ],
    [ 'bold', 'italic', 'underline', 'strike', 'link' ],
    [ { 'background': [ '', '#491717', '#721F2C', '#CC5A78', '#FFA9A6', '#EED0BC' ] } ],
    [ {'indent': '+1'}, { 'indent': '-1' },],
    [ { 'align': [ '', 'center', 'right', 'justify' ] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }]
  ];

  function handleEditorChange(editor: ReactQuillNew.UnprivilegedEditor) {
    setDeltaValue(editor.getContents());

    if (JSON.stringify(editor.getContents()) !== note) setIsChanged(true);
  }

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        className={cn(
          "min-h-56 **:[&.ql-editor]:before:!text-muted-foreground/50",
          "*:!text-lg *:[&.ql-toolbar]:!border-none **:[&.ql-picker-label]:!text-muted-foreground **:hover:[&.ql-picker-label]:!text-foreground",
          "**:[&>rect]:!stroke-muted-foreground **:hover:[&>rect]:!stroke-foreground **:[&>polygon]:!stroke-muted-foreground **:hover:[&>polygon]:!stroke-foreground",
          "**:[&>path]:!stroke-muted-foreground **:[&>line]:!stroke-muted-foreground **:[&>g]:!stroke-muted-foreground **:[&>polyline]:!stroke-muted-foreground",
          "**:hover:[&>path]:!stroke-foreground **:hover:[&>line]:!stroke-foreground **:hover:[&>g]:!stroke-foreground **:hover:[&>polyline]:!stroke-foreground",
          "*:[&.ql-container]:!border-none",
        )}
        placeholder="Compose a Note..."
        formats={formats}
        modules={{
          toolbar: toolbarOptions
        }}
        theme="snow"
        value={deltaValue}
        readOnly={false}
        onChange={(c, d, s, editor) => handleEditorChange(editor)}
      />
      {isChanged &&
        <SaveNote 
          delta={deltaValue} 
          noteId={noteId} 
          tradeId={tradeId} 
          isChanged={(isChange: boolean) => {
            setIsChanged(isChange);
          }} 
        />
      }
    </div>
  );
}

function SaveNote(
  { delta, noteId, tradeId, isChanged }:
  {
    noteId: string, 
    tradeId: string,
    delta: DeltaStatic | undefined,
    isChanged: (isChange: boolean) => void
  }
) {

  const [ state, setState ] = useState<SaveNoteState>();

  async function onSubmit(formData: FormData) {
    formData.append('note', JSON.stringify(delta));
    const errors = await updateNoteAction(noteId, tradeId, formData);
    setState(errors);
    isChanged(false);
  }

  return (
    <form action={onSubmit}>
      <Button
        type="submit"
      >
        Save
        <Save />
      </Button>
      {state?.errors?.note && state.errors.note.map(error => <p className="text-red-400 mt-2">{error}</p>)}
      {state?.message && <p className="text-red-400 mt-2">{state?.message}</p>}
    </form>
  );
}
