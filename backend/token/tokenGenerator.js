/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

/*
Description: Function for Generator Token
Output: String with Token

Extra-Information:
const tokgen3 = new TokenGenerator(512, TokenGenerator.BASE62);
const tokgen4 = new TokenGenerator(256, TokenGenerator.BASE71);
var t3 = tokgen3.generate();
var t4 = tokgen4.generate();
*/
module.exports.token_generator= function(){
	const TokenGenerator = require('uuid-token-generator');
	const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);
	var t2 = tokgen2.generate();
	return t2;
}