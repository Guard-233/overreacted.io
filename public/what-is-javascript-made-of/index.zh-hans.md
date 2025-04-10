---
title: JavaScript 是由什么构成的？
date: "2019-12-20"
spoiler: 深入理解 JavaScript 的闭包。
---

在使用 JavaScript 的最初几年里，我感觉自己像个冒牌货。即使我可以用框架构建网站，但总觉得缺少了什么。我害怕 JavaScript 的工作面试，因为我对基础知识没有扎实的掌握。

多年来，我形成了一个关于 JavaScript 的心理模型，这给了我信心。在这里，我将分享一个**非常精简**的版本。它以词汇表的形式组织，每个主题只有几句话。

在阅读这篇文章时，试着在心里记录一下你对每个主题的*自信*程度。即使有很多你不太确定的，我也不会评判你！在文章的最后，有一些东西或许能帮到你。

---

- **值 (Value)**：值的概念有点抽象。它是一个“东西”。值对于 JavaScript 就像数字对于数学，或者点对于几何。当你的程序运行时，它的世界充满了值。像 `1`、`2` 和 `420` 这样的数字是值，但有些其他东西也是值，比如这句话：“`"Cows go moo"`”（牛会哞哞叫）。然而，并非*所有东西*都是值。数字是值，但 `if` 语句不是。我们将在下面看到几种不同类型的值。

  - **值的类型 (Type of Value)**：值有几种不同的“类型”。例如，像 `420` 这样的*数字*，像 `"Cows go moo"` 这样的*字符串*，_对象_，以及一些其他类型。你可以通过在某个值前面加上 `typeof` 来了解它的类型。例如，`console.log(typeof 2)` 会打印出 `"number"`。
  - **原始值 (Primitive Values)**：有些值类型是“原始的”。它们包括数字、字符串和一些其他类型。关于原始值的一个特别之处在于，你不能创建更多的原始值，也不能以任何方式改变它们。例如，每次你写 `2`，你都会得到*相同*的值 `2`。你不能在你的程序中“创建”另一个 `2`，也不能让 `2` 这个*值*“变成” `3`。字符串也是如此。
  - **`null` 和 `undefined`**：这是两个特殊的值。它们之所以特殊，是因为有很多事情你不能用它们来做——它们经常会导致错误。通常，`null` 表示某个值是故意缺失的，而 `undefined` 表示某个值是无意中缺失的。然而，何时使用哪个取决于程序员。它们的存在是因为有时一个操作与其使用缺失的值继续执行，不如直接失败更好。

- **相等性 (Equality)**：像“值”一样，相等性是 JavaScript 中的一个基本概念。当两个值是……实际上，我永远不会这么说。如果两个值相等，这意味着它们*是*同一个值。不是两个不同的值，而是一个！例如，`"Cows go moo" === "Cows go moo"` 和 `2 === 2` 是成立的，因为 `2` _就是_ `2`。请注意，我们使用*三个*等号来表示 JavaScript 中这种相等性的概念。

  - **严格相等 (Strict Equality)**：与上面相同。
  - **引用相等 (Referential Equality)**：与上面相同。
  - **宽松相等 (Loose Equality)**：哎哟，这个不一样！宽松相等是我们使用*两个*等号 (`==`) 的时候。即使它们引用的是看起来相似的*不同*的值（例如 `2` 和 `"2"`），也可能被认为是*宽松相等*的。它在 JavaScript 的早期为了方便而添加，但从此以后就引起了无尽的困惑。这个概念不是基本的，但却是错误的常见来源。你可以在一个下雨天学习它的工作原理，但很多人都尽量避免使用它。

- **字面量 (Literal)**：字面量是指你通过在程序中*直接*写下某个值来引用它。例如，`2` 是一个*数字字面量*，而 `"Banana"` 是一个*字符串字面量*。

