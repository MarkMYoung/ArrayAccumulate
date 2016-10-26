<html lang="en">
<head>
	<meta charset="utf-8"/>
	<style type="text/css" src="https://tc39.github.io/ecma262/ecmarkup.css"></style>
	<style type="text/css" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/github.min.css"></style>
</head>
<body>
<emu-clause id="sec-array.prototype.accumulate">
	<h1><span class="secnum">22.1.3.?</span>Array.prototype.accumulate ( <var>callbackfn</var> [ , <var>thisArg</var> ] )<span class="utils"><span class="anchor"><a href="#sec-array.prototype.accumulate">#</a></span></span></h1>
	<emu-note><span class="note">Note 1</span>
		<p><var>callbackfn</var> should be a function that takes four arguments. <code>accumulate</code> calls the callback, as a function, once for each element present in the array, in ascending order.</p>
		<p><var>callbackfn</var> is called with four arguments: the <var>previousValue</var> (value from the previous call to <var>callbackfn</var>), the <var>currentValue</var> (value of the current element), the <var>currentIndex</var>, and the object being traversed. The first time that callback is called, the <var>previousValue</var> will be equal to <var>thisArg</var> and <var>currentValue</var> will be equal to the first value in the array. If no <var>thisArg</var> was provided, then <var>previousValue</var> will be <emu-val>undefined</emu-val>.</p>
		<p>If a <var>thisArg</var> parameter is provided, it will be used as the <emu-val>this</emu-val> value for each invocation of <var>callbackfn</var>. If it is not provided, <emu-val>undefined</emu-val> is used instead.</p>
		<p><code>accumulate</code> does not directly mutate the object on which it is called but the object may be mutated by the calls to <var>callbackfn</var>.</p>
		<p>The range of elements processed by <code>accumulate</code> is set before the first call to <var>callbackfn</var>. Elements that are appended to the array after the call to <code>accumulate</code> begins will not be visited by <var>callbackfn</var>. If existing elements of the array are changed, their value as passed to <var>callbackfn</var> will be the value at the time <code>accumulate</code> visits them; elements that are deleted after the call to <code>accumulate</code> begins and before being visited are not visited.</p>
		<p>The differences between <code>accumulate</code> and <code>reduce</code> is <code>accumulate</code> 1) always starts iteration at index 0 on non-empty arrays and 2) allows definition of <var>callbackFn</var>'s <emu-val>this</emu-val> context just like <code>every</code>, <code>filter</code>, <code>find</code>, <code>findIndex</code>, <code>forEach</code>, <code>map</code>, and <code>some</code>.  <code>accumulate</code> is otherwise backwards-compatible with <code>reduce</code>.</p>
	</emu-note>
	<p>When the <code>accumulate</code> method is called with one or two arguments, the following steps are taken:</p>
	<emu-alg>
    <ol>
      <li>Let <var>O</var> be ? <emu-xref aoid="ToObject"><a href="#sec-toobject">ToObject</a></emu-xref>(<emu-val>this</emu-val> value).</li>
      <li>Let <var>len</var> be ? <emu-xref aoid="ToLength"><a href="#sec-tolength">ToLength</a></emu-xref>(? <emu-xref aoid="Get"><a href="#sec-get-o-p">Get</a></emu-xref>(<var>O</var>, <code>"length"</code>)).</li>
      <li>If <emu-xref aoid="IsCallable"><a href="#sec-iscallable">IsCallable</a></emu-xref>(<var>callbackfn</var>) is <emu-val>false</emu-val>, throw a <emu-val>TypeError</emu-val> exception.</li>
      <li>If <var>thisArg</var> was supplied, let <var>T</var> be <var>thisArg</var>; else let <var>T</var> be <emu-val>undefined</emu-val>.</li>
      <li>Let <var>accumulator</var> be <var>T</var>.</li>
      <li>Let <var>k</var> be 0.</li>
      <li>If <var>len</var> &ge; 0, then
        <ol>
          <li>Repeat, while <var>k</var> &lt; <var>len</var>
            <ol>
              <li>Let <var>Pk</var> be ! <emu-xref aoid="ToString"><a href="#sec-tostring">ToString</a></emu-xref>(<var>k</var>).</li>
              <li>Let <var>kPresent</var> be ? <emu-xref aoid="HasProperty"><a href="#sec-hasproperty">HasProperty</a></emu-xref>(<var>O</var>, <var>Pk</var>).</li>
              <li>If <var>kPresent</var> is <emu-val>true</emu-val>, then
                <ol>
                  <li>Let <var>kValue</var> be ? <emu-xref aoid="Get"><a href="#sec-get-o-p">Get</a></emu-xref>(<var>O</var>, <var>Pk</var>).</li>
                  <li>Let <var>accumulator</var> be ? <emu-xref aoid="Call"><a href="#sec-call">Call</a></emu-xref>(<var>callbackfn</var>, <var>T</var>, « <var>accumulator</var>, <var>kValue</var>, <var>k</var>, <var>O</var> »).</li>
                </ol>
              </li>
              <li>Increase <var>k</var> by 1.</li>
            </ol>
          </li>
        </ol>
      </li>
      <li>Else</li>
        <ol>
          <li>Set <var>accumulator</var> to <var>thisArg</var>.</li>
        </ol>
        <li>Return <var>accumulator</var>.</li>
	  </ol>
  </emu-alg>
	<emu-note><span class="note">Note 2</span>
		<p>The <code>accumulate</code> function is intentionally generic; it does not require that its <emu-val>this</emu-val> value be an Array object. Therefore it can be transferred to other kinds of objects for use as a method.</p>
	</emu-note>
