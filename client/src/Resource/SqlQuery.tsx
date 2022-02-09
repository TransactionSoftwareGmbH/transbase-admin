import React from "react";
import { Button, useDataProvider, List } from "react-admin";
import { ResultSet } from "./List";

export function SqlQuery(props) {
  const provider = useDataProvider();

  const [query, setQuery] = React.useState("");
  const [sql, setSql] = React.useState("");
  const [schema, setSchema] = React.useState();
  async function execute() {
    setSql(query);
    const result = await provider.executeQuery(query);
    setSchema(result.schema);
  }

  return (
    <>
      <textarea
        rows={10}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <Button disabled={!query} label="Run" onClick={execute} />
      {sql && schema && (
        <QueryResultTable {...props} sql={sql} schema={schema} />
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
