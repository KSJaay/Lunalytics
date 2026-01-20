import { useEffect, useState } from 'react';
import initSqlJs, { QueryExecResult } from 'sql.js';

function sqlJsResultToObjects<T = Record<string, any>>(
  result: QueryExecResult[]
): T[] {
  const { columns, values } = result[0];

  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  ) as T[];
}

const formatUptimeKumaData = (data: any[]) => {
  const formatData = (row: any) => {
    switch (row.type) {
    }
  };

  return data.map(formatData);
};

const SQL = await initSqlJs({
  locateFile: () => '/sql-wasm.wasm',
});

const SetupImportSQLite = ({ file }: { file: File }) => {
  const [fileContent, setFileContent] = useState<any>(null);

  useEffect(() => {
    const loadFileData = async () => {
      const buffer = await file.arrayBuffer();
      const db = new SQL.Database(new Uint8Array(buffer));

      const results = db.exec('SELECT * FROM monitor');

      console.log('Monitors:', sqlJsResultToObjects(results));
      setFileContent(sqlJsResultToObjects(results));
    };

    loadFileData();
  }, [file]);

  if (!fileContent) {
    return <div>Loading file...</div>;
  }

  return <div>{JSON.stringify(fileContent, null, 2)}</div>;
};

export default SetupImportSQLite;