- **变量 (Variable)**：变量允许你使用一个名称来引用某个值。例如，`let message = "Cows go moo"`。现在你可以写 `message` 而不是每次都在你的代码中重复相同的句子。你以后可能会更改 `message` 以指向另一个值，例如 `message = "I am the walrus"`。请注意，这不会改变*值本身*，而只会改变 `message` 指向的位置，就像一根“电线”。它之前指向 `"Cows go moo"`，现在指向 `"I am the walrus"`。
  - **作用域 (Scope)**：如果整个程序中只能有一个 `message` 变量，那将非常糟糕。相反，当你定义一个变量时，它会在你程序的*一部分*中可用。那一部分称为“作用域”。关于作用域如何工作有一些规则，但通常你可以搜索定义变量的位置周围最近的 `{` 和 `}` 大括号。那个代码“块”就是它的作用域。
  - **赋值 (Assignment)**：当我们写 `message = "I am the walrus"` 时，我们改变了 `message` 变量，使其指向 `"I am the walrus"` 这个值。这被称为赋值，写入或设置变量。
  - **`let` vs `const` vs `var`**：通常你想要使用 `let`。如果你想禁止对这个变量进行赋值，你可以使用 `const`。（有些代码库和同事很迂腐，当只有一个赋值时也强迫你使用 `const`。）如果可以的话，避免使用 `var`，因为它的作用域规则令人困惑。
- **对象 (Object)**：对象是 JavaScript 中一种特殊的值。关于对象很酷的一点是，它们可以与其他值建立连接。例如，一个 `{flavor: "vanilla"}` 对象有一个 `flavor` 属性，它指向 `"vanilla"` 这个值。可以将对象想象成你“自己的”值，上面有很多“电线”连接着。

  - **属性 (Property)**：属性就像从一个对象伸出来并指向某个值的“电线”。它可能会让你想起变量：它有一个名称（比如 `flavor`）并指向一个值（比如 `"vanilla"`）。但与变量不同的是，属性“存在于”对象本身中，而不是代码中的某个地方（作用域）。属性被认为是对象的一部分——但它指向的值不是。
  - **对象字面量 (Object Literal)**：对象字面量是一种通过在程序中*直接*写下对象来创建对象值的方法，比如 `{}` 或 `{flavor: "vanilla"}`。在 `{}` 内部，我们可以有多个以逗号分隔的 `属性: 值` 对。这让我们能够设置从我们的对象出发的属性“电线”指向哪里。
  - **对象标识 (Object Identity)**：我们之前提到过 `2` _等于_ `2`（换句话说，`2 === 2`），因为无论何时我们写 `2`，我们都会“召唤”同一个值。但是无论何时我们写 `{}`，我们总是会得到一个*不同*的值！所以 `{}` *不等于*另一个 `{}`。在控制台中尝试一下：`{} === {}`（结果是 false）。当计算机在我们的代码中遇到 `2` 时，它总是给我们相同的 `2` 值。然而，对象字面量是不同的：当计算机遇到 `{}` 时，它*创建一个新的对象，而这始终是一个新的值*。那么什么是对象标识呢？它是相等性或值相同性的另一个术语。当我们说“`a` 和 `b` 具有相同的标识”时，我们的意思是“`a` 和 `b` 指向*同一个*值”（`a === b`）。当我们说“`a` 和 `b` 具有不同的标识”时，我们的意思是“`a` 和 `b` 指向*不同的*值”（`a !== b`）。
  - **点表示法 (Dot Notation)**：当你想要从一个对象读取属性或给它赋值时，你可以使用点 (`.`) 表示法。例如，如果一个变量 `iceCream` 指向一个对象，该对象的 `flavor` 属性指向 `"chocolate"`，那么写 `iceCream.flavor` 将会得到 `"chocolate"`。
  - **方括号表示法 (Bracket Notation)**：有时你事先不知道想要读取的属性的名称。例如，也许有时你想读取 `iceCream.flavor`，有时你想读取 `iceCream.taste`。方括号 (`[]`) 表示法允许你在*属性名称本身*是一个变量时读取该属性。例如，假设 `let ourProperty = 'flavor'`。那么 `iceCream[ourProperty]` 将会得到 `"chocolate"`。奇怪的是，我们也可以在创建对象时使用它：`{ [ourProperty]: "vanilla" }`。
  - **可变性 (Mutation)**：当有人更改对象的属性以指向不同的值时，我们说该对象被*改变*（mutated）。例如，如果我们声明 `let iceCream = {flavor: "vanilla"}`，我们以后可以用 `iceCream.flavor = "chocolate"` 来*改变*它。请注意，即使我们使用 `const` 来声明 `iceCream`，我们仍然可以改变 `iceCream.flavor`。这是因为 `const` 只会阻止对 `iceCream` *变量本身*的赋值，但我们改变了它指向的对象的*属性* (`flavor`)。有些人完全放弃使用 `const`，因为他们觉得这太具有误导性了。
  - **数组 (Array)**：数组是一种表示事物列表的对象。当你写一个*数组字面量*，比如 `["banana", "chocolate", "vanilla"]`，你实际上创建了一个对象，它的名为 `0` 的属性指向 `"banana"` 字符串值，名为 `1` 的属性指向 `"chocolate"` 值，名为 `2` 的属性指向 `"vanilla"` 值。写成 `{0: ..., 1: ..., 2: ...}` 会很麻烦，这就是数组有用的原因。还有一些内置的方法可以操作数组，比如 `map`、`filter` 和 `reduce`。如果 `reduce` 看起来令人困惑，不要绝望——它对每个人来说都很困惑。
  - **原型 (Prototype)**：如果我们读取一个不存在的属性会发生什么？例如，`iceCream.taste`（但我们的属性名为 `flavor`）。简单的答案是我们会得到特殊的 `undefined` 值。更细致的答案是，JavaScript 中的大多数对象都有一个“原型”。你可以将原型看作每个对象上一个“隐藏的”属性，它决定了“接下来去哪里查找”。因此，如果 `iceCream` 上没有 `taste` 属性，JavaScript 将在其原型上查找 `taste` 属性，然后在*那个*对象的原型上查找，依此类推，只有当它到达这个“原型链”的末尾而没有找到 `.taste` 时，才会返回 `undefined`。你很少会直接与这种机制交互，但它解释了为什么我们的 `iceCream` 对象有一个我们从未定义的 `toString` 方法——它来自原型。

