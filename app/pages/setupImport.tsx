import { useState } from 'react';
import '../styles/pages/setup.scss';
import { Button, Input } from '@lunalytics/ui';
import SetupImportSQLite from '../components/setup/import/sqlite';

type SourceType = 'json' | 'sqlite' | 'mariadb';

const SetupImport = () => {
  const [source, setSource] = useState<SourceType>('json');
  const [file, setFile] = useState<File | null>(null);
  const [hasContinued, setHasContinued] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const onContinue = () => {
    setHasContinued(true);
  };

  if (hasContinued && file) {
    return (
      <div className="import-wrapper">
        <div className="import-card">
          <h2>Importing from SQLite</h2>

          <SetupImportSQLite file={file} />

          <Button fullWidth variant="flat" as="button">
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="import-wrapper">
      <div className="import-card">
        <h2>Import Monitoring Data</h2>

        <div className="source-switch">
          {['json', 'sqlite', 'mariadb'].map((type) => (
            <button
              key={type}
              className={source === type ? 'active' : ''}
              onClick={() => {
                setSource(type as SourceType);
                setFile(null);
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {(source === 'json' || source === 'sqlite') && (
          <label className={`file-input ${file ? 'has-file' : ''}`}>
            <input
              type="file"
              accept={source === 'json' ? '.json' : '.db,.sqlite,.sqlite3'}
              onChange={onFileChange}
            />

            {!file ? (
              <span>Upload {source === 'json' ? 'JSON' : 'SQLite'} file</span>
            ) : (
              <div className="file-info">
                <strong>{file.name}</strong>
                <small>{formatSize(file.size)}</small>
                <em>Click to replace</em>
              </div>
            )}
          </label>
        )}

        {source === 'mariadb' && (
          <div className="db-form">
            <Input placeholder="Host" />
            <Input placeholder="Port (3306)" />
            <Input placeholder="Database name" />
            <Input placeholder="Username" />
            <Input type="password" placeholder="Password" />
          </div>
        )}

        <Button
          fullWidth
          disabled={!file && source !== 'mariadb'}
          variant="flat"
          as="button"
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SetupImport;
