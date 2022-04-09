import React from "react";
import { useDataProvider, List, Button } from "react-admin";
import { TransbaseDataProvider } from "../provider/api";
import Typography from "@mui/material/Typography";
import { ResultSet } from "./ResultSet";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { sql as sqlLang } from "@codemirror/lang-sql";
import RunCircle from "@mui/icons-material/RunCircle";

export function SqlQuery({ schema }) {
  const provider = useDataProvider<TransbaseDataProvider>();

  const [colSchema, setColSchema] = React.useState();
  React.useEffect(() => {
    provider
      .getColumnSchemaByTableNames()
      .then(({ data }) => setColSchema(data));
  }, []);

  const ref = React.useRef<HTMLDivElement>();
  const [querySchema, setQuerySchema] = React.useState();
  const [sqlQuery, setSqlQuery] = React.useState("");
  const editor = React.useMemo(() => {
    if (colSchema && ref.current) {
      return new EditorView({
        state: EditorState.create({
          extensions: [
            basicSetup,
            sqlLang({
              upperCaseKeywords: true,
              schema: colSchema,
            }),
          ],
        }),

        parent: ref.current!,
      });
    }
    return null;
  }, [ref.current, colSchema]);

  async function execute() {
    const query = editor.state.doc.toString();
    setSqlQuery(query);
    const result = await provider.executeQuery(query);
    setQuerySchema(result.schema);
  }

  return (
    <div className="RaLayout-content sql">
      <Typography marginTop={"8px"} variant="h6">
        SQL Editor
      </Typography>
      <div id="editor" ref={ref} />
      <Button
        // disabled={!editor.state.doc.length}
        icon={<RunCircle />}
        label="Run"
        onClick={execute}
      />
      {querySchema && sqlQuery && (
        <QueryResultTable sql={sqlQuery} schema={querySchema} />
      )}
    </div>
  );
}

function QueryResultTable({ sql, schema }) {
  return (
    <List filter={{ sql }}>
      <ResultSet schema={schema} />
    </List>
  );
}
