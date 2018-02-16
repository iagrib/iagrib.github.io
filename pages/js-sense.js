p("Why JavaScript makes sense", "center", "36px");

p("Did you know about some weird outputs JavaScript can sometimes give? Like that this:");
codeblock(">> {} - []");
p("Evaluates into the following:");
codeblock(`>> {} - []
<< -0`);
line("Yes, negative zero. You might have seen that video called ", link("'Wat'", "https://www.destroyallsoftware.com/talks/wat"), `. It covers some of the weird results JS can produce like the 
one you can see above. It looks funny, but... Seriously, `, pageEl("why", "i"), ` is this even happening? Why negative zero? (And while we're at it, why would anyone even substract an array from 
an object anyway, right?)`);

p("I'm gonna have a look at some of these weird occurances and explain what's happening and why.")

line("Before looking at specific examples, it's worth noting that JavaScript does ", pageEl("not", "u"), ` have a special operator for string concatenation, like single dot (.) in PHP or double 
dot (..) in Lua. Instead, plus (+) operator is used for that, and because of that sometimes what you expect to be addition turns out to be interpreted by JS as string concatenation, and thus both 
operands are converted to string type. Actually, this is what happens when at least one of the operands is not of type 'number' (or instance of Number). With that pointed out, let's jump right 
into it.`);

p("Let's start with an easy one: array plus array.");
codeblock(`>> [] + []
<< ""`);
line("It outputs... an empty string. Might look unexpected at first, but that's just a result of what was said above. This expression is interpreted as ", pageEl("string concatenation", "u"), `, 
because one of the (actually both) operands is not a number. And to concatenate two arrays as strings, JavaScript actually converts them to strings. Arrays are stringified as their values 
separated by commas:`);
codeblock(`>> [1, 2, 3].toString()
<< "1,2,3"`);
p("And an empty array is obviously an empty string:");
codeblock(`>> [].toString()
<< ""`);
p("So, both empty arrays are converted to empty strings, they are concatenated into one empty string.");

line("But wait, what is an array ", pageEl("minus", "i"), " another array? Also an empty string? No, it's different:");
codeblock(`>> [] - []
<< 0`);
line("Now what's going on ", pageEl("here", "i"), "? Let's have a look.");
p(`So, as I already mentioned earlier, '+' operator in JS can be used not only for traditional addition, but also for string concatenation. However, the '-' operator has a single use - 
substraction (the same can be said about other operators and operations, like '*' for multiplication). To perform substraction, JS attempts to convert both operands to numbers. Now, how are 
objects (arrays are objects too) converted to numbers? Using their string representation. As you can see in the above example, array elements are converted to strings and concatenated using ',' 
character to form a single string. So, basically any array with more than one element will always become NaN (not a number) when converted to number type. If there's one element, that one element 
will be converted to number. And if the array is empty... you guessed it right - it will become zero. So, at this point it's clear why [] - [] is 0: empty arrays become numbers (0) and 0 - 0 is 
obviously 0.`);
line(`But why is an empty string (that represents an empty array) converted to a number as 0 and not NaN? It's because "", an empty string, in JavaScript is one of the 'false-like' values, among
with undefined, null, numeric 0, and false itself. Converting any of these to boolean type will give you false. And converting them to number produces 0, as you could expect. While we're 
at it: "false" (as a string) is `, pageEl("not", "u"), ` a false-ish value, even though some would expect it to be. NaN, however, is, but it's somewhat special, so I didn't mention it.`);

line("See, at this point it begins to actually make sense. And by that I don't mean 'you can see why it happens', I actually mean 'it ", pageEl("does", "i"), ` make sense'. Don't think so? That's 
sad. But anyway, let's continue.`);

p("Now let's try to substract an object from an array.");
codeblock(`>> [] - {}
<< NaN`);
p("Obviously, actual objects can't be adequately converted to numbers, hence they become NaN. And performing any mathematical operations on NaN will give you NaN.");
p(`That's pretty much it, but let's try something different. As I mentioned earlier, to convert an object to a number, JS uses its string representation. And .toString() is a special method 
used for that. Let's define it and see what happens:`);
codeblock(`>> [] - {toString: () => "1"}
<< -1`);
p("It now outputs -1, as you'd expect.");

line("But the example from the top of this page, ", pageEl("object minus array", "i"), ", is a lot more interesting. What's happening there? Let's have a look.");
codeblock(`>> {} - []
<< -0`);
p(`According to the previous example, this should output NaN. But it doesn't. Why? Does it matter if the object goes first here? It actually both does and does not, and let me explain what I mean 
by providing another example. Let's create a variable and assign our object to it:`);
codeblock(">> obj = {}");
p("And now perform the substraction:");
codeblock(`>> obj - []
<< NaN`);
p("It now works as expected. But what changed? How is referencing a variable different from typing {} literally?");
p("As I already said, it's a very interesting example. And the answer to the question I just asked is: it's not.");
codeblock(`>> ({}) - [];
<< NaN`);
line("The actual problem with this is not the order or how you reference the object. It's that the curly braces ({}) are being interpreted by the engine not even as an object literal, but as a ",
pageEl("code block", "u"), ". So, this:");
codeblock("{} - []");
p("Is actually the same as:");
codeblock(`{}; // do nothing
-[]`);
p("or just");
codeblock(`-[]`);
p("Which, as you could've guessed, converts the array to a number (0) and interprets this as -0.");
line("But you might still have a question: what in the earth 'negative zero' is? Is it even a real number? How's is different from 'positive' zero? You can read more about it ", link("here",
"https://stackoverflow.com/questions/7223359"), " or ", link("here", "https://en.wikipedia.org/wiki/Signed_zero"), `.`);
p(`And '+' and '-' operators can be used not only in mathematical expressions with two operands, but also with only one, which is the case in the above example. You can use them to perform a type 
conversion and make it look pretty:`);
codeblock(`>> a = "123";
<< "123"

>> +a
<< 123

>> -a
<< -123

>> b = 123
<< 123

>> a + b
<< "123123" // interpreted as string concatenation because 'a' is not a number!

>> +a + b
<< 246 // works fine`);

