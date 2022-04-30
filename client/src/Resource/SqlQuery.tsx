import React from "react";
import { useDataProvider, List, Button } from "react-admin";
import { TransbaseDataProvider } from "../provider/api";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { ResultSet } from "./ResultSet";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { sql as sqlLang } from "@codemirror/lang-sql";
import RunCircle from "@mui/icons-material/RunCircle";
import { ColumnNamesByTable, TableSchema } from "../types";

export function SqlQuery() {
  const provider = useDataProvider<TransbaseDataProvider>();

  const [colSchema, setColSchema] = React.useState<ColumnNamesByTable>();
  React.useEffect(() => {
    provider
      .getColumnSchemaByTableNames()
      .then(({ data }) => setColSchema(data));
  }, []);

  const ref = React.useRef<HTMLDivElement>(null);
  const [queryResult, setQueryResult] = React.useState<{
    schema?: any;
    error?: any;
  }>();
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
    if (!editor) {
      return;
    }
    const query = editor.state.doc.toString();
    setSqlQuery(query);
    try {
      const result = await provider.executeQuery(query);
      setQueryResult(result);
    } catch (e: any) {
      setQueryResult(e.body);
    }
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
      {queryResult && sqlQuery && queryResult.schema && (
        <QueryResultTable sql={sqlQuery} schema={queryResult.schema} />
      )}
      {queryResult && sqlQuery && queryResult.error && (
        <Alert severity="error">
          <pre className="sql-error">{queryResult.error}</pre>
        </Alert>
      )}
    </div>
  );
}

function QueryResultTable({
  sql,
  schema,
}: {
  sql: string;
  schema: TableSchema;
}) {
  return (
    <List filter={{ sql }}>
      <ResultSet schema={schema} readOnly={true} />
    </List>
  );
}
