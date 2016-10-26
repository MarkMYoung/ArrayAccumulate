$(document).ready( function()
{
	QUnit.module( "Array.prototype.accumulate" );
	QUnit.test( "Empty array without context tests", function( qUnit )
	{
		QUnit.expect( 2 + 2 );
		var array = [];

		var accumulateValue = array.accumulate( function empty_array_without_context_accumulator_left( result, each, n, every )
		{return( result );});
		qUnit.strictEqual( accumulateValue, undefined, "Empty array without context: 'accumulate' return value was 'undefined'." );
		var accumulateRightValue = array.accumulateRight( function empty_array_without_context_accumulator_right( result, each, n, every )
		{return( result );});
		qUnit.strictEqual( accumulateRightValue, undefined, "Empty array without context: 'accumulateRight' return value was 'undefined'." );

		// Array.prototype.reduce and Array.prototype.reduceRight require 
		//	if-statements to inspect array length or try-catch blocks to be 
		//	used in situations where the developer does not have prior 
		//	assurance the array has at least one item.  That means, 
		// Array.prototype.reduce has to do something crazy like this...:
		//	var reduceValue = (array.length > 0 ? array : ['default, default']).reduce( function(...){...});
		// ...or something even crazier	like this:
		//	var reduceValue = 'default, default';
		//	try{reduceValue = array.reduce( function(...){...});}catch(){}
		// However, Array.prototype.accumulate can provide a fallback default with simply:
		//	var accumulateValue = array.accumulate( function(...){...}) || 'default, default';
		qUnit.throws( 
			function()
			{
				var reduceValue = array.reduce( function empty_array_without_context_reducer_left( result, each, n, every )
				{return( result );});
			},
			TypeError,
			"Empty array without context: 'reduce' throws 'TypeError' exception."
		);
		qUnit.throws( 
			function()
			{
				var reduceRightValue = array.reduceRight( function empty_array_without_context_reducer_right( result, each, n, every )
				{return( result );});
			},
			TypeError,
			"Empty array without context: 'reduceRight' throws 'TypeError' exception."
		);
	});
	QUnit.test( "Empty array with context tests", function( qUnit )
	{
		var array = [];
		QUnit.expect((array.length * 2) + 2 );
		var contextArg = {'callback':'context', 'accumulated':1,};
		var accumulateValue = array.accumulate( function( result, each, n, every )
		{
			qUnit.strictEqual( this, contextArg, "Empty array with context: 'accumulate' context kept." );
			return( result );
		}, contextArg );
		qUnit.strictEqual( accumulateValue, contextArg, "Empty array with context: 'accumulate' context became the accumulator value." );
		var accumulateRightValue = array.accumulateRight( function empty_array_without_context_accumulator_right( result, each, n, every )
		{
			qUnit.strictEqual( this, contextArg, "Empty array with context: 'accumulateRight' context kept." );
			return( result );
		}, contextArg );
		qUnit.strictEqual( accumulateRightValue, contextArg, "Empty array with context: 'accumulateRight' context became the accumulator value." );
	});
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
	QUnit.test( "Non-empty array without context tests", function( qUnit )
	{
		QUnit.expect( 2 );
		var array = [7, 11, 13];

		var accumulateValue = array.accumulate( function non_empty_array_without_context_accumulator_left( result, each, n, every )
		{return((result || 1) * each );});
		qUnit.strictEqual( accumulateValue, 1001, "Non-empty array without context: 'accumulate' return value was correct value." );
		var accumulateRightValue = array.accumulateRight( function non_empty_array_without_context_accumulator_right( result, each, n, every )
		{return((result || 1) * each );});
		qUnit.strictEqual( accumulateRightValue, 1001, "Non-empty array without context: 'accumulateRight' return value was correct value." );
	});
	QUnit.test( "Non-empty array with context tests", function( qUnit )
	{
		var array = [7, 11, 13];
		QUnit.expect(((array.length * 2) + 2) * 2 );
		var contextArg = {'callback':'context', 'accumulated':null,};

		contextArg.accumulated = 1;
		var accumulateValue = array.accumulate( function non_empty_array_with_context_accumulator_left( result, each, n, every )
		{
			qUnit.strictEqual( this, contextArg, "Non-empty array with context: 'accumulate' context was kept." );
			result.accumulated *= each;
			return( result );
		}, contextArg );
		qUnit.strictEqual( accumulateValue.accumulated, 1001, "Non-empty array with context: 'accumulate' context became the accumulator value." );
		contextArg.accumulated = 1;
		var accumulateRightValue = array.accumulateRight( function non_empty_array_with_context_accumulator_right( result, each, n, every )
		{
			qUnit.strictEqual( this, contextArg, "Non-empty array with context: 'accumulateRight' context was kept." );
			result.accumulated *= each;
			return( result );
		}, contextArg );
		qUnit.strictEqual( accumulateRightValue.accumulated, 1001, "Non-empty array with context: 'accumulateRight' context became the accumulator value." );

		contextArg.accumulated = 1;
		var reduceValue = array.reduce( function non_empty_array_with_context_reducer_left( result, each, n, every )
		{
			// Array.prototype.reduce and Array.prototype.reduceRight gives no 
			//	access to the context or default, default value (depending on 
			//	how the developer wants to use the second parameter).
			qUnit.notStrictEqual( this, contextArg, "Non-empty array with context: 'reduce' context was NOT kept." );
			result.accumulated *= each;
			return( result );
		}, contextArg );
		qUnit.strictEqual( reduceValue.accumulated, 1001, "Non-empty array with context: 'reduce' context still became the accumulator value." );
		contextArg.accumulated = 1;
		var reduceRightValue = array.reduceRight( function non_empty_array_with_context_reducer_right( result, each, n, every )
		{
			qUnit.notStrictEqual( this, contextArg, "Non-empty array with context: 'reduceRight' context was NOT kept." );
			result.accumulated *= each;
			return( result );
		}, contextArg );
		qUnit.strictEqual( reduceRightValue.accumulated, 1001, "Non-empty array with context: 'reduceRight' context still became the accumulator value." );
	});
});
