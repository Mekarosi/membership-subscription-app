#!/usr/bin/env bash
# Download binaries & repackage them with only necessary files.

for VERSION in '10.3'; do
    wget http://get.enterprisedb.com/postgresql/postgresql-$VERSION-1-linux-x64-binaries.tar.gz
    tar xvvf postgresql-$VERSION-1-linux-x64-binaries.tar.gz
    tar czvvf binaries/postgresql-$VERSION-1-linux-x64-binaries.tar.gz 'pgsql/bin' 'pgsql/lib' 'pgsql/share'
    rm -rf pgsql

    wget http://get.enterprisedb.com/postgresql/postgresql-$VERSION-1-windows-x64-binaries.zip
    unzip postgresql-$VERSION-1-windows-x64-binaries.zip
    zip -r binaries/postgresql-$VERSION-1-windows-x64-binaries.zip 'pgsql/bin' 'pgsql/lib' 'pgsql/share'
    rm -rf pgsql

    wget http://get.enterprisedb.com/postgresql/postgresql-$VERSION-1-osx-binaries.zip
    unzip postgresql-$VERSION-1-osx-binaries.zip
    zip -r binaries/postgresql-$VERSION-1-osx-binaries.zip 'pgsql/bin' 'pgsql/lib' 'pgsql/share'
    rm -rf pgsql
done;