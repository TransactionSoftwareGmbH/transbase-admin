import { dataProvider } from "./provider/api";
import { DatabaseResource } from "./Resource/Database";
import { SqlEditorResource } from "./Resource/SqlQuery";
import { TableResource } from "./Resource/Table";
import { UserResource } from "./Resource/User";

export async function fetchTransbaseAdminResources() {
  const provider = dataProvider();
  const schema = await provider.introspect().then((it) => it.data);
  return [
    DatabaseResource(),
    UserResource(),
    ...schema.map(TableResource),
    SqlEditorResource(),
  ];
}
