import React from "react";
import { Button, useDataProvider, List } from "react-admin";
import { TransbaseDataProvider } from "../provider/api";
import { ResultSet } from "./ResultSet";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { sql as sqlLang } from "@codemirror/lang-sql";

export function SqlQuery(props) {
  const provider = useDataProvider<TransbaseDataProvider>();
  const ref = React.useRef<HTMLDivElement>();
  const [sqlQuery, setSqlQuery] = React.useState("");
  const [schema, setSchema] = React.useState();
  const editor = React.useMemo(() => {
    return new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, sqlLang()],
      }),
      parent: ref.current!,
    });
  }, [ref.current]);

  async function execute() {
    const query = editor.state.doc.toString();
    setSqlQuery(query);
    const result = await provider.executeQuery(query);
    setSchema(result.schema);
  }

  return (
    <>
      <div id="editor" ref={ref} />
      <Button
        // disabled={!editor.state.doc.length}
        label="Run"
        onClick={execute}
      />
      {schema && sqlQuery && (
        <QueryResultTable {...props} sql={sqlQuery} schema={schema} />
      )}
    </>
  );
}

function QueryResultTable(props) {
  return (
    <List {...props} resource="sql" filter={{ sql: props.sql }}>
      <ResultSet schema={props.schema} />
    </List>
  );
}
