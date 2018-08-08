//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
/**
* `Array.prototype.accumulate` and `Array.prototype.accumulateRight` are 
*	backwards-compatible replacements of `Array.prototype.reduce` and 
*	`Array.prototype.reduceRight` that treat its second parameter like 
*	`every`, `filter`, `find`, `findIndex`, `forEach`, `map`, and `some`.
*
* @author Mark M. Young
* @version 2016-04-15
*/
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
(function( undefined )
{
Array.prototype.accumulate = Array.prototype.accumulate 
	|| function Array_prototype_accumulate( callback /*, thisArg*/ )
{
	'use strict';
	if( !this )
	{throw new TypeError( "Array.prototype.accumulate called on null or undefined." );}
	if( typeof( callback ) !== 'function' )
	{throw( new TypeError( ''.concat( callback, ' is not a function' )));}

	let thisArg = arguments.length >= 2 ? arguments[ 1 ] : void 0;
	let value = thisArg, self = Object( this ), len = self.length >>> 0;
	if( len > 0 )
	{
		for( let i = 0; i < len; ++i )
		{
			if( i in self )
			{value = callback.apply( thisArg, [value, self[ i ], i, self]);}
		}
	}
	else
	{value = thisArg;}
	return( value );
};
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
Array.prototype.accumulateRight = Array.prototype.accumulateRight 
	|| function Array_prototype_accumulateRight( callback /*, thisArg*/ )
{
	'use strict';
	if( !this )
	{throw new TypeError( "Array.prototype.accumulateRight called on null or undefined." );}
	if( typeof( callback ) !== 'function' )
	{throw( new TypeError( ''.concat( callback, ' is not a function' )));}

	let thisArg = arguments.length >= 2 ? arguments[ 1 ] : void 0;
	let value = thisArg, self = Object( this ), len = self.length >>> 0;
	if( len > 0 )
	{
		for( let i = len - 1; i >= 0; --i )
		{
			if( i in self )
			{value = callback.apply( thisArg, [value, self[ i ], i, self]);}
		}
	}
	else
	{value = thisArg;}
	return( value );
};
})();
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
