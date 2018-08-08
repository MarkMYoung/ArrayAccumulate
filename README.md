# Array.prototype.accumulate and Array.prototype.accumulateRight
Backwards-compatible replacements of `Array.prototype.reduce` and `Array.prototype.reduceRight` that treat its second parameter like `every`, `filter`, `find`, `findIndex`, `forEach`, `map`, and `some`.

# Short Story Long
`Array.prototype.reduce` and `Array.prototype.map` are unique functions in that they can return something other than what was in the array.  However, `reduce` makes a very annoying assumption--if the second parameter is not specified, the first call to your callback will start at index 1 with the acuumlated value already set to the first item in the array.  This behavior might be fine for inline functions, but not reusable code because there is:
 1. no way to know whether processing started at 0 or 1 (or k-1 or k-2), 
 2. no way to know for sure whether a second parameter was provided, or 
 3. no way to know what the second parameter was once beyond the first iteration.  

Because of this assumption, if `reduce` is called on an empty array without a second parameter, an exception is thrown.  On the other hand, if `reduce` is called on an empty array with a second parameter, the second parameter is immediately returned as the result without consulting the callback how to "reduce" an empty array.  So, `accumulate` is `reduce`, but:
 1. it returns `undefined` when used on an empty array without 
a second parameter (instead of throwing an exception), 
 2. iteration always starts on index 0 (or k-1), and 
 3. the second parameter is always available as `this`.

With these changes, `accumulate` and `accumulateRight` act just like `every`, `filter`, `find`, `findIndex`, `forEach`, `map`, and `some`.

# A Case for Simplicity and Consistency
`Array.prototype.reduce` and `Array.prototype.reduceRight` require if-statements to inspect array length or try-catch blocks to be 
used in situations where the developer does not have prior assurance the array has at least one item.  That means, given the array and criterion:
```javascript
let array = 
[
	{"BeginDate":"2016-10-25T14:00:00.000Z", "EndDate":"2016-10-25T17:00:00.000Z"},
	{"BeginDate":"2016-10-25T15:00:00.000Z", "EndDate":"2016-10-25T18:00:00.000Z"},
	{"BeginDate":"2016-10-25T13:00:00.000Z", "EndDate":"2016-10-25T16:00:00.000Z"},
];
let beginDatecriterion = new Date( "2016-10-25T14:00:00.000Z" );
```
`Array.prototype.reduce` has to do something crazy like this...:
```javascript
let reduceValueTernary = (array.length > 0 ? array : ['default, default']).reduce( function(...){...});
```
...or something even crazier like this (because calling `Array.prototype.reduce` or `Array.prototype.reduceRight` on empty array without an initial value throws a `TypeError` exception):
```javascript
let reduceValueTryCatch = 'default, default';
try{reduceValueTryCatch = array.reduce( function(...){...});}catch(){}
```
However, `Array.prototype.accumulate` can provide a fallback default with simply:
```javascript
let accumulateValue = array.accumulate( function(...){...}) || 'default, default';
```

# Examples of Reasonable Backward-Compatibility
`Array.prototype.reduce` on a non-empty array with a context value, passes it as the first parameter to the lambda so does `Array.prototype.accumulate`.
```javascript
array.reduce( function( result, each, n, every )
{
	if( result !== "default, default" )
	{throw( new Error( "Context parameter did not get passed as the first parameter to the lambda." ));}
	return( result );
}, "default, default" );
array.reduceRight( function( result, each, n, every )
{
	if( result !== "default, default" )
	{throw( new Error( "Context parameter did not get passed as the first parameter to the lambda." ));}
	return( result );
}, "default, default" );
array.accumulate( function( result, each, n, every )
{
	if( result !== "default, default" )
	{throw( new Error( "Context parameter did not get passed as the first parameter to the lambda." ));}
	return( result );
}, "default, default" );
array.accumulateRight( function( result, each, n, every )
{
	if( result !== "default, default" )
	{throw( new Error( "Context parameter did not get passed as the first parameter to the lambda." ));}
	return( result );
}, "default, default" );
```

