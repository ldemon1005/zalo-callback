module.exports = {
    base64Data: function(string){
    	let buff = new Buffer(string);
        return buff.toString('base64');
    }
}