- **函数 (Function)**：函数是一种特殊的值，它只有一个目的：表示你程序中的*一些代码*。如果你不想多次编写相同的代码，函数就非常方便。“调用”一个函数，比如 `sayHi()`，会告诉计算机运行其中的代码，然后返回到程序中它之前所在的位置。在 JavaScript 中有很多定义函数的方法，它们在功能上略有不同。
  - **参数 (Arguments 或 Parameters)**：参数允许你从调用函数的地方向函数传递一些信息：`sayHi("Amelie")`。在函数内部，它们的行为类似于变量。根据你阅读的角度（函数定义或函数调用），它们被称为“arguments”（实参）或“parameters”（形参）。然而，这种术语上的区分是吹毛求疵的，在实践中这两个术语经常互换使用。
  - **函数表达式 (Function Expression)**：之前，我们将一个变量设置为一个*字符串值*，比如 `let message = "I am the walrus"`。事实证明，我们也可以将一个变量设置为一个*函数*，比如 `let sayHi = function() { }`。`=` 后面的东西在这里被称为*函数表达式*。它给了我们一个特殊的值（一个函数），代表了我们的一段代码，所以我们可以在以后需要时调用它。
  - **函数声明 (Function Declaration)**：每次都写类似 `let sayHi = function() { }` 这样的东西会很累，所以我们可以使用一种更短的形式来代替：`function sayHi() { }`。这被称为*函数声明*。我们不是在左边指定变量名，而是将其放在 `function` 关键字之后。这两种风格在很大程度上是可以互换的。
  - **函数提升 (Function Hoisting)**：通常，你只能在使用 `let` 或 `const` 声明并运行之后才能使用该变量。这对于函数来说可能很烦人，因为它们可能需要相互调用，而且很难跟踪哪个函数被哪些其他函数使用以及需要首先定义哪个函数。为了方便起见，当（且仅当！）你使用*函数声明*语法时，它们的定义顺序并不重要，因为它们会被“提升”（hoisted）。这是一种花哨的说法，意思是概念上，它们都会自动移动到作用域的顶部。当你调用它们时，它们都已经被定义了。
  - **`this`**：可能是最容易被误解的 JavaScript 概念，`this` 就像函数的一个特殊参数。你不需要自己将它传递给函数。相反，JavaScript 本身会传递它，这取决于你*如何调用*该函数。例如，使用点 (`.`) 表示法的调用——比如 `iceCream.eat()`——会从 `.` 之前的内容（在我们的例子中是 `iceCream`）获得一个特殊的 `this` 值。函数内部 `this` 的值取决于函数是如何*被调用*的，而不是在哪里定义的。像 `.bind`、`.call` 和 `.apply` 这样的辅助方法让你对 `this` 的值有更多的控制。
  - **箭头函数 (Arrow Functions)**：箭头函数类似于函数表达式。你像这样声明它们：`let sayHi = () => { }`。它们很简洁，并且经常用于单行代码。箭头函数比普通函数*更受限制*——例如，它们根本没有 `this` 的概念。当你在箭头函数内部写 `this` 时，它会使用上面最近的“普通”函数的 `this`。这类似于你使用一个只存在于上面函数中的参数或变量的情况。实际上，这意味着人们在想要在箭头函数内部“看到”与周围代码中相同的 `this` 时会使用箭头函数。
  - **函数绑定 (Function Binding)**：通常，将函数 `f` *绑定*到特定的 `this` 值和参数意味着创建一个*新的*函数，该函数使用这些预定义的值调用 `f`。JavaScript 有一个内置的辅助方法 `.bind` 来做到这一点，但你也可以手动完成。绑定是使嵌套函数“看到”与外部函数相同的 `this` 值的常用方法。但是现在这个用例由箭头函数处理，所以绑定不再那么常用。
  - **调用栈 (Call Stack)**：调用一个函数就像进入一个房间。每次我们调用一个函数时，它内部的变量都会重新初始化。所以每次函数调用都像*构建*一个新的“房间”，其中包含它的代码并进入它。我们函数的变量“存在于”那个房间里。当我们从函数返回时，那个“房间”及其所有变量都会消失。你可以将这些房间想象成一个垂直堆叠的房间——一个*调用栈*。当我们退出一个函数时，我们会回到调用栈中它“下面”的函数。
  - **递归 (Recursion)**：递归意味着一个函数从其自身内部调用自身。当你想要在你刚刚在函数中完成的操作*再次*重复，但使用不同的参数时，这非常有用。例如，如果你正在编写一个抓取网络的搜索引擎，你的 `collectLinks(url)` 函数可能会首先从一个页面收集链接，然后对每个*链接*都*调用自身*，直到它访问所有页面。递归的陷阱在于，很容易编写出永远不会完成的代码，因为一个函数会永远调用自身。如果发生这种情况，JavaScript 将会抛出一个名为“堆栈溢出”的错误来停止它。之所以这样称呼它，是因为它意味着我们的调用栈中堆积了太多的函数调用，以至于它字面意义上地溢出了。
  - **高阶函数 (Higher-Order Function)**：高阶函数是一个处理其他函数的函数，它可以将其他函数作为参数接收或将函数作为返回值返回。乍一看这可能很奇怪，但我们应该记住函数是值，所以我们可以像传递数字、字符串或对象一样传递它们。这种风格可能会被过度使用，但适度使用时非常富有表现力。
  - **回调 (Callback)**：回调实际上不是一个 JavaScript 术语。它更像是一种模式。当你将一个函数作为参数传递给另一个函数，并期望它*稍后调用你的函数*时，就会用到回调。你期望得到一个“回调”。例如，`setTimeout` 接受一个*回调*函数，并在超时后……回调你。但是回调函数并没有什么特别之处。它们是普通的函数，当我们说“回调”时，我们只是在谈论我们的期望。
  - **闭包 (Closure)**：通常，当你退出一个函数时，它所有的变量都会“消失”。这是因为不再需要它们了。但是，如果你在一个函数*内部*声明一个函数呢？那么内部函数以后仍然可以被调用，并且可以读取*外部*函数的变量。在实践中，这非常有用！但要使其工作，外部函数的变量需要“保留”在某个地方。因此在这种情况下，JavaScript 会负责“保持变量存活”，而不是像通常那样“忘记”它们。这被称为“闭包”。虽然闭包通常被认为是 JavaScript 中一个容易被误解的方面，但你可能每天都在多次使用它们而没有意识到！

---

JavaScript 由这些概念以及更多构成。在我能够构建一个正确的心理模型之前，我对我的 JavaScript 知识感到非常焦虑，我想帮助下一代开发人员更快地弥合这一差距。

如果你想和我一起深入探讨这些主题中的每一个，我为你准备了一些东西。**[Just JavaScript](https://justjavascript.com/) 是我对 JavaScript 工作原理的提炼心理模型，它将包含由出色的 [Maggie Appleton](https://illustrated.dev/) 创作的可视化插图**。与这篇文章不同，它的节奏更慢，因此你可以跟上每一个细节。

_Just JavaScript_ 尚处于非常早期的阶段，因此仅以一系列未经润色或编辑的电子邮件的形式提供。如果这个项目听起来很有趣，你可以[注册](https://justjavascript.com/)通过电子邮件接收免费草稿。我将非常感谢你的反馈。谢谢！

```

```
