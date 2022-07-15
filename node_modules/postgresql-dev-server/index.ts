import path from 'path';
import fs from 'fs';
import process from 'process';
import child_process from 'child_process';
import {ensureHaveBinaries} from './download';


const bin = {
    initdb: path.join(__dirname, 'pgsql', 'bin', 'initdb'),
    postgres: path.join(__dirname, 'pgsql', 'bin', 'postgres'),
    psql: path.join(__dirname, 'pgsql', 'bin', 'psql'),
    createdb: path.join(__dirname, 'pgsql', 'bin', 'createdb')
};

export const configDefaults = {
    pipe: false as boolean,
    fsync: 'off',
    pgdata: process.env.PGDATA || 'var/postgres',
    port: process.env.PGPORT || '8432',
    initSql: []
};

export type Config = typeof configDefaults;

async function start(userConfig?: Partial<Config>) : Promise<child_process.ChildProcess> {
    var config = {...configDefaults, ...(userConfig || {})};
    await ensureHaveBinaries(__dirname);
    var isNew = await ensureInitDb(config.pgdata);
    var proc = await startServer(config);
    if(isNew) {
        try {
            await runInitSql(config);
        } catch (e) {
            proc.kill();
            throw e;
        }
    }
    return proc;
}

function startServer(config: Config) : Promise<child_process.ChildProcess> {
    return new Promise((resolve, reject) => {
        var p = child_process.spawn(bin.postgres, ['-D', config.pgdata, '-c', 'fsync=' + config.fsync, '-p', config.port]);
        if(config.pipe) {
            p.stderr.pipe(process.stderr);
            p.stdout.pipe(process.stdout);
        }
        var ready = false;
        setTimeout(() => {
            if(!ready) { p.kill(); }  // kill if fails to start
        }, 2000);
        p.stderr.on('data', chunk => {
            let chunkStr = chunk.toString();
            if(/database system is ready to accept connections/.test(chunkStr)) {
                success();
            }
            if(/ERROR/.test(chunkStr)) {
                console.error(`[PG ERROR]`, chunkStr);
            }
        });
        p.on('close', (code) => {
            if(!ready) {
                reject(new Error('Failed to start postgresql database'));
            } else {
                console.log('Closing postgresql server');
            }
        });

        function success() {
            ready = true;
            resolve(p);
        }
    });
}

function ensureInitDb(pgdata: string) {
    if(!fs.existsSync(path.join(pgdata, 'PG_VERSION'))) {
        return call(bin.initdb, ['-D', pgdata, '--nosync']).then(() => true);
    } else {
        return Promise.resolve(false);
    }
}

async function runInitSql(config: Config) {
    var p: Promise<any> = Promise.resolve();
    for(var sql of config.initSql) {
        await call(bin.psql, ['-p', config.port, '-h', '127.0.0.1', '-d', 'postgres', '-c', sql]);
    }
}

function call(command: string, args: string[]) {
    return new Promise((resolve, reject) => {
        var p = child_process.spawn(command, args);
        let out = '';
        p.stderr.on('data', chunk => out += chunk.toString());
        p.stderr.on('data', chunk => out += chunk.toString());
        p.on('close', (code) => {
            if(code > 0) {
                reject(new Error(`Process exit code: ${code}:\n\n${out}`))
            } else {
                resolve();
            }
        });
    })
}

export default start;

if(require.main == module) {
    start({pipe: true}).then(pg_proc => {
        pg_proc.on('close', () => {
            process.exit();
        });
        process.on('SIGINT', () => {
            pg_proc.kill('SIGINT');
        });
    });
}
