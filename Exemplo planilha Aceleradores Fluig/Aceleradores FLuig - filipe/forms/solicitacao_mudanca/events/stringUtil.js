String.prototype.equals = function(str){ 
	return !(str!=this); 
};
String.prototype.contains = function(str){ 
	return this.indexOf(str)>-1; 
};
String.prototype.replaceAll = function(from, to){ 
	var str = this.split(from).join(to); 
	return (str); 
};
String.prototype.isEmpty = function(){ 
	return (!this || 0 === this.length); 
};
