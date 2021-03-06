import RNFS from 'react-native-fs'
import CommonServices from './CommonService';


class FileManagerClass {
    PATHS = {
        directoryPath: `${RNFS.DownloadDirectoryPath}/VideoMetaData`,
        videosPath: `${RNFS.DownloadDirectoryPath}/VideoMetaData/Videos`,
        videosPathTwo: `${RNFS.DownloadDirectoryPath}/VideoMetaData/VideosBackup`,
        clipsPath: `${RNFS.DownloadDirectoryPath}/VideoMetaData/Clips`,
        clipsPathTwo: `${RNFS.DownloadDirectoryPath}/VideoMetaData/ClipsBackup`,
    }
    EXT = {
        ext1: '.jpg'
    }

    makeDirectory = (path) => {
        return new Promise(async (resolve, reject) => {
            RNFS.exists(path).then((res) => {
                if(res) {
                    resolve('')
                }
                else {
                    RNFS.mkdir(path).then(() => {
                        resolve('done')
                    })
                        .catch((error) => {
                            console.log('Error while making Directory FileManager =>', error)
                            CommonServices.commonError()
                            reject('')
                        })
                }
            })
                .catch((error) => {
                    console.log('Error while checking Exists makeDirectory FileManager =>', error)
                    CommonServices.commonError()
                    reject('')
                })
        })
    }

    writeFile = (path, data) => {
        return new Promise((resolve, reject) => {
            RNFS.writeFile(path, JSON.stringify(data)).then((res) => {
                resolve('done')
            })
                .catch((error) => {
                    // CommonServices.commonError()
                    console.log('error while Writing File FileManager =>', error)
                    reject('')
                })
        })
    }

    readFile = (path) => {
        return new Promise(async (resolve, reject) => {
            this.fileExits(path).then((res) => {
                if(res) {
                    RNFS.readFile(path).then(data => {
                        resolve(JSON.parse(data))
                    })
                        .catch((error) => {
                            console.log('error while reading file FileManager =>', error)
                            reject('')
                        })
                }
                else {
                    resolve(res)
                }
            }).catch(() => reject(''))
        })
    }

    deleteFile = (path) => {
        return new Promise((resolve, reject) => {
            RNFS.exists(path).then((res) => {
                if(res) {
                    RNFS.unlink(path).then(() => {
                        RNFS.scanFile(path)
                            .then(() => {
                                resolve('')
                            })
                            .catch(err => {
                                console.log('error while scanning =>', err);
                                reject('')
                            });
                    })
                        .catch((error) => {
                            console.log('error while deleting file FileManager=>', error)
                            CommonServices.commonError()
                            reject('')
                        })
                }
                else {
                    console.log('file not found for delete FileManager ')
                    reject('')
                }
            })
        })
    }

    fileExits = (path) => {
        return new Promise((resolve, reject) => {
            RNFS.exists(path).then((res) => {
                resolve(res)
            })
                .catch((error) => {
                    console.log('error file checking file exists FileManager =>', error)
                    CommonServices.commonError()
                    reject()
                })
        })
    }

    readDirectory = (path) => {
        return new Promise(async (resolve, reject) => {
            await RNFS.readdir(path).then((data) => {
                resolve(data)
            })
                .catch((error) => {
                    console.log('error while reading directory FileManager =>', error)
                    CommonServices.commonError()
                    reject('')
                })
        })
    }
}


const GFileManager = new FileManagerClass();
export { GFileManager }