</emu-clause>
<!-- -->
<emu-clause id="sec-array.prototype.accumulateright">
	<h1><span class="secnum">22.1.3.?</span>Array.prototype.accumulateRight ( <var>callbackfn</var> [ , <var>thisArg</var> ] )<span class="utils"><span class="anchor"><a href="#sec-array.prototype.accumulateright">#</a></span></span></h1>
	<emu-note><span class="note">Note 1</span>
		<p><var>callbackfn</var> should be a function that takes four arguments. <code>accumulateRight</code> calls the callback, as a function, once for each element present in the array, in descending order.</p>
		<p><var>callbackfn</var> is called with four arguments: the <var>previousValue</var> (value from the previous call to <var>callbackfn</var>), the <var>currentValue</var> (value of the current element), the <var>currentIndex</var>, and the object being traversed. The first time the function is called, the <var>previousValue</var> and <var>currentValue</var> will be equal to <var>thisArg</var> and <var>currentValue</var> will be equal to the last value in the array. If no <var>thisArg</var> was provided, then <var>previousValue</var> will be equal to <emu-val>undefined</emu-val></p>
		<p>If a <var>thisArg</var> parameter is provided, it will be used as the <emu-val>this</emu-val> value for each invocation of <var>callbackfn</var>. If it is not provided, <emu-val>undefined</emu-val> is used instead.</p>
		<p><code>accumulateRight</code> does not directly mutate the object on which it is called but the object may be mutated by the calls to <var>callbackfn</var>.</p>
		<p>The range of elements processed by <code>accumulateRight</code> is set before the first call to <var>callbackfn</var>. Elements that are appended to the array after the call to <code>accumulateRight</code> begins will not be visited by <var>callbackfn</var>. If existing elements of the array are changed by <var>callbackfn</var>, their value as passed to <var>callbackfn</var> will be the value at the time <code>accumulateRight</code> visits them; elements that are deleted after the call to <code>accumulateRight</code> begins and before being visited are not visited.</p>
		<p>The differences between <code>accumulateRight</code> and <code>reduceRight</code> is <code>accumulateRight</code> 1) always starts iteration at index <var>k</var> on non-empty arrays and 2) allows definition of <var>callbackFn</var>'s <emu-val>this</emu-val> context just like <code>every</code>, <code>filter</code>, <code>find</code>, <code>findIndex</code>, <code>forEach</code>, <code>map</code>, and <code>some</code>.  <code>accumulateRight</code> is otherwise backwards-compatible with <code>reduceRight</code>.</p>
	</emu-note>
	<p>When the <code>accumulateRight</code> method is called with one or two arguments, the following steps are taken:</p>
	<emu-alg>
    <ol>
      <li>Let <var>O</var> be ? <emu-xref aoid="ToObject"><a href="#sec-toobject">ToObject</a></emu-xref>(<emu-val>this</emu-val> value).</li>
      <li>Let <var>len</var> be ? <emu-xref aoid="ToLength"><a href="#sec-tolength">ToLength</a></emu-xref>(? <emu-xref aoid="Get"><a href="#sec-get-o-p">Get</a></emu-xref>(<var>O</var>, <code>"length"</code>)).</li>
      <li>If <emu-xref aoid="IsCallable"><a href="#sec-iscallable">IsCallable</a></emu-xref>(<var>callbackfn</var>) is <emu-val>false</emu-val>, throw a <emu-val>TypeError</emu-val> exception.</li>
      <li>If <var>thisArg</var> was supplied, let <var>T</var> be <var>thisArg</var>; else let <var>T</var> be <emu-val>undefined</emu-val>.</li>
      <li>Let <var>accumulator</var> be <var>T</var>.</li>
			<li>Let <var>k</var> be <var>len</var>-1.</li>
			<li>If <var>len</var> &ge; 0, then
				<ol>
					<li>Repeat, while <var>k</var> = 0
				    <ol>
              <li>Let <var>Pk</var> be ! 
                <emu-xref aoid="ToString"><a href="#sec-tostring">ToString</a></emu-xref>
                (<var>k</var>).</li>
              <li>Let <var>kPresent</var> be ? 
                <emu-xref aoid="HasProperty"><a href="#sec-hasproperty">HasProperty</a></emu-xref>
                (<var>O</var>, <var>Pk</var>).</li>
              <li>If <var>kPresent</var> is <emu-val>true</emu-val>, then
                <ol>
                  <li>Let <var>kValue</var> be ? 
                    <emu-xref aoid="Get"><a href="#sec-get-o-p">Get</a></emu-xref>
                    (<var>O</var>, <var>Pk</var>).</li>
                  <li>Let <var>accumulator</var> be ? 
                    <emu-xref aoid="Call"><a href="#sec-call">Call</a></emu-xref>
                    (<var>callbackfn</var>, <var>T</var>, « <var>accumulator</var>, <var>kValue</var>, <var>k</var>, <var>O</var> »).</li>
                </ol>
              </li>
              <li>Decrease <var>k</var> by 1.</li>
            </ol>
          </li>
				</ol>
			</li>
      <li>Else</li>
        <ol>
          <li>Set <var>accumulator</var> to <var>thisArg</var>.</li>
        </ol>
  		<li>Return <var>accumulator</var>.</li>
    </ol>
  </emu-alg>
	<emu-note><span class="note">Note 2</span>
		<p>The <code>accumulateRight</code> function is intentionally generic; it does not require that its <emu-val>this</emu-val> value be an Array object. Therefore it can be transferred to other kinds of objects for use as a method.</p>
	</emu-note>
</emu-clause>
</body>
</html>
