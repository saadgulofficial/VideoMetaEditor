import SQLite from 'react-native-sqlite-storage';
import { MessageAlert } from '../components'

class SQLiteClass {
    commonError = () => MessageAlert('something went wrong please try again later', 'danger')

    openDataBase = () => {
        return new Promise((resolve, reject) => {
            global.db = SQLite.openDatabase(
                {
                    name: 'VideoMetaData.db',
                    createFromLocation: 1
                },
                async () => { resolve('') },
                err => {
                    console.log('error while creating database =>', err)
                    reject('')
                }
            )
        })
    }

    checkAndCreateTable = (tableName, sql, params) => {
        return new Promise(async (resolve, reject) => {
            try {
                global.db.transaction(function (txn) {
                    txn.executeSql(
                        "SELECT name FROM sqlite_master WHERE type='table' AND name= '" + tableName + "'",
                        [],
                        function (tx, res) {
                            if(res.rows.length == 0) {
                                txn.executeSql("DROP TABLE IF EXISTS '" + tableName + "'", []);
                                txn.executeSql(
                                    sql,
                                    params,
                                    () => { resolve('') }
                                );
                            }
                            else {
                                resolve('')
                            }
                        }
                    );
                });
            } catch(error) {
                this.commonError()
                reject(error)
            }
        })
    }

    executeQuery = (sql, params = []) => new Promise((resolve, reject) => {
        global.db.transaction((trans) => {
            trans.executeSql(sql, params, (trans, results) => {
                resolve(results);
            },
                (error) => {
                    this.commonError()
                    reject(error);
                });
        });
    });

    checkTableExists = (tableName) => new Promise((resolve, reject) => {
        try {
            global.db.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name= '" + tableName + "'",
                    [],
                    function (tx, res) { resolve(res.rows.length) }
                );
            });
        } catch(error) {
            this.commonError()
            reject(error)
        }
    });

    getData = (tableName, getQuery: { query, params }) => {
        return new Promise((resolve, reject) => {
            this.checkTableExists(tableName).then((res) => {
                if(res === 0) {
                    resolve([])
                }
                else {
                    this.executeQuery(getQuery.query, getQuery.params)
                        .then((data: any) => {
                            var rows = data.rows;
                            resolve(rows.raw())
                        })
                        .catch((error) => {
                            console.log('error while getting data ->', error)
                            reject('')
                        })
                }
            })
                .catch((error) => {
                    console.log('error while checking video Meta data table ->', error)
                    reject('')
                })
        })
    }

    insertIntoTable = (insertQuery: { query, values }) => {
        return new Promise((resolve, reject) => {
            this.executeQuery(insertQuery.query, insertQuery.values)
                .then((results) => resolve(results))
                .catch((err) => {
                    console.log('error while inserting  data ->', err)
                    this.commonError()
                    reject('')
                })
        })
    }

    update = (updateQuery: { query, values }) => {
        return new Promise((resolve, reject) => {
            this.executeQuery(updateQuery.query, updateQuery.values)
                .then(() => resolve(''))
                .catch((err) => {
                    console.log('error while updating  data ->', err)
                    this.commonError()
                    reject('')
                })

        })
    }

}


const GSQLite = new SQLiteClass();
export { GSQLite }