p(`Explains a lot, doesn't it? Actually, at this point, it's not even worth analysing other examples with  mathematical operations because the above ones show pretty much everything weird that 
can happen there. But still, let's have a quick look at few other things:`);

codeblock(`>> [] + {}
<< "[object Object]"`);
p(`Both operands aren't numbers, so this is interpreted as string concatenation. Hence both operands are converted to string type (empty array is an empty string and object is "[object Object]") 
and concatenated.`);

codeblock(`>> "string" - 123
<< NaN`);
p(`As I already said, unlike the '+' operator, '-' only has one literal use: substraction. And since "string" can't be interpreted as a number, it's converted to number as NaN, which makes the 
result of whole expression NaN.`);

br();

p("Now let's move on to comparison.");
line("If you don't know JS, you might think that you can check if two values are equal in JS using the '==' operator. But in reality, JavaScript has not one but two equality operators: '==' ",
pageEl("and", "i"), ` '==='. The latter is actual 'strict' comparison operator, while the first one is called 'loose comparison' or 'similarity' operator. The difference between them can be seen 
in this example:`)
codeblock(`>> 123 == "123"
<< true

>> 123 === "123"
<< false`);
p("As you see, the '==' operator can perform type conversions to check equality of values, which can sometimes be useful and sometimes lead to unexpected and/or unwanted results.");
p("Like for example that an array is equal to itself but also to not itself:");
codeblock(`>> arr = []
<< []

>> arr == arr
<< true

>> arr == !arr
<< true`);
p(`What is happening here? Well, it's obvious why an array should be equal to itself. But why is it equal to 'not itself' too? Let's see what's happening here. '![]' is false because an array 
isn't a falsey value. False is converted to number type to perform the comparison, it becomes 0. Then, the empty array itself is converted to primitive too. As was mentioned above, an empty array 
string representation is an empty string, which is also converted to number as zero, which is enough for '==' operator to return true, which is obviously not the case with regular (strict) 
comparison operator:`);
codeblock(`>> arr === !arr
<< false`);
p(`You can achieve the same result not only with an empty array, but also with arrays that have a single element which is a false-like value. The point is: unless you know what you're doing, 
use '===' over '==' to avoid this stuff.`);

br();

p(`Alright, let's look at something else. You can say that JavaScript is all about objects. It has primitive data types (string, number, boolean, undefined...), as well as 'object' type itself. 
But there are special object constructors for strings, numbers and booleans:`);
codeblock(`>> new Number(123)
<< 123`);
line("However values created using these constructors are not primitives and are not the same as them, they're objects and ", pageEl("they act like other objects too", "u"), ":");
codeblock(`>> typeof new String
<< "object"

>> new String("hi") === new String("hi")
<< false

>> new Number(100) === 100
<< false`);
line(`As you can see, because of that, two strings or numbers that are represented as objects are not technically equal even if these objects hold the same value, and they're not equal to 
primitives either. It's actually how it's supposed to work, so there's nothing wrong or weird about this behaviour. What `, pageEl("can", "i"), ` look weird, however, is the fact that these 
object constructors even exist, like, why, when there are primitives, right?`);
line("It's actually not that obviously useless, and sometimes you'd want primitives to have object behaviour, like to be ", link("passed by reference",
"https://stackoverflow.com/questions/13104494"), " or be only equal to itself and not other primitive with the same value.");
p("And if you'll want to compare values of two of those objects, there are plenty of ways to:")
codeblock(`>> new Boolean(1) == true // loose comparison
<< true

>> Number(new Number(123)) === 123 // converting to primitive
<< true

>> new String(123).valueOf() === "123" // using .valueOf()
<< true`);

br(4);

line("Aaand that's it. All this behaviour might seem very weird at first, but as you can see it can be explained, and it actually ", pageEl("does", "i"), ` make sense if you think about it.
And it's not like you'd wanna substract arrays from other arrays and multiply them by objects in practice anyway...`);
p(`This post could be much longer if I added every example of JavaScript outputting weird things. But almost all of them are very similar to the above ones and are of the same nature. Maybe 
this post will see a continuation in future, but for now I'll leave it like this.`);
line("Thanks for reading through! If you have any questions or suggestions, feel free to contact me or ", link("create an issue on GitHub", "https://github.com/iagrib/iagrib.github.io/issues"),
", any feedback is greatly appreciated!");