`Array.prototype.reduce` on an empty array with a context value, returns the context value so does `Array.prototype.accumulate`.
```javascript
[].reduce( function(){}, "default, default" );
[].reduceRight( function(){}, "default, default" );
[].accumulate( function(){}, "default, default" );
[].accumulateRight( function(){}, "default, default" );
```

To see what happens on non-empty array without a context value, read [A Case for Reusability](#a-case-for-reusability).

To see what happens on empty arrays without a context value, return to [A Case for Simplicity and Consistency](#a-case-for-simplicity-and-consistency).

# A Case for Reusability
`Array.prototype.filter` allows the removal of items, but not mutation.  `Array.prototype.map` allows mutation of items, but not removal.  These responsibilities of these lambdas might need to be kept separate for reusability in most cases, but in cases where both operations are expensive (for example, due to the length of the array) or information is needed between lambdas, one might want to merge them into an accumulator lambda to provide to `Array.prototype.reduce`.

The following reusable lambdas work in succession.
```javascript
function hydration_mapper( each, n, every )
{return({"BeginDate":new Date( each.BeginDate ), "EndDate":new Date( each.EndDate )});}
function begin_after_date_filter( each, n, every )
{
	if( this instanceof Window )
	{throw( new ReferenceError( "A context parameter must be specified." ));}
	else if( !(this instanceof Date))
	{throw( new TypeError( "The context parameter must be a Date." ));}
	else if( isNaN( this.getTime()))
	{throw( new RangeError( "The context parameter was not a valid Date." ));}

  return( each.BeginDate > this );
}

let filtered = array
	.map( hydration_mapper )
	.filter( begin_after_date_filter, beginDatecriterion );
```
If the developer wants to combine the two, he might be tempted to write something like this.  Again, this is an example of how `reduce` can get in the way, not an example of how to organize code.
```javascript
function begin_after_date_hydration_accumulator( result, each, n, every )
{
	if( this instanceof Window )
	{throw( new ReferenceError( "A context parameter must be specified." ));}
	else if( !(this instanceof Date))
	{throw( new TypeError( "The context parameter must be a Date." ));}
	else if( isNaN( this.getTime()))
	{throw( new RangeError( "The context parameter was not a valid Date." ));}

	result = this === result && [] || result;
	let hydrated = {"BeginDate":new Date( each.BeginDate ), "EndDate":new Date( each.EndDate )};
	if( hydrated.BeginDate > this )
	{result.push( hydrated );}
	return( result );
}
```
However, there is no variation of this reducer that will work.  `this` is uselessly, always `window` (instance of `Window`) and the reducer will never know when `result` should be initialized to an empty array (this is what `Array.prototype.reduce` was trying to help with when it was designed the way it is), and even if the criterion date were expected to be in `result`, it would then need to become an object with metadata (for example, `let criterion = {"afterDate":new Date( "2016-10-25T14:00:00.000Z" ), "filtered":[]};`).  What a mess!  One might think the mess is the result of misuse of the `Array` accumulator, `reduce`.  Actually, the mess is the result of inconsistent handling of the second "context" parameter passed to the accumulator.  The following works just fine.
```javascript
let filtered = array
	.accumulate( begin_after_date_hydration_accumulator, beginDatecriterion );
```
Now the developer has the power of `reduce` with the convenient context parameter that `filter` (and six other `Array` functions) has always enjoyed.

# One Last ~~Rant~~ Example
Let's write a reusable function to find the index of an item in an array (this could be more complex than emulating `indexOf`).  Does the array contain the search criterion? **[Note: This was written before `Array.prototype.findIndex` existed.]**
```javascript
let array = ["a", "b", "c", "d"];
let criterion = "ç";
function containment_checker( each, n, every )
{return( this.localeCompare( each, [], {"usage":"search", "sensitivity":"base"}) == 0 );}
array.some( containment_checker, criterion );
```
It does.  Now, let's use `Array.prototype.accumulate` to "reduce" the array down to the subscript matching the criterion. 
```javascript
function first_index_of_accumulator( result, each, n, every )
{
	if( this instanceof Window )
	{throw( new ReferenceError( "A context parameter must be specified." ));}
	else if( !(this instanceof String || typeof( this ) === 'string'))
	{throw( new TypeError( "The context parameter must be a string or a String." ));}

	result = result === this && -1 || result;
	if( result == -1 && this.localeCompare( each ) == 0 )
	{result = n;}
	return( result );
}
array.accumulate( first_index_of_accumulator, criterion );
array.accumulateRight( first_index_of_accumulator, criterion );
```
Ahh, that was easy for two reasons: 1) `accumulate` was used just like `some` and 2) the expected results were achieved.  'accumulateRight' works too in this case because the array does not contain duplicate elements.

