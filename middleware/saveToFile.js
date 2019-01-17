const fs = require('fs');
const zlib = require('zlib');

const directoryFiles = fs.readdirSync('./data');

const createDir = (path) => {
	 return new Promise((res, rej) => {
		fs.mkdir(path, { recursive: true }, (err) => {
				if (err) return reject(err);
				else res(path);
		});
	 });
};	

const writeFile = (path, file, data, opts = 'utf8') => {
    return new Promise((res, rej) => {
		createDir(path).then(() => {
			fs.writeFile(`${path}/${file}`, data, opts, (err) => {
				console.log(data);
				console.log(path);
				console.log(file);
				if (err) {
					console.log('error');
				    rej(err)
				} else {
					res();
				}
				Promise.all(directoryFiles.map(filename => {
					return new Promise((resolve, reject) => {
					const fileContents = fs.createReadStream(`./${path}/${file}`);
					const writeStream = fs.createWriteStream(`./${path}/${file}.gz`);
					const zip = zlib.createGzip();
					fileContents.pipe(zip).pipe(writeStream).on('finish', (err) => {
						if (err) {
						  return reject(err);
						} else {
						  resolve();
						}
				})
			  })
			}))
			  .then(console.log('done'));
			});
		});
    });
	
}; 

module.exports = {
	createDir,
    writeFile
}