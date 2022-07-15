import * as os from 'os';
import * as http from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import * as process from 'process';
import ProgressBar from 'progress';

const DEFAULT_DOWNLOAD_URLS = {
    linux: 'https://raw.githubusercontent.com/skyjur/node-postgres-dev-server/master/binaries/postgresql-10.3-1-linux-x64-binaries.tar.gz',
    win32: 'https://raw.githubusercontent.com/skyjur/node-postgres-dev-server/master/binaries/postgresql-10.3-1-windows-x64-binaries.zip',
    darwin: 'https://raw.githubusercontent.com/skyjur/node-postgres-dev-server/master/binaries/postgresql-10.3-1-osx-binaries.zip'
};


function getPostgresql(location: string, user_defined_dowload_urls?: Partial<typeof DEFAULT_DOWNLOAD_URLS>) : Promise<any> {
    var download_urls = {... DEFAULT_DOWNLOAD_URLS, ... (user_defined_dowload_urls || {})};
    var platform = process.env.PLATFORM || os.platform();
    if(platform in download_urls) {
        var url = download_urls[platform];
        var localPath = path.join(location, path.basename(url));
        return downloadFile(url, localPath)
            .then(() => console.log('Extracting postgresql...'))
            .then(() => extract(localPath, location))
            .catch(console.error);
    } else {
        throw new Error(`Have no download link for platform: ${os.platform()}`)
    }
}


function downloadFile(url, localPath) {
    return new Promise((resolve, reject) => {
        if(fs.existsSync(localPath)) {
            return resolve();
        }
        var request = http.get(url, function(response) {
            if(response.statusCode !== 200) {
                reject(new Error('Response code: ' + response.statusCode))
            } else {
                var file = fs.createWriteStream(localPath);
                var bar = new ProgressBar(` ${path.basename(url)} [:bar] :rate/bps :percent :etas`, {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: parseInt(response.headers['content-length']!, 10)
                  });
                response.on('data', chunk => bar.tick(chunk.length));
                response.on('error', (err) => {
                    fs.unlink(localPath, () => null);
                    reject(err);
                });
                response.pipe(file);
                file.on('finish', () => {
                    file.end();
                    resolve();
                });
            }
        });
    });
}

function call(command, args) {
    return new Promise((resolve, reject) => {
        var p = child_process.spawn(command, args);
        p.stderr.pipe(process.stderr);
        p.stdout.pipe(process.stdout);
        p.on('close', (code) => {
            if(code > 0) {
                reject(new Error(`Process exit code: ${code}`))
            } else {
                resolve();
            }
        });
    })
}

function extract(filepath: string, location: string) {
    if(os.platform() == 'win32') {
        return call('PowerShell', ['-Command', `Expand-Archive -Path "${filepath}" -DestinationPath "${location}"`]);
    } else if(/tar.gz$/.test(filepath)) {
        return call('tar', ['-x', '-f', filepath, '-C', location, '--overwrite']);
    } else if(/zip$/.test(filepath)) {
        return call('unzip', ['-qod', location, filepath]);
    } else {
        throw new Error('No rule to extract file');
    }
}

export function ensureHaveBinaries(location: string) {
    if(fs.existsSync(path.join(location, 'pgsql', 'bin'))) {
        return Promise.resolve();
    } else {
        return getPostgresql(location);
    }
}

if(require.main === module) {
    ensureHaveBinaries(__dirname);
}