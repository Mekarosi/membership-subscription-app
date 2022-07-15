# node-postgresql-dev-server

Start development oriented postgresql server with passwordless logins from npm package.

Install:
```
$ npm i postgresql-dev-server
```

Start a postgresql server cli:

```
$ node node_modules/postgresql-dev-server/index.js
```

Server runs on port 8432 by default and has passwordless logins:

```
node_modules/postgresql-dev-server/pgsql/bin/psql -p 8432 -h 127.0.0.1 -d postgres
```

Start postgresql server from js:

```js
require('postgresql-dev-server').default({
    fsync: 'off', // this is default in order to make db spin faster
    port: '8432',
    pgdata: 'var/postgres',
    initSql: [
        'create database testdb'
    ]
}).then((p) => {
    console.log('Ready!', `PID=${p.pid}`);
});
```

In my project, I start development database, if db configs are not given:

```js
import {Client} from 'pg';

var pgproc?: ChildProcess;

async function getDbClient() {
    if(env.POSTGRES_URI) {
        return new Pool({
            connectionString: env.POSTGRES_URI
        })
    } else {
        var await require('postgresql-dev-server').default({
            initSql: [
                'create database myproject'
            ]
        });
        return new Pool({
            connectionString: 'postgresql://127.0.0.1:8432/myproject'
        })
    }
}
```