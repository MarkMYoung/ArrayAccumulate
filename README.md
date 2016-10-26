# Array.prototype.accumulate and Array.prototype.accumulateRight
Backwards-compatible replacements of `Array.prototype.reduce` and `Array.prototype.reduceRight` that treat its second parameter like `every`, `filter`, `find`, `findIndex`, `forEach`, `map`, and `some`.

# Short Story Long
`Array.prototype.reduce` and `Array.prototype.map` are unique functions in that they can return something other than what was in the array.  However, `reduce` makes a very annoying assumption--if the second parameter is not specified, the first call to your callback will start at index 1 with the acuumlated value already set to the first item in the array.  This behavior might be fine for inline functions, but not reusable code because there is no way to know:
 1. whether processing started at 0 or 1 (or k-1 or k-2), 
 2. for sure whether a second parameter was provided, or 
 3. what the second parameter was once beyond the first iteration.  

Because of this assumption, if `reduce` is called on an empty array without a second parameter, an exception is thrown.  On the other hand, if `reduce` is called on an empty array with a second parameter, the second parameter is immediately returned as the result without consulting the callback how to "reduce" an empty array.  So, `accumulate` is `reduce`, but:
 1. it returns `undefined` when used on an empty array without 
a second parameter, 
 2. iteration always starts on index 0 (or k-1), and 
 3. the second parameter is always available as `this`.

With these changes, `accumulate` and `accumulateRight` act just like `every`, `filter`, `find`, `findIndex`, `forEach`, `map`, and `some`.

# A Case for Simplicity and Consistency
`Array.prototype.reduce` and `Array.prototype.reduceRight` require if-statements to inspect array length or try-catch blocks to be 
used in situations where the developer does not have prior assurance the array has at least one item.  That means, given the array and criterion:
```javascript
var array = 
[
	{"BeginDate":"2016-10-25T14:00:00.000Z", "EndDate":"2016-10-25T17:00:00.000Z"},
	{"BeginDate":"2016-10-25T15:00:00.000Z", "EndDate":"2016-10-25T18:00:00.000Z"},
	{"BeginDate":"2016-10-25T13:00:00.000Z", "EndDate":"2016-10-25T16:00:00.000Z"},
];
var beginDatecriterion = new Date( "2016-10-25T14:00:00.000Z" );
```
`Array.prototype.reduce` has to do something crazy like this...:
```javascript
var reduceValueTernary = (array.length > 0 ? array : ['default, default']).reduce( function(...){...});
```
...or something even crazier like this:
```javascript
var reduceValueTryCatch = 'default, default';
try{reduceValueTryCatch = array.reduce( function(...){...});}catch(){}
```
However, `Array.prototype.accumulate` can provide a fallback default with simply:
```javascript
var accumulateValue = array.accumulate( function(...){...}) || 'default, default';
```

# Examples of Reasonable Backward-Compatibility
`Array.prototype.reduce` on a non-empty array with a context value, passes it as the first parameter to the lambda so does `Array.prototype.accumulate`.
```javascript
array.reduce( function( result )
{
	if( result !== "default, default" )
	{throw( new Error( "Context parameter did not get passed as the first parameter to the lambda." ));}
	return( result );
}, "default, default" );
array.reduceRight( function( result )
{
	if( result !== "default, default" )
	{throw( new Error( "Context parameter did not get passed as the first parameter to the lambda." ));}
	return( result );
}, "default, default" );
array.accumulate( function( result )
{
	if( result !== "default, default" )
	{throw( new Error( "Context parameter did not get passed as the first parameter to the lambda." ));}
	return( result );
}, "default, default" );
array.accumulateRight( function( result )
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
	else if( window.isNaN( this.getTime()))
	{throw( new RangeError( "The context parameter was not a valid Date." ));}

  return( each.BeginDate > this );
}

var filtered = array
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
	else if( window.isNaN( this.getTime()))
	{throw( new RangeError( "The context parameter was not a valid Date." ));}

	result = this === result && [] || result;
	var hydrated = {"BeginDate":new Date( each.BeginDate ), "EndDate":new Date( each.EndDate )};
	if( hydrated.BeginDate > this )
	{result.push( hydrated );}
	return( result );
}
```
However, there is no variation of this reducer that will work.  `this` is uselessly, always `window` (instance of `Window`) and the reducer will never know when `result` should be initialized to an empty array (this is what `Array.prototype.reduce` was trying to help with when it was designed this way), and even if the criterion date were expected to be in `result`, it would then need to become an object with metadata (for example, `var criterion = {"afterDate":new Date( "2016-10-25T14:00:00.000Z" ), "filtered":[]};`).  What a mess!  One might think the mess is the result of misuse of `Array` accumulator, `reduce`.  Actually, the mess is the result of inconsistent handling of the second "context" parameter passed to the accumulator.  The following works just fine.
```javascript
var filtered = array
	.accumulate( begin_after_date_hydration_accumulator, beginDatecriterion );
```
Now the developer has the power of `reduce` with the convenient context parameter `filter` has always enjoyed.
