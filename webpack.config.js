let path = require('path');

module.exports = {
	entry: {
		geometry: './js/geometry.js',
		main: './js/main.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist', 'js')
	}
}