What if the developer forgets to pass the context/search parameter?
> `Uncaught TypeError: The context parameter must be a string or a String.`

What if the developer forgets to pass a string as the context/search parameter?
> `Uncaught ReferenceError: A context parameter must be specified.`

Okay, good.  It's reusable, succinct, and reasonably robust.

Now, for the `Array.prototype.reduce` version.
```javascript
function first_index_of_reducer( criterion )
{
	if( !(criterion instanceof String || typeof( criterion ) === 'string'))
	{throw( new TypeError( "The criterion parameter must be a string or a String." ));}
	return( function( result, each, n, every )
	{
		if( isNaN( parseInt( result, 10 )))
		{result = -1;}

		if( result == -1 && criterion.localeCompare( each ) == 0 )
		{result = n;}
		return( result );
	});
}
array.reduce( first_index_of_reducer( criterion ));
```
Wait a minute, the result was '-1'?  I just accommodated `reduce`'s peculiar use of the second parameter by writing a function factory so what did I do wrong?  Oh, I forgot to provide `reduce` a second parameter.  Let's see what can be done about that.
```javascript
function first_index_of_reducer_v2( criterion )
{
	if( !(criterion instanceof String || typeof( criterion ) === 'string'))
	{throw( new TypeError( "The criterion parameter must be a string or a String." ));}
	// We already have an extra closure, so use it to cache whether an initial value was provided.
	let default_index_provided = false;
	return( function( result, each, n, every )
	{
		if( !default_index_provided )
		{
			if( n == 0 )
			{default_index_provided = true;}
			// Now we will know!
			else
			{throw( new ReferenceError( "An initial index parameter must be specified." ));}
		}
		if( isNaN( parseInt( result, 10 )))
		{result = -1;}

		if( result == -1 && criterion.localeCompare( each ) == 0 )
		{result = n;}
		return( result );
	});
}
array.reduce( first_index_of_reducer_v2( criterion ), -1 );
```
Okay, that works.  As a test, let's just check that `reduceRight` works.  What, an exception was thrown?  Oh, the first index will be 'length - 1' when `reduceRight` is used.
```javascript
function first_index_of_reducer_v3( criterion )
{
	if( !(criterion instanceof String || typeof( criterion ) === 'string'))
	{throw( new TypeError( "The criterion parameter must be a string or a String." ));}
	let default_index_provided = false;
	return( function( result, each, n, every )
	{
		if( !default_index_provided )
		{
			if( n == 0 || n == every.length - 1 )
			{default_index_provided = true;}
			else
			{throw( new ReferenceError( "An initial index parameter must be specified." ));}
		}
		if( isNaN( parseInt( result, 10 )))
		{result = -1;}

		if( result == -1 && criterion.localeCompare( each ) == 0 )
		{result = n;}
		return( result );
	});
}
array.reduce( first_index_of_reducer_v3( criterion ), -1 );
```
Finally, after writing a function factory and remembering a couple extra gotchas, we have a solution that is
 1. inconsistent with all other reusable array functions I might write,
 2. difficult to comprehend, and 
 3. twice the amount of code!
